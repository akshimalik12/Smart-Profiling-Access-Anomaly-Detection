import os
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import joblib
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import json

def build_autoencoder(input_dim, latent_dim=8):
    inputs = keras.Input(shape=(input_dim,))
    x = layers.Dense(64, activation='relu')(inputs)
    x = layers.Dense(32, activation='relu')(x)
    latent = layers.Dense(latent_dim, activation='relu')(x)
    x = layers.Dense(32, activation='relu')(latent)
    x = layers.Dense(64, activation='relu')(x)
    outputs = layers.Dense(input_dim, activation='linear')(x)
    model = keras.Model(inputs, outputs, name='autoencoder')
    model.compile(optimizer='adam', loss='mse')
    return model

def load_or_train_models(model_dir):
    """Load models from model_dir if exists, otherwise train quick ones on synthetic data."""
    if_model_path = os.path.join(model_dir, 'if_model.pkl')
    scaler_path = os.path.join(model_dir, 'scaler.pkl')
    ae_path = os.path.join(model_dir, 'ae_model')

    if os.path.exists(if_model_path) and os.path.exists(scaler_path) and os.path.exists(ae_path):
        try:
            IF = joblib.load(if_model_path)
            SCALER = joblib.load(scaler_path)
            AE = tf.keras.models.load_model(ae_path)
            return IF, AE, SCALER
        except Exception:
            # fall through to retrain
            pass

    # Train synthetic models quickly
    rng = np.random.RandomState(0)
    X = rng.normal(size=(1000, 10))
    df = pd.DataFrame(X, columns=[f'f{i}' for i in range(X.shape[1])])

    # scaler
    SCALER = StandardScaler()
    Xs = SCALER.fit_transform(df)

    # Isolation Forest
    IF = IsolationForest(n_estimators=100, contamination=0.05, random_state=42)
    IF.fit(Xs)

    # Autoencoder
    AE = build_autoencoder(input_dim=Xs.shape[1], latent_dim=8)
    AE.fit(Xs, Xs, epochs=10, batch_size=64, verbose=0)

    # Save
    joblib.dump(IF, if_model_path)
    joblib.dump(SCALER, scaler_path)
    AE.save(ae_path, include_optimizer=False)
    return IF, AE, SCALER

def preprocess_dataframe(df):
    # Keep only numeric columns (drop non-numeric)
    df_num = df.select_dtypes(include=[np.number]).copy()
    if df_num.shape[1] == 0:
        raise ValueError('No numeric columns in uploaded CSV')
    # Fill NaNs
    df_num = df_num.fillna(df_num.mean())
    return df_num

def score_dataframe(df, IF_model, AE_model, scaler, top_k=20):
    df_num = preprocess_dataframe(df)
    Xs = scaler.transform(df_num)
    # Isolation Forest scores (negative_outlier_factor or decision_function)
    try:
        if_scores = -IF_model.decision_function(Xs)  # higher -> more anomalous
    except Exception:
        if_scores = -IF_model.score_samples(Xs)

    # Autoencoder reconstruction error
    recon = AE_model.predict(Xs)
    recon_err = np.mean(np.square(recon - Xs), axis=1)

    combined = if_scores + recon_err
    df_result = pd.DataFrame({
        'index': df_num.index,
        'if_score': if_scores,
        'ae_recon_err': recon_err,
        'combined': combined
    })
    df_sorted = df_result.sort_values('combined', ascending=False).reset_index(drop=True)
    top = df_sorted.head(top_k)

    # Prepare a JSON-serializable response
    response = {
        'n_rows': int(df_num.shape[0]),
        'n_features': int(df_num.shape[1]),
        'top_k': top_k,
        'anomalies_count': int((df_sorted['combined'] > np.percentile(df_sorted['combined'], 95)).sum()),
        'top': top.to_dict(orient='records'),
        'summary': {
            'if_mean': float(np.mean(if_scores)),
            'ae_mean': float(np.mean(recon_err)),
            'combined_mean': float(np.mean(combined))
        }
    }
    return response

def save_models_if_needed(IF_model, AE_model, scaler, model_dir):
    # Save to disk if not existing
    if_model_path = os.path.join(model_dir, 'if_model.pkl')
    scaler_path = os.path.join(model_dir, 'scaler.pkl')
    ae_path = os.path.join(model_dir, 'ae_model')
    try:
        if not os.path.exists(if_model_path):
            joblib.dump(IF_model, if_model_path)
        if not os.path.exists(scaler_path):
            joblib.dump(scaler, scaler_path)
        if not os.path.exists(ae_path):
            AE_model_save = AE_model
            AE_model_save.save(ae_path, include_optimizer=False)
    except Exception as e:
        print('Warning: failed to save models:', e)
