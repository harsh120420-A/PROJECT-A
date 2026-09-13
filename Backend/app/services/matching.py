from sqlalchemy.orm import Session

from ..models import (
    Skill,
    StudentSkill,
    OpportunitySkill,
)


def calculate_opportunity_match(
    db: Session,
    student_id: int,
    opportunity_id: int,
):
    # --------------------------------------------------------
    # Get required skills for the opportunity
    # --------------------------------------------------------

    required_skills = (
        db.query(OpportunitySkill, Skill)
        .join(
            Skill,
            OpportunitySkill.skill_id == Skill.id
        )
        .filter(
            OpportunitySkill.opportunity_id == opportunity_id
        )
        .all()
    )

    # --------------------------------------------------------
    # No required skills
    # --------------------------------------------------------

    if not required_skills:
        return {
            "match_score": 0,
            "match_level": "No Requirements",
            "matched_skills": [],
            "partial_matches": [],
            "missing_skills": [],
            "skill_gaps": [],
            "explanation": "No skills have been specified for this opportunity.",
        }

    # --------------------------------------------------------
    # Get student's skills
    # --------------------------------------------------------

    student_skills = (
        db.query(StudentSkill)
        .filter(
            StudentSkill.student_id == student_id
        )
        .all()
    )

    student_skill_map = {
        student_skill.skill_id: student_skill.score
        for student_skill in student_skills
    }

    # --------------------------------------------------------
    # Containers
    # --------------------------------------------------------

    matched_skills = []
    partial_matches = []
    missing_skills = []
    skill_gaps = []

    total_weight = 0
    weighted_score = 0

    # --------------------------------------------------------
    # Evaluate every required skill
    # --------------------------------------------------------

    for opportunity_skill, skill in required_skills:

        required_score = opportunity_skill.required_score or 50

        student_score = student_skill_map.get(
            skill.id,
            0
        )

        # ----------------------------------------------------
        # Weight
        #
        # Higher required proficiency = higher importance
        # ----------------------------------------------------

        weight = required_score

        total_weight += weight

        # ----------------------------------------------------
        # Calculate skill match percentage
        # ----------------------------------------------------

        if required_score > 0:

            skill_match = min(
                (student_score / required_score) * 100,
                100
            )

        else:
            skill_match = 100 if student_score > 0 else 0

        weighted_score += skill_match * weight

        # ----------------------------------------------------
        # Fully matched
        # ----------------------------------------------------

        if student_score >= required_score:

            matched_skills.append({
                "id": skill.id,
                "name": skill.name,
                "student_score": student_score,
                "required_score": required_score,
                "match_percentage": round(skill_match),
                "status": "Matched",
            })

        # ----------------------------------------------------
        # Partial match
        # ----------------------------------------------------

        elif student_score > 0:

            gap = required_score - student_score

            partial_matches.append({
                "id": skill.id,
                "name": skill.name,
                "student_score": student_score,
                "required_score": required_score,
                "match_percentage": round(skill_match),
                "gap": gap,
                "status": "Partial",
            })

            # -----------------------------------------------
            # Gap severity
            # -----------------------------------------------

            if gap >= 30:
                severity = "Critical"

            elif gap >= 15:
                severity = "High"

            else:
                severity = "Moderate"

            skill_gaps.append({
                "id": skill.id,
                "name": skill.name,
                "student_score": student_score,
                "required_score": required_score,
                "gap": gap,
                "severity": severity,
            })

        # ----------------------------------------------------
        # Missing skill
        # ----------------------------------------------------

        else:

            missing_skills.append({
                "id": skill.id,
                "name": skill.name,
                "student_score": 0,
                "required_score": required_score,
                "match_percentage": 0,
                "status": "Missing",
            })

            skill_gaps.append({
                "id": skill.id,
                "name": skill.name,
                "student_score": 0,
                "required_score": required_score,
                "gap": required_score,
                "severity": (
                    "Critical"
                    if required_score >= 70
                    else "High"
                ),
            })

    # --------------------------------------------------------
    # Overall weighted match
    # --------------------------------------------------------

    if total_weight > 0:

        match_score = round(
            weighted_score / total_weight
        )

    else:

        match_score = 0

    # --------------------------------------------------------
    # Match level
    # --------------------------------------------------------

    if match_score >= 85:
        match_level = "Excellent"

    elif match_score >= 70:
        match_level = "Good"

    elif match_score >= 50:
        match_level = "Partial"

    else:
        match_level = "Low"

    # --------------------------------------------------------
    # Explanation
    # --------------------------------------------------------

    explanation_parts = []

    if matched_skills:

        explanation_parts.append(
            f"{len(matched_skills)} skill(s) fully match the requirements."
        )

    if partial_matches:

        explanation_parts.append(
            f"{len(partial_matches)} skill(s) partially match and need improvement."
        )

    if missing_skills:

        explanation_parts.append(
            f"{len(missing_skills)} required skill(s) are currently missing."
        )

    if not explanation_parts:

        explanation_parts.append(
            "The candidate has no demonstrated skills matching this opportunity."
        )

    explanation = " ".join(explanation_parts)

    # --------------------------------------------------------
    # Final result
    # --------------------------------------------------------

    return {
        "match_score": match_score,
        "match_level": match_level,
        "matched_skills": matched_skills,
        "partial_matches": partial_matches,
        "missing_skills": missing_skills,
        "skill_gaps": skill_gaps,
        "explanation": explanation,
    }