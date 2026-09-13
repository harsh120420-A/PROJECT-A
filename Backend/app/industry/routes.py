from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..services.matching import calculate_opportunity_match

from ..database import get_db
from ..models import (
    User,
    Company,
    Opportunity,
    Application,
    Student,
    Skill,
    StudentSkill,
    OpportunitySkill,
)
from ..auth.dependencies import require_role
from ..models.collaboration import Collaboration
from ..models.academia import Academician

router = APIRouter(
    prefix="/industry",
    tags=["Industry"],
)


# ============================================================
# SCHEMAS
# ============================================================

class OpportunitySkillRequirement(BaseModel):
    skill_id: int
    required_score: int = 50


class OpportunityCreate(BaseModel):

    title: str

    type: str

    description: str | None = None

    location: str | None = None

    mode: str | None = None

    duration: str | None = None

    deadline: date | None = None

    skill_requirements: list[OpportunitySkillRequirement] = []

    salary_min_lpa: float | None = None
    salary_max_lpa: float | None = None


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
# GET AVAILABLE SKILLS
# ============================================================

@router.get("/skills")
def get_available_skills(
    current_user: User = Depends(
        require_role("INDUSTRY")
    ),
    db: Session = Depends(get_db),
):

    skills = (
        db.query(Skill)
        .order_by(Skill.name.asc())
        .all()
    )

    return [
        {
            "id": skill.id,
            "name": skill.name,
            "category": skill.category,
        }
        for skill in skills
    ]
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
        salary_min_lpa=request.salary_min_lpa,
        salary_max_lpa=request.salary_max_lpa,
    )

    db.add(opportunity)

    db.flush()

    for requirement in request.skill_requirements:
        if not 0 <= requirement.required_score <= 100:
            db.rollback()
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Required score for skill ID "
                    f"{requirement.skill_id} must be between 0 and 100."
                ),
            )

        skill = (
            db.query(Skill)
            .filter(
                Skill.id == requirement.skill_id
            )
            .first()
        )

        if not skill:
            db.rollback()
            raise HTTPException(
                status_code=404,
                detail=(
                    f"Skill with ID "
                    f"{requirement.skill_id} not found."
                ),
            )

        opportunity_skill = OpportunitySkill(
            opportunity_id=opportunity.id,
            skill_id=skill.id,
            required_score=requirement.required_score,
        )

        db.add(opportunity_skill)

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
            "salary_min_lpa": opportunity.salary_min_lpa,
            "salary_max_lpa": opportunity.salary_max_lpa,
        },
    }


# ============================================================
# INDUSTRY PROFILE SCHEMA
# ============================================================

class IndustryProfileUpdate(BaseModel):

    name: str | None = None

    email: str | None = None

    company_name: str | None = None

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

    result = []

    for opportunity in opportunities:

        # ----------------------------------------------------
        # Applications for this opportunity
        # ----------------------------------------------------

        applications = (
            db.query(Application)
            .filter(
                Application.opportunity_id ==
                opportunity.id
            )
            .all()
        )

        application_count = len(
            applications
        )

        # ----------------------------------------------------
        # Unique candidates
        # ----------------------------------------------------

        candidate_count = len({
            application.student_id
            for application in applications
        })

        # ----------------------------------------------------
        # Required skills
        # ----------------------------------------------------

        required_skills = (
            db.query(OpportunitySkill, Skill)
            .join(
                Skill,
                OpportunitySkill.skill_id ==
                Skill.id
            )
            .filter(
                OpportunitySkill.opportunity_id ==
                opportunity.id
            )
            .all()
        )

        skills = [
            {
                "id": skill.id,
                "name": skill.name,
                "category": skill.category,
                "requiredScore": opportunity_skill.required_score,
            }
            for opportunity_skill, skill in required_skills
        ]

        # ----------------------------------------------------
        # Add opportunity
        # ----------------------------------------------------

        result.append({
            "id": opportunity.id,

            "company_id":
                opportunity.company_id,

            "title":
                opportunity.title,

            "type":
                opportunity.type,

            "description":
                opportunity.description,

            "location":
                opportunity.location,

            "mode":
                opportunity.mode,

            "duration":
                opportunity.duration,
                
            "salary_min_lpa":
                opportunity.salary_min_lpa,

            "salary_max_lpa":
                opportunity.salary_max_lpa,

            "deadline":
                opportunity.deadline,

            "status":
                opportunity.status,

            "skills":
                skills,

            "applications":
                application_count,

            "candidates":
                candidate_count,
        })

    return result


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
# UPDATE OPPORTUNITY STATUS
# ============================================================

class OpportunityStatusUpdate(BaseModel):
    status: str


class OpportunityUpdate(BaseModel):
    title: str | None = None
    type: str | None = None
    description: str | None = None
    location: str | None = None
    mode: str | None = None
    duration: str | None = None
    deadline: date | None = None
    salary_min_lpa: float | None = None
    salary_max_lpa: float | None = None
    skill_requirements: list[OpportunitySkillRequirement] | None = None

@router.patch("/opportunities/{opportunity_id}/status")
def update_opportunity_status(
    opportunity_id: int,
    request: OpportunityStatusUpdate,
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
        "Active",
        "Closed",
    }

    if request.status not in allowed_statuses:

        raise HTTPException(
            status_code=400,
            detail="Status must be Active or Closed.",
        )

    # --------------------------------------------------------
    # Find opportunity belonging to this company
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
    # Update status
    # --------------------------------------------------------

    opportunity.status = request.status

    db.commit()

    db.refresh(opportunity)

    return {
        "message": "Opportunity status updated successfully",

        "opportunity": {
            "id": opportunity.id,
            "title": opportunity.title,
            "status": opportunity.status,
        },
    }
    
    
    # ============================================================
# UPDATE OPPORTUNITY
# ============================================================

@router.patch("/opportunities/{opportunity_id}")
def update_opportunity(
    opportunity_id: int,
    request: OpportunityUpdate,
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
    # Find opportunity belonging to this company
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
    # Validate salary range
    # --------------------------------------------------------

    if (
        request.salary_min_lpa is not None
        and request.salary_max_lpa is not None
        and request.salary_min_lpa > request.salary_max_lpa
    ):
        raise HTTPException(
            status_code=400,
            detail="Minimum salary cannot be greater than maximum salary.",
        )

    # --------------------------------------------------------
    # Update basic opportunity details
    # --------------------------------------------------------

    if request.title is not None:
        opportunity.title = request.title

    if request.type is not None:
        opportunity.type = request.type

    if request.description is not None:
        opportunity.description = request.description

    if request.location is not None:
        opportunity.location = request.location

    if request.mode is not None:
        opportunity.mode = request.mode

    if request.duration is not None:
        opportunity.duration = request.duration

    if request.deadline is not None:
        opportunity.deadline = request.deadline

    if request.salary_min_lpa is not None:
        opportunity.salary_min_lpa = request.salary_min_lpa

    if request.salary_max_lpa is not None:
        opportunity.salary_max_lpa = request.salary_max_lpa

    # --------------------------------------------------------
    # Update required skills
    # --------------------------------------------------------

    if request.skill_requirements is not None:

        # --------------------------------------------------------
        # Validate required scores
        # --------------------------------------------------------

        for requirement in request.skill_requirements:

            if not 0 <= requirement.required_score <= 100:
                raise HTTPException(
                    status_code=400,
                    detail=(
                        f"Required score for skill ID "
                        f"{requirement.skill_id} must be between 0 and 100."
                    ),
                )

        # --------------------------------------------------------
        # Validate all skill IDs
        # --------------------------------------------------------

        skill_ids = [
            requirement.skill_id
            for requirement in request.skill_requirements
        ]

        skills = (
            db.query(Skill)
            .filter(
                Skill.id.in_(skill_ids)
            )
            .all()
        )

    found_skill_ids = {
        skill.id
        for skill in skills
    }

    invalid_skill_ids = [
        skill_id
        for skill_id in skill_ids
        if skill_id not in found_skill_ids
    ]

    if invalid_skill_ids:
        raise HTTPException(
            status_code=404,
            detail=(
                f"Skill IDs not found: "
                f"{invalid_skill_ids}"
            ),
        )

    # --------------------------------------------------------
    # Remove existing mappings
    # --------------------------------------------------------

    db.query(OpportunitySkill).filter(
        OpportunitySkill.opportunity_id == opportunity.id
    ).delete(
        synchronize_session=False
    )

    # --------------------------------------------------------
    # Add new mappings with required scores
    # --------------------------------------------------------

    for requirement in request.skill_requirements:

        db.add(
            OpportunitySkill(
                opportunity_id=opportunity.id,
                skill_id=requirement.skill_id,
                required_score=requirement.required_score,
            )
        )

    # --------------------------------------------------------
    # Save changes
    # --------------------------------------------------------

    db.commit()

    db.refresh(opportunity)

    # --------------------------------------------------------
    # Get updated skills
    # --------------------------------------------------------

    updated_skills = (
    db.query(OpportunitySkill, Skill)
    .join(
        Skill,
        OpportunitySkill.skill_id == Skill.id
    )
    .filter(
        OpportunitySkill.opportunity_id == opportunity.id
    )
    .all()
)

    return {
        "message": "Opportunity updated successfully",

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
            "salary_min_lpa": opportunity.salary_min_lpa,
            "salary_max_lpa": opportunity.salary_max_lpa,
            "status": opportunity.status,
            "skills": [
    {
        "id": skill.id,
        "name": skill.name,
        "category": skill.category,
        "requiredScore": opportunity_skill.required_score,
    }
    for opportunity_skill, skill in updated_skills
],
        },
    }

@router.get("/dashboard/stats")
def get_dashboard_stats(
    current_user: User = Depends(require_role("INDUSTRY")),
    db: Session = Depends(get_db),
):
    company = get_current_company(current_user, db)

    # Get all opportunities belonging to this company
    opportunities = (
        db.query(Opportunity)
        .filter(Opportunity.company_id == company.id)
        .all()
    )

    opportunity_ids = [
        opportunity.id
        for opportunity in opportunities
    ]

    # No opportunities yet
    if not opportunity_ids:
        return {
            "active_opportunities": 0,
            "total_opportunities": 0,
            "total_applications": 0,
            "total_candidates": 0,
            "shortlisted_candidates": 0,
            "selected_candidates": 0,
            "average_match": 0,
        }

    # Get applications for this company's opportunities
    applications = (
        db.query(Application)
        .filter(
            Application.opportunity_id.in_(
                opportunity_ids
            )
        )
        .all()
    )

    total_applications = len(applications)

    # Unique students who applied
    unique_student_ids = {
        application.student_id
        for application in applications
    }

    total_candidates = len(
        unique_student_ids
    )

    shortlisted_candidates = sum(
        1
        for application in applications
        if application.status == "Shortlisted"
    )

    selected_candidates = sum(
        1
        for application in applications
        if application.status == "Selected"
    )

    active_opportunities = sum(
        1
        for opportunity in opportunities
        if opportunity.status == "Active"
    )

    # -----------------------------------------
    # Calculate average candidate match
    # -----------------------------------------
    match_scores = []

    for application in applications:

        match_result = calculate_opportunity_match(
            db=db,
            student_id=application.student_id,
            opportunity_id=application.opportunity_id,
        )

        match_scores.append(
            match_result["match_score"]
        )

    average_match = (
        round(
            sum(match_scores) /
            len(match_scores)
        )
        if match_scores
        else 0
    )

    return {
        "active_opportunities":
            active_opportunities,

        "total_opportunities":
            len(opportunities),

        "total_applications":
            total_applications,

        "total_candidates":
            total_candidates,

        "shortlisted_candidates":
            shortlisted_candidates,

        "selected_candidates":
            selected_candidates,

        "average_match":
            average_match,
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
    # Required skills for this opportunity
    # --------------------------------------------------------

    required_skills = (
    db.query(OpportunitySkill, Skill)
    .join(
        Skill,
        OpportunitySkill.skill_id == Skill.id,
    )
    .filter(
        OpportunitySkill.opportunity_id
        == opportunity.id
    )
    .all()
)


    required_skill_data = [
    {
        "id": skill.id,
        "name": skill.name,
        "category": skill.category,
        "requiredScore": opportunity_skill.required_score,
    }
    for opportunity_skill, skill in required_skills
]


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


    result = []


    # --------------------------------------------------------
    # Build candidate information
    # --------------------------------------------------------

    for application, student, user in candidates:

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
                StudentSkill.student_id
                == student.id
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
            for skill, student_skill
            in student_skills
        ]

        match_result = calculate_opportunity_match(
    db=db,
    student_id=student.id,
    opportunity_id=opportunity.id,
)
        result.append({
    "application_id": application.id,

    "student_id": student.id,

    "name": user.name,

    "email": user.email,

    "career_goal": student.career_goal,

    "readiness": student.readiness,

    "application_status":
        application.status,

    "applied_at":
        application.applied_at,

    "skills": skills,

    "match_score":
        match_result["match_score"],

    "match_level":
        match_result["match_level"],

    "matched_skills":
        match_result["matched_skills"],

    "partial_matches":
        match_result["partial_matches"],

    "missing_skills":
        match_result["missing_skills"],

    "skill_gaps":
        match_result["skill_gaps"],

    "match_explanation":
        match_result["explanation"],
})


    # --------------------------------------------------------
    # Final response
    # --------------------------------------------------------

    return {
        "opportunity": {
            "id": opportunity.id,
            "title": opportunity.title,
            "type": opportunity.type,
            "location": opportunity.location,
            "mode": opportunity.mode,
            "duration": opportunity.duration,
            "status": opportunity.status,
        },

        "required_skills": required_skill_data,

        "candidates": result,
    }

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


@router.get("/collaborations")
def get_collaborations(
    current_user: User = Depends(
        require_role("INDUSTRY")
    ),
    db: Session = Depends(get_db),
):

    # --------------------------------------------------------
    # Get logged-in company
    # --------------------------------------------------------

    company = get_current_company(
        current_user,
        db,
    )

    # --------------------------------------------------------
    # Get collaborations for this company only
    # --------------------------------------------------------

    collaborations = (
        db.query(
            Collaboration,
            Academician,
        )
        .join(
            Academician,
            Collaboration.academician_id
            == Academician.id,
        )
        .filter(
            Collaboration.company_id
            == company.id
        )
        .order_by(
            Collaboration.id.desc()
        )
        .all()
    )

    return [
        {
            "id": collaboration.id,

            "company_id":
                collaboration.company_id,

            "company":
                company.company_name,

            "academician_id":
                academician.id,

            "academic_institution":
                academician.institution_name,

            "title":
                collaboration.title,

            "description":
                collaboration.description,

            "status":
                collaboration.status,

            "created_at":
                collaboration.created_at,
        }

        for collaboration, academician
        in collaborations
    ]


@router.patch("/collaborations/{collaboration_id}/status")
def update_collaboration_status(
    collaboration_id: int,
    status: str,
    current_user: User = Depends(
        require_role("INDUSTRY")
    ),
    db: Session = Depends(get_db),
):

    # --------------------------------------------------------
    # Verify company
    # --------------------------------------------------------

    company = get_current_company(
        current_user,
        db,
    )

    # --------------------------------------------------------
    # Find collaboration
    # --------------------------------------------------------

    collaboration = (
        db.query(Collaboration)
        .filter(
            Collaboration.id == collaboration_id,
            Collaboration.company_id == company.id,
        )
        .first()
    )

    if not collaboration:

        raise HTTPException(
            status_code=404,
            detail="Collaboration not found.",
        )

    # --------------------------------------------------------
    # Validate status
    # --------------------------------------------------------

    allowed_statuses = [
        "Approved",
        "Rejected",
    ]

    if status not in allowed_statuses:

        raise HTTPException(
            status_code=400,
            detail="Status must be Approved or Rejected.",
        )

    # --------------------------------------------------------
    # Update status
    # --------------------------------------------------------

    collaboration.status = status

    db.commit()

    db.refresh(collaboration)

    return {
        "message": "Collaboration status updated successfully",

        "collaboration": {
            "id": collaboration.id,
            "company_id": collaboration.company_id,
            "title": collaboration.title,
            "description": collaboration.description,
            "status": collaboration.status,
            "created_at": collaboration.created_at,
        },
    }
    
    
# ============================================================
# GET INDUSTRY PROFILE
# ============================================================

@router.get("/profile")
def get_industry_profile(
    current_user: User = Depends(
        require_role("INDUSTRY")
    ),
    db: Session = Depends(get_db),
):

    company = get_current_company(
        current_user,
        db,
    )

    
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "company_name": company.company_name,
        "industry": company.industry,
        "location": company.location,
        "description": company.description,
    }
    


# ============================================================
# UPDATE INDUSTRY PROFILE
# ============================================================

@router.put("/profile")
def update_industry_profile(
    profile_data: IndustryProfileUpdate,
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
    # Update user name
    # --------------------------------------------------------

    if profile_data.name is not None:

        name = profile_data.name.strip()

        if not name:

            raise HTTPException(
                status_code=400,
                detail="Name cannot be empty.",
            )

        current_user.name = name


    # --------------------------------------------------------
    # Update email
    # --------------------------------------------------------

    if profile_data.email is not None:

        email = profile_data.email.strip().lower()

        if not email:

            raise HTTPException(
                status_code=400,
                detail="Email cannot be empty.",
            )

        existing_user = (
            db.query(User)
            .filter(
                User.email == email,
                User.id != current_user.id,
            )
            .first()
        )

        if existing_user:

            raise HTTPException(
                status_code=400,
                detail="Email is already registered.",
            )

        current_user.email = email


    # --------------------------------------------------------
    # Update company name
    # --------------------------------------------------------

    if profile_data.company_name is not None:

        company_name = (
            profile_data.company_name.strip()
        )

        if not company_name:

            raise HTTPException(
                status_code=400,
                detail="Company name cannot be empty.",
            )

        company.company_name = company_name


    # --------------------------------------------------------
    # Save changes
    # --------------------------------------------------------

    db.commit()

    db.refresh(current_user)

    db.refresh(company)


    return {
        "message": "Profile updated successfully",

        "profile": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "role": current_user.role,
            "company_name": company.company_name,
        },
    }