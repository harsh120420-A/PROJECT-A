from sqlalchemy.orm import Session

from app.models.skill import Skill
from app.models.student_skill import StudentSkill
from app.models.opportunity_skill import OpportunitySkill


def build_match_features(
    db: Session,
    student_id: int,
    opportunity_id: int,
):
    """
    Build numerical features for a student-opportunity pair.

    These features are designed to be used by an ML model later.
    For now, they provide an ML-ready representation of the
    existing rule-based matching system.
    """

    # ---------------------------------------------------------
    # Load opportunity requirements
    # ---------------------------------------------------------

    required_skills = (
        db.query(OpportunitySkill, Skill)
        .join(
            Skill,
            OpportunitySkill.skill_id == Skill.id,
        )
        .filter(
            OpportunitySkill.opportunity_id
            == opportunity_id
        )
        .all()
    )

    # ---------------------------------------------------------
    # Load student's skills
    # ---------------------------------------------------------

    student_skills = (
        db.query(StudentSkill)
        .filter(
            StudentSkill.student_id == student_id
        )
        .all()
    )

    student_skill_map = {
        student_skill.skill_id:
            student_skill.score or 0
        for student_skill in student_skills
    }

    # ---------------------------------------------------------
    # Initialize feature counters
    # ---------------------------------------------------------

    total_required_skills = len(required_skills)

    matched_skills = 0
    partial_skills = 0
    missing_skills = 0

    total_gap = 0
    total_required_score = 0
    total_student_score = 0

    weighted_match_score = 0
    total_weight = 0

    # ---------------------------------------------------------
    # Compare each required skill
    # ---------------------------------------------------------

    for opportunity_skill, skill in required_skills:

        required_score = (
            opportunity_skill.required_score or 50
        )

        student_score = student_skill_map.get(
            skill.id,
            0
        )

        total_required_score += required_score
        total_student_score += student_score

        gap = max(
            0,
            required_score - student_score
        )

        total_gap += gap

        # -----------------------------------------------------
        # Skill classification
        # -----------------------------------------------------

        if student_score >= required_score:

            matched_skills += 1

        elif student_score > 0:

            partial_skills += 1

        else:

            missing_skills += 1

        # -----------------------------------------------------
        # Weighted match
        # -----------------------------------------------------

        weight = max(
            required_score,
            1
        )

        skill_match = min(
            student_score / weight * 100,
            100,
        )

        weighted_match_score += (
            skill_match * weight
        )

        total_weight += weight

    # ---------------------------------------------------------
    # Derived features
    # ---------------------------------------------------------

    if total_weight:
        weighted_match = (
            weighted_match_score
            / total_weight
        )
    else:
        weighted_match = 0

    if total_required_skills:
        skill_coverage = (
            matched_skills
            / total_required_skills
            * 100
        )
    else:
        skill_coverage = 0

    average_required_score = (
        total_required_score
        / total_required_skills
        if total_required_skills
        else 0
    )

    average_student_score = (
        total_student_score
        / total_required_skills
        if total_required_skills
        else 0
    )

    average_gap = (
        total_gap
        / total_required_skills
        if total_required_skills
        else 0
    )

    # ---------------------------------------------------------
    # Return ML feature vector
    # ---------------------------------------------------------

    return {
        "total_required_skills":
            total_required_skills,

        "matched_skills":
            matched_skills,

        "partial_skills":
            partial_skills,

        "missing_skills":
            missing_skills,

        "skill_coverage":
            round(skill_coverage, 2),

        "weighted_match_score":
            round(weighted_match, 2),

        "average_student_score":
            round(average_student_score, 2),

        "average_required_score":
            round(average_required_score, 2),

        "average_skill_gap":
            round(average_gap, 2),

        "total_skill_gap":
            total_gap,
    }