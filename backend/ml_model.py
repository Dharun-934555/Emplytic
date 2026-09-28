import os
import json
import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any, List, Tuple

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_recall_fscore_support,
    confusion_matrix,
    classification_report
)

MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
MODEL_PATH = os.path.join(MODEL_DIR, "trained_model.joblib")
METRICS_PATH = os.path.join(MODEL_DIR, "metrics.json")

FEATURE_COLUMNS = [
    "age", "gender", "department", "job_role", "years_at_company",
    "years_in_current_role", "monthly_income", "job_level", "job_satisfaction",
    "environment_satisfaction", "work_life_balance", "training_hours",
    "projects_completed", "attendance_rate", "overtime_hours",
    "previous_experience", "promotion_last_5_years", "employee_engagement",
    "absenteeism"
]

CATEGORICAL_FEATURES = ["gender", "department", "job_role"]
NUMERICAL_FEATURES = [col for col in FEATURE_COLUMNS if col not in CATEGORICAL_FEATURES]
TARGET_COLUMN = "performance_group"
CLASSES = ["High Performance", "Medium Performance", "Low Performance"]

def train_and_evaluate_all_models(csv_path: str = None) -> Dict[str, Any]:
    """
    Trains Logistic Regression, Decision Tree, and Random Forest models on the dataset.
    Calculates all metrics dynamically without hardcoding.
    Saves the best model and full evaluation payload.
    """
    os.makedirs(MODEL_DIR, exist_ok=True)

    if not csv_path or not os.path.exists(csv_path):
        csv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "employee_performance.csv"))

    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Dataset CSV not found at {csv_path}")

    df = pd.read_csv(csv_path)

    # Clean data
    df = df.dropna(subset=[TARGET_COLUMN])
    df = df.drop_duplicates()

    X = df[FEATURE_COLUMNS]
    y = df[TARGET_COLUMN]

    # Train/Test Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # Preprocessor
    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])

    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, NUMERICAL_FEATURES),
            ('cat', categorical_transformer, CATEGORICAL_FEATURES)
        ]
    )

    # Define candidate classifiers
    candidate_models = {
        "Random Forest": RandomForestClassifier(n_estimators=120, max_depth=10, random_state=42),
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
        "Decision Tree": DecisionTreeClassifier(max_depth=6, random_state=42)
    }

    model_evaluations = []
    trained_pipelines = {}
    best_score = -1.0
    best_model_name = ""
    best_pipeline = None

    for name, clf in candidate_models.items():
        pipeline = Pipeline(steps=[
            ('preprocessor', preprocessor),
            ('classifier', clf)
        ])

        pipeline.fit(X_train, y_train)
        y_pred = pipeline.predict(X_test)
        
        acc = float(accuracy_score(y_test, y_pred))
        prec, rec, f1, _ = precision_recall_fscore_support(y_test, y_pred, average='weighted', zero_division=0)
        
        # Confusion matrix with label order matching CLASSES
        cm = confusion_matrix(y_test, y_pred, labels=CLASSES).tolist()
        
        # Classification report dict
        clf_report = classification_report(y_test, y_pred, labels=CLASSES, output_dict=True, zero_division=0)

        # Calculate Feature Importances for this model if available
        feature_importance_list = extract_feature_importances(pipeline, NUMERICAL_FEATURES, CATEGORICAL_FEATURES)

        eval_info = {
            "model_name": name,
            "accuracy": round(acc, 4),
            "precision": round(float(prec), 4),
            "recall": round(float(rec), 4),
            "f1_score": round(float(f1), 4),
            "confusion_matrix": cm,
            "classification_report": clf_report,
            "feature_importance": feature_importance_list,
            "is_active": False
        }

        model_evaluations.append(eval_info)
        trained_pipelines[name] = pipeline

        if acc > best_score:
            best_score = acc
            best_model_name = name
            best_pipeline = pipeline

    # Mark active model
    for m in model_evaluations:
        if m["model_name"] == best_model_name:
            m["is_active"] = True

    # Save best pipeline
    joblib.dump(best_pipeline, MODEL_PATH)

    # Feature importances for active model
    active_feature_importances = extract_feature_importances(best_pipeline, NUMERICAL_FEATURES, CATEGORICAL_FEATURES)

    result_payload = {
        "dataset_size": len(df),
        "training_samples": len(X_train),
        "testing_samples": len(X_test),
        "features_count": len(FEATURE_COLUMNS),
        "best_model": best_model_name,
        "active_model": best_model_name,
        "models": model_evaluations,
        "feature_importances": active_feature_importances,
        "trained_at": pd.Timestamp.now().isoformat()
    }

    with open(METRICS_PATH, "w") as f:
        json.dump(result_payload, f, indent=2)

    print(f"ML Pipeline trained successfully. Best Model: {best_model_name} (Accuracy: {best_score:.4f})")
    return result_payload

def extract_feature_importances(pipeline: Pipeline, num_cols: List[str], cat_cols: List[str]) -> List[Dict[str, Any]]:
    """Extracts aggregated feature importance values for raw original features."""
    try:
        classifier = pipeline.named_steps['classifier']
        preprocessor = pipeline.named_steps['preprocessor']
        
        if hasattr(classifier, 'feature_importances_'):
            importances = classifier.feature_importances_
        elif hasattr(classifier, 'coef_'):
            importances = np.mean(np.abs(classifier.coef_), axis=0)
        else:
            return []

        # Get feature names after one-hot encoding
        ohe = preprocessor.named_transformers_['cat'].named_steps['onehot']
        cat_encoded_cols = list(ohe.get_feature_names_out(cat_cols))
        all_encoded_cols = num_cols + cat_encoded_cols

        # Aggregate back to original feature names
        aggregated = {}
        for col_name, imp in zip(all_encoded_cols, importances):
            # find root feature
            root_feature = col_name
            for cat in cat_cols:
                if col_name.startswith(cat + "_"):
                    root_feature = cat
                    break
            aggregated[root_feature] = aggregated.get(root_feature, 0.0) + float(imp)

        # Normalize to percentage sum = 100
        total = sum(aggregated.values()) or 1.0
        result = [
            {"feature": k.replace("_", " ").title(), "raw_feature": k, "importance": round((v / total) * 100, 2)}
            for k, v in aggregated.items()
        ]
        result.sort(key=lambda x: x["importance"], reverse=True)
        return result
    except Exception as e:
        print(f"Warning: Could not extract feature importance: {e}")
        return []

def predict_single_employee(input_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Makes a prediction using the saved trained joblib pipeline.
    """
    if not os.path.exists(MODEL_PATH):
        print("Model file not found, running train_and_evaluate_all_models()...")
        train_and_evaluate_all_models()

    pipeline = joblib.load(MODEL_PATH)
    
    # Prepare DataFrame matching feature columns
    df_input = pd.DataFrame([input_data])[FEATURE_COLUMNS]

    # Predict class & probabilities
    probabilities = pipeline.predict_proba(df_input)[0]
    classes = list(pipeline.classes_)

    # Map class probabilities
    prob_dict = {cls: float(prob) for cls, prob in zip(classes, probabilities)}
    
    high_prob = prob_dict.get("High Performance", 0.0)
    med_prob = prob_dict.get("Medium Performance", 0.0)
    low_prob = prob_dict.get("Low Performance", 0.0)

    predicted_class = pipeline.predict(df_input)[0]
    confidence = float(max(probabilities)) * 100.0

    # Calculate top contributing factor scores for this specific input
    top_factors = []
    if os.path.exists(METRICS_PATH):
        with open(METRICS_PATH, "r") as f:
            metrics_data = json.load(f)
            importances = metrics_data.get("feature_importances", [])
            for item in importances[:6]:
                top_factors.append({
                    "factor": item["feature"],
                    "impact": item["importance"]
                })

    return {
        "predicted_group": str(predicted_class),
        "confidence": round(confidence, 1),
        "high_probability": round(high_prob * 100, 1),
        "medium_probability": round(med_prob * 100, 1),
        "low_probability": round(low_prob * 100, 1),
        "top_factors": top_factors
    }
