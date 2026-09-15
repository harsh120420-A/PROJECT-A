from sqlalchemy.orm import Session

from app.models.opportunity import Opportunity
from app.services.matching import calculate_opportunity_match


def calculate_resume_opportunity_fit(
    db: Session,
    student_id: int,
    opportunity_id: int,
):
    """
    Calculate opportunity fit using the student's
    current skill profile.

    Resume-derived skills are already incorporated into
    StudentSkill by the resume import pipeline.
    """

    opportunity = (
        db.query(Opportunity)
        .filter(Opportunity.id == opportunity_id)
        .first()
    )

    if not opportunity:
        return None

    match_result = calculate_opportunity_match(
        db=db,
        student_id=student_id,
        opportunity_id=opportunity_id,
    )

    return {
        "opportunity": {
            "id": opportunity.id,
            "title": opportunity.title,
            "company": (
                opportunity.company.company_name
                if getattr(opportunity, "company", None)
                else None
            ),
        },
        "fit_score": match_result["match_score"],
        "fit_level": match_result["match_level"],
        "matched_skills": match_result["matched_skills"],
        "partial_matches": match_result["partial_matches"],
        "missing_skills": match_result["missing_skills"],
        "skill_gaps": match_result["skill_gaps"],
        "explanation": match_result["explanation"],
    }