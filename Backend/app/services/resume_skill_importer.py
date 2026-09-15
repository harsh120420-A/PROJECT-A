from sqlalchemy.orm import Session

from app.models.student_skill import StudentSkill
from app.services.resume_parser import extract_skills


def import_resume_skills(
    db: Session,
    student_id: int,
    resume_text: str,
):
    """
    Extract skills from resume text and merge them into
    the student's existing skill profile.

    Existing scores are preserved.
    Newly detected skills are added with a baseline score of 50.
    """

    detected_skills = extract_skills(db, resume_text)

    added_skills = []
    existing_skills = []

    for detected in detected_skills:
        skill_id = detected["id"]

        existing = (
            db.query(StudentSkill)
            .filter(
                StudentSkill.student_id == student_id,
                StudentSkill.skill_id == skill_id,
            )
            .first()
        )

        skill_info = {
            "id": detected["id"],
            "name": detected["name"],
            "category": detected["category"],
            "confidence": detected.get("confidence", 0),
            "matched_phrase": detected.get("matched_phrase"),
            "source": detected.get("source"),
        }

        if existing:
            skill_info["score"] = existing.score
            existing_skills.append(skill_info)

        else:
            student_skill = StudentSkill(
                student_id=student_id,
                skill_id=skill_id,
                score=50,
            )

            db.add(student_skill)

            skill_info["score"] = 50
            added_skills.append(skill_info)

    db.commit()

    return {
        "detected_count": len(detected_skills),
        "added_count": len(added_skills),
        "existing_count": len(existing_skills),
        "added_skills": added_skills,
        "existing_skills": existing_skills,
    }