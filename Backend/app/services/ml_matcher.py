from sqlalchemy.orm import Session

from app.models.application import Application
from app.services.ml_features import build_match_features


# Minimum number of labelled outcomes required
# before we train a supervised model.
MIN_TRAINING_SAMPLES = 20


def get_training_data(db: Session):
    """
    Build training data from historical application outcomes.

    Selected = 1
    Rejected = 0

    Applications with other statuses are ignored.
    """

    applications = (
        db.query(Application)
        .filter(
            Application.status.in_(
                ["Selected", "Rejected"]
            )
        )
        .all()
    )

    X = []
    y = []

    for application in applications:

        features = build_match_features(
            db=db,
            student_id=application.student_id,
            opportunity_id=application.opportunity_id,
        )

        feature_vector = [
            features["total_required_skills"],
            features["matched_skills"],
            features["partial_skills"],
            features["missing_skills"],
            features["skill_coverage"],
            features["weighted_match_score"],
            features["average_student_score"],
            features["average_required_score"],
            features["average_skill_gap"],
            features["total_skill_gap"],
        ]

        X.append(feature_vector)

        if application.status == "Selected":
            y.append(1)
        else:
            y.append(0)

    return X, y


def get_ml_status(db: Session):
    """
    Determine whether enough historical data exists
    to train a supervised ML model.
    """

    X, y = get_training_data(db)

    selected_count = y.count(1)
    rejected_count = y.count(0)

    total_labelled = len(y)

    enough_data = (
        total_labelled >= MIN_TRAINING_SAMPLES
        and selected_count > 0
        and rejected_count > 0
    )

    return {
        "ready": enough_data,
        "total_labelled_applications": total_labelled,
        "selected_samples": selected_count,
        "rejected_samples": rejected_count,
        "minimum_required_samples":
            MIN_TRAINING_SAMPLES,
        "message": (
            "Enough labelled data available for "
            "ML training."
            if enough_data
            else
            "Not enough labelled application outcomes "
            "for reliable supervised ML training."
        ),
    }


def predict_opportunity_success(
    db: Session,
    student_id: int,
    opportunity_id: int,
):
    """
    Predict opportunity success when enough labelled
    historical data exists.

    Until then, return the existing rule-based
    weighted match score as the fallback.
    """

    features = build_match_features(
        db=db,
        student_id=student_id,
        opportunity_id=opportunity_id,
    )

    ml_status = get_ml_status(db)

    # ---------------------------------------------------------
    # Fallback until sufficient training data exists
    # ---------------------------------------------------------

    if not ml_status["ready"]:

        return {
            "prediction_available": False,

            "method": "rule_based_fallback",

            "predicted_probability":
                round(
                    features["weighted_match_score"],
                    2,
                ),

            "features": features,

            "ml_status": ml_status,

            "message": (
                "ML prediction is not active yet. "
                "The existing matching engine is being "
                "used until sufficient Selected/Rejected "
                "application history is available."
            ),
        }

    # ---------------------------------------------------------
    # ML model will be activated here once enough data exists
    # ---------------------------------------------------------

    return {
        "prediction_available": False,
        "method": "ml_pending",

        "predicted_probability": None,

        "features": features,

        "ml_status": ml_status,

        "message": (
            "Training data is available. "
            "ML model training can now be enabled."
        ),
    }