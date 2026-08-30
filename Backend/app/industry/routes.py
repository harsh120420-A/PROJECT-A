from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import (
    User,
    Company,
    Opportunity,
    Application,
    Student,
    Skill,
    StudentSkill,
)
from ..auth.dependencies import require_role


router = APIRouter(
    prefix="/industry",
    tags=["Industry"],
)


# ============================================================
# SCHEMAS
# ============================================================

class OpportunityCreate(BaseModel):

    title: str

    type: str

    description: str | None = None

    location: str | None = None

    mode: str | None = None

    duration: str | None = None

    deadline: date | None = None


# ============================================================
# HELPER — GET COMPANY FOR CURRENT USER
# ============================================================

def get_current_company(
    current_user: User,
    db: Session,
):

    company = (
        db.query(Company)
        .filter(
            Company.user_id == current_user.id
        )
        .first()
    )

    if not company:

        raise HTTPException(
            status_code=404,
            detail="Company profile not found.",
        )

    return company


# ============================================================
# CREATE OPPORTUNITY
# ============================================================

@router.post("/opportunities")
def create_opportunity(
    request: OpportunityCreate,
    current_user: User = Depends(
        require_role("INDUSTRY")
    ),
    db: Session = Depends(get_db),
):

    company = get_current_company(
        current_user,
        db,
    )

    opportunity = Opportunity(
        company_id=company.id,
        title=request.title,
        type=request.type,
        description=request.description,
        location=request.location,
        mode=request.mode,
        duration=request.duration,
        deadline=request.deadline,
        status="Active",
    )

    db.add(opportunity)

    db.commit()

    db.refresh(opportunity)

    return {
        "message": "Opportunity created successfully",

        "opportunity": {
            "id": opportunity.id,
            "company_id": opportunity.company_id,
            "title": opportunity.title,
            "type": opportunity.type,
            "description": opportunity.description,
            "location": opportunity.location,
            "mode": opportunity.mode,
            "duration": opportunity.duration,
            "deadline": opportunity.deadline,
            "status": opportunity.status,
        },
    }


# ============================================================
# GET MY OPPORTUNITIES
# ============================================================

@router.get("/opportunities")
def get_my_opportunities(
    current_user: User = Depends(
        require_role("INDUSTRY")
    ),
    db: Session = Depends(get_db),
):

    company = get_current_company(
        current_user,
        db,
    )

    opportunities = (
        db.query(Opportunity)
        .filter(
            Opportunity.company_id == company.id
        )
        .order_by(
            Opportunity.id.desc()
        )
        .all()
    )

    return [
        {
            "id": opportunity.id,
            "company_id": opportunity.company_id,
            "title": opportunity.title,
            "type": opportunity.type,
            "description": opportunity.description,
            "location": opportunity.location,
            "mode": opportunity.mode,
            "duration": opportunity.duration,
            "deadline": opportunity.deadline,
            "status": opportunity.status,
        }

        for opportunity in opportunities
    ]


# ============================================================
# DELETE OPPORTUNITY
# ============================================================

@router.delete("/opportunities/{opportunity_id}")
def delete_opportunity(
    opportunity_id: int,
    current_user: User = Depends(
        require_role("INDUSTRY")
    ),
    db: Session = Depends(get_db),
):

    company = get_current_company(
        current_user,
        db,
    )

    opportunity = (
        db.query(Opportunity)
        .filter(
            Opportunity.id == opportunity_id,
            Opportunity.company_id == company.id,
        )
        .first()
    )

    if not opportunity:

        raise HTTPException(
            status_code=404,
            detail="Opportunity not found.",
        )

    db.delete(opportunity)

    db.commit()

    return {
        "message": "Opportunity deleted successfully"
    }

# ============================================================
# GET CANDIDATES FOR AN OPPORTUNITY
# ============================================================

@router.get(
    "/opportunities/{opportunity_id}/candidates"
)
def get_candidates(
    opportunity_id: int,
    current_user: User = Depends(
        require_role("INDUSTRY")
    ),
    db: Session = Depends(get_db),
):

    # --------------------------------------------------------
    # Find company
    # --------------------------------------------------------

    company = get_current_company(
        current_user,
        db,
    )


    # --------------------------------------------------------
    # Find opportunity owned by this company
    # --------------------------------------------------------

    opportunity = (
        db.query(Opportunity)
        .filter(
            Opportunity.id == opportunity_id,
            Opportunity.company_id == company.id,
        )
        .first()
    )

    if not opportunity:

        raise HTTPException(
            status_code=404,
            detail="Opportunity not found.",
        )


    # --------------------------------------------------------
    # Get candidates
    # --------------------------------------------------------

    candidates = (
        db.query(
            Application,
            Student,
            User,
        )
        .join(
            Student,
            Application.student_id == Student.id,
        )
        .join(
            User,
            Student.user_id == User.id,
        )
        .filter(
            Application.opportunity_id
            == opportunity_id
        )
        .order_by(
            Application.id.desc()
        )
        .all()
    )


    return [
        {
            "application_id": application.id,
            "student_id": student.id,
            "name": user.name,
            "email": user.email,
            "career_goal": student.career_goal,
            "readiness": student.readiness,
            "application_status": application.status,
            "applied_at": application.applied_at,
        }

        for application, student, user
        in candidates
    ]

# ============================================================
# GET CANDIDATE PROFILE
# ============================================================

@router.get("/candidates/{student_id}")
def get_candidate_profile(
    student_id: int,
    current_user: User = Depends(
        require_role("INDUSTRY")
    ),
    db: Session = Depends(get_db),
):

    company = get_current_company(
        current_user,
        db,
    )

    # --------------------------------------------------------
    # Make sure this student applied to this company's
    # opportunity
    # --------------------------------------------------------

    application = (
        db.query(Application)
        .join(
            Opportunity,
            Application.opportunity_id == Opportunity.id,
        )
        .filter(
            Application.student_id == student_id,
            Opportunity.company_id == company.id,
        )
        .first()
    )

    if not application:

        raise HTTPException(
            status_code=404,
            detail="Candidate not found.",
        )

    # --------------------------------------------------------
    # Student + User
    # --------------------------------------------------------

    student_data = (
        db.query(Student, User)
        .join(
            User,
            Student.user_id == User.id,
        )
        .filter(
            Student.id == student_id
        )
        .first()
    )

    if not student_data:

        raise HTTPException(
            status_code=404,
            detail="Student not found.",
        )

    student, user = student_data

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

    skills = [
        {
            "id": skill.id,
            "name": skill.name,
            "category": skill.category,
            "score": student_skill.score,
        }
        for skill, student_skill in student_skills
    ]

    return {
        "student": {
            "id": student.id,
            "name": user.name,
            "email": user.email,
            "career_goal": student.career_goal,
            "readiness": student.readiness,
        },

        "skills": skills,

        "application": {
            "id": application.id,
            "opportunity_id": application.opportunity_id,
            "status": application.status,
            "applied_at": application.applied_at,
        },
    }

# ============================================================
# UPDATE APPLICATION STATUS
# ============================================================

class ApplicationStatusUpdate(BaseModel):

    status: str


@router.patch(
    "/applications/{application_id}/status"
)
def update_application_status(
    application_id: int,
    request: ApplicationStatusUpdate,
    current_user: User = Depends(
        require_role("INDUSTRY")
    ),
    db: Session = Depends(get_db),
):

    company = get_current_company(
        current_user,
        db,
    )

    # --------------------------------------------------------
    # Validate status
    # --------------------------------------------------------

    allowed_statuses = {
        "Applied",
        "Shortlisted",
        "Rejected",
        "Selected",
    }

    if request.status not in allowed_statuses:

        raise HTTPException(
            status_code=400,
            detail=(
                "Status must be Applied, Shortlisted, "
                "Rejected, or Selected."
            ),
        )

    # --------------------------------------------------------
    # Find application belonging to this company
    # --------------------------------------------------------

    application = (
        db.query(Application)
        .join(
            Opportunity,
            Application.opportunity_id == Opportunity.id,
        )
        .filter(
            Application.id == application_id,
            Opportunity.company_id == company.id,
        )
        .first()
    )

    if not application:

        raise HTTPException(
            status_code=404,
            detail="Application not found.",
        )

    # --------------------------------------------------------
    # Update status
    # --------------------------------------------------------

    application.status = request.status

    db.commit()

    db.refresh(application)

    return {
        "message": "Application status updated successfully",

        "application": {
            "id": application.id,
            "student_id": application.student_id,
            "opportunity_id": application.opportunity_id,
            "status": application.status,
            "applied_at": application.applied_at,
        },
    }

# ============================================================
# GET SHORTLISTED CANDIDATES
# ============================================================

@router.get("/shortlisted")
def get_shortlisted_candidates(
    current_user: User = Depends(
        require_role("INDUSTRY")
    ),
    db: Session = Depends(get_db),
):

    company = get_current_company(
        current_user,
        db,
    )

    shortlisted = (
        db.query(
            Application,
            Student,
            User,
            Opportunity,
        )
        .join(
            Student,
            Application.student_id == Student.id,
        )
        .join(
            User,
            Student.user_id == User.id,
        )
        .join(
            Opportunity,
            Application.opportunity_id == Opportunity.id,
        )
        .filter(
            Opportunity.company_id == company.id,
            Application.status == "Shortlisted",
        )
        .order_by(
            Application.id.desc()
        )
        .all()
    )

    return [
        {
            "application_id": application.id,
            "student_id": student.id,
            "name": user.name,
            "email": user.email,
            "career_goal": student.career_goal,
            "readiness": student.readiness,
            "opportunity_id": opportunity.id,
            "opportunity_title": opportunity.title,
            "status": application.status,
            "applied_at": application.applied_at,
        }

        for application, student, user, opportunity
        in shortlisted
    ]