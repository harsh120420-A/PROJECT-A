from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import (
    User,
    Student,
    Skill,
    StudentSkill,
    Opportunity,
    Company,
    OpportunitySkill,
    Application,
)
from ..auth.dependencies import require_role

router = APIRouter(
    prefix="/student",
    tags=["Student"],
)


# ============================================================
# GET STUDENT PROFILE
# ============================================================

@router.get("/profile")
def get_student_profile(
    current_user: User = Depends(
        require_role("STUDENT")
    ),
    db: Session = Depends(get_db),
):

    student = (
        db.query(Student)
        .filter(
            Student.user_id == current_user.id
        )
        .first()
    )

    if not student:

        raise HTTPException(
            status_code=404,
            detail="Student profile not found.",
        )

    return {
        "id": student.id,
        "user_id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "career_goal": student.career_goal,
        "readiness": student.readiness,
    }


# ============================================================
# GET STUDENT SKILLS
# ============================================================

@router.get("/skills")
def get_student_skills(
    current_user: User = Depends(
        require_role("STUDENT")
    ),
    db: Session = Depends(get_db),
):

    student = (
        db.query(Student)
        .filter(
            Student.user_id == current_user.id
        )
        .first()
    )

    if not student:

        raise HTTPException(
            status_code=404,
            detail="Student profile not found.",
        )

    results = (
        db.query(
            StudentSkill,
            Skill,
        )
        .join(
            Skill,
            StudentSkill.skill_id == Skill.id,
        )
        .filter(
            StudentSkill.student_id == student.id
        )
        .all()
    )

    skills = []

    for student_skill, skill in results:

        skills.append({
            "id": skill.id,
            "name": skill.name,
            "category": skill.category,
            "score": student_skill.score,
        })

    return skills


# ============================================================
# STUDENT DASHBOARD
# ============================================================

@router.get("/dashboard")
def get_student_dashboard(
    current_user: User = Depends(
        require_role("STUDENT")
    ),
    db: Session = Depends(get_db),
):

    student = (
        db.query(Student)
        .filter(
            Student.user_id == current_user.id
        )
        .first()
    )

    if not student:

        raise HTTPException(
            status_code=404,
            detail="Student profile not found.",
        )

    skill_count = (
        db.query(StudentSkill)
        .filter(
            StudentSkill.student_id == student.id
        )
        .count()
    )

    return {
        "student": {
            "id": student.id,
            "name": current_user.name,
            "career_goal": student.career_goal,
            "readiness": student.readiness,
        },

        "stats": {
            "skills": skill_count,
            "skill_gaps": 0,
            "matches": 0,
            "applications": 0,
        },
    }

# ============================================================
# GET ALL ACTIVE OPPORTUNITIES
# ============================================================

@router.get("/opportunities")
def get_opportunities(
    current_user: User = Depends(
        require_role("STUDENT")
    ),
    db: Session = Depends(get_db),
):

    opportunities = (
        db.query(
            Opportunity,
            Company,
        )
        .join(
            Company,
            Opportunity.company_id == Company.id,
        )
        .filter(
            Opportunity.status == "Active"
        )
        .order_by(
            Opportunity.id.desc()
        )
        .all()
    )

    result = []

    for opportunity, company in opportunities:

        required_skills = (
            db.query(Skill)
            .join(
                OpportunitySkill,
                OpportunitySkill.skill_id == Skill.id,
            )
            .filter(
                OpportunitySkill.opportunity_id
                == opportunity.id
            )
            .all()
        )

        result.append({
            "id": opportunity.id,
            "title": opportunity.title,
            "company": company.company_name,
            "location": opportunity.location,
            "mode": opportunity.mode,
            "duration": opportunity.duration,
            "type": opportunity.type,
            "description": opportunity.description,
            "deadline": opportunity.deadline,
            "skills": [
                skill.name
                for skill in required_skills
            ],
        })

    return result

# ============================================================
# GET SINGLE OPPORTUNITY
# ============================================================

@router.get("/opportunities/{opportunity_id}")
def get_opportunity(
    opportunity_id: int,
    current_user: User = Depends(
        require_role("STUDENT")
    ),
    db: Session = Depends(get_db),
):

    opportunity_data = (
        db.query(
            Opportunity,
            Company,
        )
        .join(
            Company,
            Opportunity.company_id == Company.id,
        )
        .filter(
            Opportunity.id == opportunity_id
        )
        .first()
    )

    if not opportunity_data:

        raise HTTPException(
            status_code=404,
            detail="Opportunity not found.",
        )

    opportunity, company = opportunity_data

    required_skills = (
        db.query(Skill)
        .join(
            OpportunitySkill,
            OpportunitySkill.skill_id == Skill.id,
        )
        .filter(
            OpportunitySkill.opportunity_id
            == opportunity.id
        )
        .all()
    )

    return {
        "id": opportunity.id,
        "title": opportunity.title,
        "company": company.company_name,
        "location": opportunity.location,
        "mode": opportunity.mode,
        "duration": opportunity.duration,
        "type": opportunity.type,
        "description": opportunity.description,
        "deadline": opportunity.deadline,
        "skills": [
            skill.name
            for skill in required_skills
        ],
    }


# ============================================================
# GET OPPORTUNITY WITH STUDENT MATCH
# ============================================================

@router.get(
    "/opportunities/{opportunity_id}/match"
)
def get_opportunity_match(
    opportunity_id: int,
    current_user: User = Depends(
        require_role("STUDENT")
    ),
    db: Session = Depends(get_db),
):

    # --------------------------------------------------------
    # Find student
    # --------------------------------------------------------

    student = (
        db.query(Student)
        .filter(
            Student.user_id == current_user.id
        )
        .first()
    )

    if not student:

        raise HTTPException(
            status_code=404,
            detail="Student profile not found.",
        )


    # --------------------------------------------------------
    # Find opportunity
    # --------------------------------------------------------

    opportunity_data = (
        db.query(
            Opportunity,
            Company,
        )
        .join(
            Company,
            Opportunity.company_id == Company.id,
        )
        .filter(
            Opportunity.id == opportunity_id
        )
        .first()
    )

    if not opportunity_data:

        raise HTTPException(
            status_code=404,
            detail="Opportunity not found.",
        )

    opportunity, company = opportunity_data


    # --------------------------------------------------------
    # Required skills
    # --------------------------------------------------------

    required_skills = (
        db.query(Skill)
        .join(
            OpportunitySkill,
            OpportunitySkill.skill_id == Skill.id,
        )
        .filter(
            OpportunitySkill.opportunity_id
            == opportunity.id
        )
        .all()
    )


    # --------------------------------------------------------
    # Student skills
    # --------------------------------------------------------

    student_skills = (
        db.query(
            Skill,
            StudentSkill,
        )
        .join(
            StudentSkill,
            StudentSkill.skill_id == Skill.id,
        )
        .filter(
            StudentSkill.student_id == student.id
        )
        .all()
    )


    student_skill_map = {
        skill.name.lower(): student_skill.score
        for skill, student_skill
        in student_skills
    }


    # --------------------------------------------------------
    # Calculate match
    # --------------------------------------------------------

    matched_skills = []
    missing_skills = []

    total_score = 0

    for skill in required_skills:

        score = student_skill_map.get(
            skill.name.lower(),
            0,
        )

        if score > 0:

            matched_skills.append({
                "name": skill.name,
                "score": score,
            })

            total_score += score

        else:

            missing_skills.append(
                skill.name
            )


    if required_skills:

        match_percentage = round(
            (
                total_score
                / (len(required_skills) * 100)
            )
            * 100
        )

    else:

        match_percentage = 0


    return {
        "opportunity": {
            "id": opportunity.id,
            "title": opportunity.title,
            "company": company.company_name,
        },

        "match": match_percentage,

        "matched_skills": matched_skills,

        "missing_skills": missing_skills,
    }

# ============================================================
# APPLY TO OPPORTUNITY
# ============================================================

@router.post("/opportunities/{opportunity_id}/apply")
def apply_to_opportunity(
    opportunity_id: int,
    current_user: User = Depends(
        require_role("STUDENT")
    ),
    db: Session = Depends(get_db),
):

    # --------------------------------------------------------
    # Find student
    # --------------------------------------------------------

    student = (
        db.query(Student)
        .filter(
            Student.user_id == current_user.id
        )
        .first()
    )

    if not student:

        raise HTTPException(
            status_code=404,
            detail="Student profile not found.",
        )


    # --------------------------------------------------------
    # Find opportunity
    # --------------------------------------------------------

    opportunity = (
        db.query(Opportunity)
        .filter(
            Opportunity.id == opportunity_id,
            Opportunity.status == "Active",
        )
        .first()
    )

    if not opportunity:

        raise HTTPException(
            status_code=404,
            detail="Opportunity not found or inactive.",
        )


    # --------------------------------------------------------
    # Check existing application
    # --------------------------------------------------------

    existing_application = (
        db.query(Application)
        .filter(
            Application.student_id == student.id,
            Application.opportunity_id == opportunity_id,
        )
        .first()
    )

    if existing_application:

        raise HTTPException(
            status_code=400,
            detail="You have already applied to this opportunity.",
        )


    # --------------------------------------------------------
    # Create application
    # --------------------------------------------------------

    application = Application(
        student_id=student.id,
        opportunity_id=opportunity_id,
        status="Applied",
    )

    db.add(application)

    db.commit()

    db.refresh(application)


    return {
        "message": "Application submitted successfully",

        "application": {
            "id": application.id,
            "student_id": application.student_id,
            "opportunity_id": application.opportunity_id,
            "status": application.status,
            "applied_at": application.applied_at,
        },
    }


# ============================================================
# GET STUDENT APPLICATIONS
# ============================================================

@router.get("/applications")
def get_student_applications(
    current_user: User = Depends(
        require_role("STUDENT")
    ),
    db: Session = Depends(get_db),
):

    # --------------------------------------------------------
    # Find student
    # --------------------------------------------------------

    student = (
        db.query(Student)
        .filter(
            Student.user_id == current_user.id
        )
        .first()
    )

    if not student:

        raise HTTPException(
            status_code=404,
            detail="Student profile not found.",
        )


    # --------------------------------------------------------
    # Get applications
    # --------------------------------------------------------

    applications = (
        db.query(
            Application,
            Opportunity,
            Company,
        )
        .join(
            Opportunity,
            Application.opportunity_id
            == Opportunity.id,
        )
        .join(
            Company,
            Opportunity.company_id
            == Company.id,
        )
        .filter(
            Application.student_id == student.id
        )
        .order_by(
            Application.id.desc()
        )
        .all()
    )


    return [
        {
            "id": application.id,
            "opportunity_id": opportunity.id,
            "title": opportunity.title,
            "company": company.company_name,
            "location": opportunity.location,
            "mode": opportunity.mode,
            "duration": opportunity.duration,
            "status": application.status,
            "applied_at": application.applied_at,
        }

        for application, opportunity, company
        in applications
    ]