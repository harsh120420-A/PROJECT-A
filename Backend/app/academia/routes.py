from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from pydantic import BaseModel

from ..models import (
    User,
    Student,
    Skill,
    StudentSkill,
    Academician,
    Opportunity,
    OpportunitySkill,
    Company,
    Collaboration,
    Application,
)

from ..auth.dependencies import require_role


router = APIRouter(
    prefix="/academia",
    tags=["Academia"],
)


# ============================================================
# HELPER — GET CURRENT ACADEMICIAN
# ============================================================

def get_current_academician(
    current_user: User,
    db: Session,
):

    academician = (
        db.query(Academician)
        .filter(
            Academician.user_id == current_user.id
        )
        .first()
    )

    if not academician:

        raise HTTPException(
            status_code=404,
            detail="Academician profile not found.",
        )

    return academician


# ============================================================
# ACADEMIA DASHBOARD
# ============================================================

@router.get("/dashboard")
def get_academia_dashboard(
    current_user: User = Depends(
        require_role("ACADEMIA")
    ),
    db: Session = Depends(get_db),
):

    # --------------------------------------------------------
    # Verify academician
    # --------------------------------------------------------

    academician = get_current_academician(
        current_user,
        db,
    )

    # --------------------------------------------------------
    # Total students
    # --------------------------------------------------------

    total_students = (
        db.query(Student)
        .count()
    )

    # --------------------------------------------------------
    # Average readiness
    # --------------------------------------------------------

    students = (
        db.query(Student)
        .all()
    )

    if students:

        average_readiness = round(
            sum(
                student.readiness or 0
                for student in students
            )
            / len(students)
        )

    else:

        average_readiness = 0

    # --------------------------------------------------------
    # Return dashboard
    # --------------------------------------------------------

    return {
        "institution": {
            "name": academician.institution_name,
            "designation": academician.designation,
        },

        "stats": {
            "total_students": total_students,
            "average_readiness": average_readiness,
        },
    }


# ============================================================
# GET ALL STUDENTS
# ============================================================

@router.get("/students")
def get_students(
    current_user: User = Depends(
        require_role("ACADEMIA")
    ),
    db: Session = Depends(get_db),
):

    # --------------------------------------------------------
    # Verify academician
    # --------------------------------------------------------

    get_current_academician(
        current_user,
        db,
    )

    # --------------------------------------------------------
    # Get all students
    # --------------------------------------------------------

    students = (
        db.query(
            Student,
            User,
        )
        .join(
            User,
            Student.user_id == User.id,
        )
        .filter(
            User.role == "STUDENT"
        )
        .order_by(
            Student.id
        )
        .all()
    )

    result = []

    for student, user in students:

        # ----------------------------------------------------
        # Student skills
        # ----------------------------------------------------

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
                StudentSkill.student_id ==
                student.id
            )
            .all()
        )

        skills = [
            {
                "id": skill.id,
                "name": skill.name,
                "category": skill.category,
                "score": student_skill.score or 0,
            }
            for skill, student_skill
            in student_skills
        ]

        # ----------------------------------------------------
        # Skill gaps
        #
        # Target score = 70
        # ----------------------------------------------------

        gaps = [
            skill["name"]
            for skill in skills
            if skill["score"] < 70
        ]

        # ----------------------------------------------------
        # Internship / application count
        # ----------------------------------------------------

        internship_count = (
            db.query(Application)
            .join(
                Opportunity,
                Application.opportunity_id ==
                Opportunity.id,
            )
            .filter(
                Application.student_id ==
                student.id
            )
            .count()
        )

        # ----------------------------------------------------
        # Student status
        # ----------------------------------------------------

        readiness = (
            student.readiness or 0
        )

        if readiness >= 75:
            status = "On Track"
        elif readiness >= 60:
            status = "Needs Attention"
        else:
            status = "At Risk"

        # ----------------------------------------------------
        # Return student
        # ----------------------------------------------------

        result.append({
            "id": student.id,

            "user_id": user.id,

            "name": user.name,

            "email": user.email,

            "career_goal":
                student.career_goal,

            "readiness":
                readiness,

            "skills":
                skills,

            "gaps":
                gaps,

            "internships":
                internship_count,

            "status":
                status,
        })

    return result


# ============================================================
# GET INDIVIDUAL STUDENT
# ============================================================

@router.get("/students/{student_id}")
def get_student(
    student_id: int,
    current_user: User = Depends(
        require_role("ACADEMIA")
    ),
    db: Session = Depends(get_db),
):

    # Verify academician
    get_current_academician(
        current_user,
        db,
    )

    # --------------------------------------------------------
    # Student + User
    # --------------------------------------------------------

    student_data = (
        db.query(
            Student,
            User,
        )
        .join(
            User,
            Student.user_id == User.id,
        )
        .filter(
            Student.id == student_id,
            User.role == "STUDENT",
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

        for skill, student_skill
        in student_skills
    ]

    return {
        "student": {
            "id": student.id,
            "user_id": user.id,
            "name": user.name,
            "email": user.email,
            "career_goal": student.career_goal,
            "readiness": student.readiness,
        },

        "skills": skills,
    }

# ============================================================
# SKILL ANALYTICS
# ============================================================

@router.get("/skill-analytics")
def get_skill_analytics(
    current_user: User = Depends(
        require_role("ACADEMIA")
    ),
    db: Session = Depends(get_db),
):

    # --------------------------------------------------------
    # Verify academician
    # --------------------------------------------------------

    get_current_academician(
        current_user,
        db,
    )

    # --------------------------------------------------------
    # Get all student skill records
    # --------------------------------------------------------

    skill_data = (
        db.query(
            Skill,
            StudentSkill,
        )
        .join(
            StudentSkill,
            StudentSkill.skill_id == Skill.id,
        )
        .all()
    )

    # --------------------------------------------------------
    # Group scores by skill
    # --------------------------------------------------------

    skill_scores = {}

    for skill, student_skill in skill_data:

        if skill.id not in skill_scores:

            skill_scores[skill.id] = {
                "id": skill.id,
                "name": skill.name,
                "category": skill.category,
                "scores": [],
            }

        skill_scores[
            skill.id
        ]["scores"].append(
            student_skill.score or 0
        )

    # --------------------------------------------------------
    # Skill analytics
    # --------------------------------------------------------

    analytics = []

    for data in skill_scores.values():

        scores = data["scores"]

        average_score = (
            round(
                sum(scores) /
                len(scores)
            )
            if scores
            else 0
        )

        analytics.append({
            "id": data["id"],
            "name": data["name"],
            "category": data["category"],
            "average_score": average_score,
            "student_count": len(scores),
        })

    # Highest average first
    analytics.sort(
        key=lambda item:
        item["average_score"],
        reverse=True,
    )

    # --------------------------------------------------------
    # Overall average
    # --------------------------------------------------------

    all_scores = [
        student_skill.score or 0
        for _, student_skill
        in skill_data
    ]

    average_skill_score = (
        round(
            sum(all_scores) /
            len(all_scores)
        )
        if all_scores
        else 0
    )

    # --------------------------------------------------------
    # Technical readiness
    # --------------------------------------------------------

    technical_scores = [
        student_skill.score or 0
        for skill, student_skill
        in skill_data
        if skill.category == "Technical"
    ]

    technical_readiness = (
        round(
            sum(technical_scores) /
            len(technical_scores)
        )
        if technical_scores
        else 0
    )

    # --------------------------------------------------------
    # Soft skill readiness
    # --------------------------------------------------------

    soft_skill_scores = [
        student_skill.score or 0
        for skill, student_skill
        in skill_data
        if skill.category == "Soft Skill"
    ]

    soft_skill_readiness = (
        round(
            sum(soft_skill_scores) /
            len(soft_skill_scores)
        )
        if soft_skill_scores
        else 0
    )

    # --------------------------------------------------------
    # Students assessed
    # --------------------------------------------------------

    assessed_students = {
        student_skill.student_id
        for _, student_skill
        in skill_data
    }

    # --------------------------------------------------------
    # Student proficiency distribution
    #
    # Calculate each student's average score.
    # --------------------------------------------------------

    student_scores = {}

    for _, student_skill in skill_data:

        student_id = (
            student_skill.student_id
        )

        if student_id not in student_scores:

            student_scores[
                student_id
            ] = []

        student_scores[
            student_id
        ].append(
            student_skill.score or 0
        )

    proficiency_counts = {
        "Advanced": 0,
        "Intermediate": 0,
        "Basic": 0,
        "Beginner": 0,
    }

    for scores in student_scores.values():

        average = (
            sum(scores) /
            len(scores)
            if scores
            else 0
        )

        if average >= 75:

            proficiency_counts[
                "Advanced"
            ] += 1

        elif average >= 50:

            proficiency_counts[
                "Intermediate"
            ] += 1

        elif average >= 30:

            proficiency_counts[
                "Basic"
            ] += 1

        else:

            proficiency_counts[
                "Beginner"
            ] += 1

    total_assessed = len(
        assessed_students
    )

    proficiency_distribution = []

    descriptions = {
        "Advanced":
            "Highly proficient",

        "Intermediate":
            "Industry-ready in core areas",

        "Basic":
            "Needs further development",

        "Beginner":
            "Requires foundational training",
    }

    for label in [
        "Advanced",
        "Intermediate",
        "Basic",
        "Beginner",
    ]:

        count = proficiency_counts[
            label
        ]

        percentage = (
            round(
                (
                    count /
                    total_assessed
                ) * 100
            )
            if total_assessed
            else 0
        )

        proficiency_distribution.append({
            "label": label,
            "count": count,
            "percentage": percentage,
            "description":
                descriptions[label],
        })

    # --------------------------------------------------------
    # Response
    # --------------------------------------------------------

    return {
        "summary": {
            "average_skill_score":
                average_skill_score,

            "technical_readiness":
                technical_readiness,

            "soft_skill_readiness":
                soft_skill_readiness,

            "students_assessed":
                total_assessed,
        },

        "skills":
            analytics,

        "proficiency_distribution":
            proficiency_distribution,
    }

# ============================================================
# SKILL GAPS
# ============================================================

@router.get("/skill-gaps")
def get_skill_gaps(
    current_user: User = Depends(
        require_role("ACADEMIA")
    ),
    db: Session = Depends(get_db),
):
    # Verify academician
    get_current_academician(
        current_user,
        db,
    )

    # --------------------------------------------------------
    # Get all student skill scores
    # --------------------------------------------------------

    skill_data = (
        db.query(
            Skill,
            StudentSkill,
        )
        .join(
            StudentSkill,
            StudentSkill.skill_id == Skill.id,
        )
        .all()
    )

    # --------------------------------------------------------
    # Group scores by skill
    # --------------------------------------------------------

    skill_scores = {}

    for skill, student_skill in skill_data:

        if skill.id not in skill_scores:
            skill_scores[skill.id] = {
                "id": skill.id,
                "name": skill.name,
                "category": skill.category,
                "scores": [],
            }

        skill_scores[skill.id]["scores"].append(
            student_skill.score or 0
        )

    # --------------------------------------------------------
    # Calculate skill gaps
    #
    # Target readiness = 70
    # --------------------------------------------------------

    gaps = []

    for data in skill_scores.values():

        scores = data["scores"]

        average_score = round(
            sum(scores) / len(scores)
        ) if scores else 0

        gap = max(
            0,
            70 - average_score
        )

        # Only include skills with an actual gap
        if gap > 0:

            if gap >= 30:
                priority = "Critical"
            elif gap >= 20:
                priority = "High"
            else:
                priority = "Moderate"

            if data["name"] == "Cloud Computing":
                recommendation = (
                    "Launch cloud certification and industry-led workshops."
                )
            elif data["name"] == "Power BI":
                recommendation = (
                    "Introduce Power BI training with real business projects."
                )
            elif data["name"] == "Machine Learning":
                recommendation = (
                    "Conduct ML bootcamps and industry project programs."
                )
            elif data["name"] == "SQL":
                recommendation = (
                    "Organize advanced SQL and database optimization workshops."
                )
            else:
                recommendation = (
                    f"Strengthen {data['name']} through applied training "
                    "and practical projects."
                )

            gaps.append({
                "id": data["id"],
                "name": data["name"],
                "category": data["category"],
                "average_score": average_score,
                "target_score": 70,
                "gap": gap,
                "student_count": len(scores),
                "priority": priority,
                "recommendation": recommendation,
            })

    # --------------------------------------------------------
    # Largest gap first
    # --------------------------------------------------------

    gaps.sort(
        key=lambda item: item["gap"],
        reverse=True,
    )

    # --------------------------------------------------------
    # Summary statistics
    # --------------------------------------------------------

    critical_skills = sum(
        1 for item in gaps
        if item["priority"] == "Critical"
    )

    high_priority_skills = sum(
        1 for item in gaps
        if item["priority"] == "High"
    )

    students_affected = len({
        student_skill.student_id
        for _, student_skill in skill_data
        if any(
            gap["id"] == student_skill.skill_id
            for gap in gaps
        )
    })

    largest_gap = gaps[0] if gaps else None

    return {
        "summary": {
            "critical_skills": critical_skills,
            "high_priority_skills": high_priority_skills,
            "students_affected": students_affected,
            "largest_gap": (
                largest_gap["gap"]
                if largest_gap
                else 0
            ),
            "largest_gap_skill": (
                largest_gap["name"]
                if largest_gap
                else None
            ),
        },
        "gaps": gaps,
    }


# ============================================================
# INDUSTRY DEMAND VS STUDENT SUPPLY
# ============================================================

@router.get("/industry-demand")
def get_industry_demand(
    current_user: User = Depends(
        require_role("ACADEMIA")
    ),
    db: Session = Depends(get_db),
):
    # --------------------------------------------------------
    # Verify academician
    # --------------------------------------------------------

    get_current_academician(
        current_user,
        db,
    )

    # --------------------------------------------------------
    # Get active opportunities
    # --------------------------------------------------------

    opportunities = (
        db.query(Opportunity)
        .filter(
            Opportunity.status == "Active"
        )
        .all()
    )

    # --------------------------------------------------------
    # Count skill demand
    # --------------------------------------------------------

    demand_counts = {}

    for opportunity in opportunities:

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

        for skill in required_skills:

            if skill.id not in demand_counts:
                demand_counts[skill.id] = {
                    "id": skill.id,
                    "name": skill.name,
                    "category": skill.category,
                    "count": 0,
                }

            demand_counts[skill.id]["count"] += 1

    # --------------------------------------------------------
    # Maximum demand
    # --------------------------------------------------------

    max_demand = max(
        (
            data["count"]
            for data in demand_counts.values()
        ),
        default=0,
    )

    # --------------------------------------------------------
    # Total students
    # --------------------------------------------------------

    student_count = (
        db.query(Student)
        .count()
    )

    # --------------------------------------------------------
    # Build skill demand/supply analysis
    # --------------------------------------------------------

    result = []

    for data in demand_counts.values():

        # Demand percentage relative to
        # the most demanded skill
        if max_demand > 0:
            demand_percentage = round(
                (
                    data["count"]
                    / max_demand
                ) * 100
            )
        else:
            demand_percentage = 0

        # ----------------------------------------------------
        # Student skill records
        # ----------------------------------------------------

        skill_records = (
            db.query(StudentSkill)
            .filter(
                StudentSkill.skill_id
                == data["id"]
            )
            .all()
        )

        students_with_skill = sum(
            1
            for record in skill_records
            if (record.score or 0) > 0
        )

        if student_count > 0:
            supply_percentage = round(
                (
                    students_with_skill
                    / student_count
                ) * 100
            )
        else:
            supply_percentage = 0

        # ----------------------------------------------------
        # Average proficiency
        # ----------------------------------------------------

        scores = [
            record.score or 0
            for record in skill_records
        ]

        average_score = round(
            sum(scores) / len(scores)
        ) if scores else 0

        # ----------------------------------------------------
        # Demand vs supply gap
        # ----------------------------------------------------

        gap = max(
            0,
            demand_percentage
            - supply_percentage,
        )

        result.append({
            "id": data["id"],
            "name": data["name"],
            "category": data["category"],
            "opportunity_count": data["count"],
            "demand": demand_percentage,
            "supply": supply_percentage,
            "gap": gap,
            "average_score": average_score,
        })

    # --------------------------------------------------------
    # Sort largest gap first
    # --------------------------------------------------------

    result.sort(
        key=lambda item: item["gap"],
        reverse=True,
    )

    # --------------------------------------------------------
    # Summary
    # --------------------------------------------------------

    highest_demand = (
        max(
            result,
            key=lambda item: item["demand"],
            default=None,
        )
    )

    largest_gap = (
        result[0]
        if result
        else None
    )

    total_skill_requirements = sum(
        item["opportunity_count"]
        for item in result
    )

    skills_with_shortage = sum(
        1
        for item in result
        if item["gap"] > 0
    )

    return {
        "summary": {
            "active_opportunities": len(opportunities),
            "skills_in_demand": len(result),
            "total_skill_requirements": total_skill_requirements,
            "skills_with_shortage": skills_with_shortage,
            "highest_demand_skill": (
                highest_demand["name"]
                if highest_demand
                else None
            ),
            "largest_gap_skill": (
                largest_gap["name"]
                if largest_gap
                else None
            ),
            "largest_gap": (
                largest_gap["gap"]
                if largest_gap
                else 0
            ),
        },
        "skills": result,
    }
# ============================================================
# ACADEMIA OPPORTUNITIES
# ============================================================

@router.get("/opportunities")
def get_academia_opportunities(
    current_user: User = Depends(
        require_role("ACADEMIA")
    ),
    db: Session = Depends(get_db),
):

    # --------------------------------------------------------
    # Verify academician
    # --------------------------------------------------------

    get_current_academician(
        current_user,
        db,
    )

    # --------------------------------------------------------
    # Get active opportunities with company
    # --------------------------------------------------------

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

        # ----------------------------------------------------
        # Required skills
        # ----------------------------------------------------

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

        # ----------------------------------------------------
        # Calculate average institutional proficiency
        # ----------------------------------------------------

        skill_analysis = []

        for skill in required_skills:

            student_skill_records = (
                db.query(StudentSkill)
                .filter(
                    StudentSkill.skill_id == skill.id
                )
                .all()
            )

            scores = [
                record.score or 0
                for record in student_skill_records
            ]

            average_score = round(
                sum(scores) / len(scores)
            ) if scores else 0

            skill_analysis.append({
                "id": skill.id,
                "name": skill.name,
                "category": skill.category,
                "average_student_score": average_score,
            })

        # ----------------------------------------------------
        # Return opportunity
        # ----------------------------------------------------

        result.append({
            "id": opportunity.id,
            "title": opportunity.title,
            "company": company.company_name,
            "type": opportunity.type,
            "description": opportunity.description,
            "location": opportunity.location,
            "mode": opportunity.mode,
            "duration": opportunity.duration,
            "deadline": opportunity.deadline,
            "status": opportunity.status,
            "required_skills": skill_analysis,
        })

    return result

# ============================================================
# COLLABORATION SCHEMA
# ============================================================

class CollaborationCreate(BaseModel):

    company_id: int

    title: str

    description: str | None = None


# ============================================================
# CREATE COLLABORATION
# ============================================================

@router.post("/collaborations")
def create_collaboration(
    request: CollaborationCreate,
    current_user: User = Depends(
        require_role("ACADEMIA")
    ),
    db: Session = Depends(get_db),
):

    # --------------------------------------------------------
    # Verify academician
    # --------------------------------------------------------

    get_current_academician(
        current_user,
        db,
    )

    # --------------------------------------------------------
    # Verify company exists
    # --------------------------------------------------------

    company = (
        db.query(Company)
        .filter(
            Company.id == request.company_id
        )
        .first()
    )

    if not company:

        raise HTTPException(
            status_code=404,
            detail="Company not found.",
        )

    # --------------------------------------------------------
    # Create collaboration
    # --------------------------------------------------------

    collaboration = Collaboration(
        company_id=request.company_id,
        title=request.title,
        description=request.description,
        status="Pending",
    )

    db.add(collaboration)

    db.commit()

    db.refresh(collaboration)

    return {
        "message": "Collaboration created successfully",

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
# GET COLLABORATIONS
# ============================================================

@router.get("/collaborations")
def get_collaborations(
    current_user: User = Depends(
        require_role("ACADEMIA")
    ),
    db: Session = Depends(get_db),
):

    # --------------------------------------------------------
    # Verify academician
    # --------------------------------------------------------

    get_current_academician(
        current_user,
        db,
    )

    # --------------------------------------------------------
    # Get collaborations with company
    # --------------------------------------------------------

    collaborations = (
        db.query(
            Collaboration,
            Company,
        )
        .join(
            Company,
            Collaboration.company_id
            == Company.id,
        )
        .order_by(
            Collaboration.id.desc()
        )
        .all()
    )

    return [
        {
            "id": collaboration.id,
            "company_id": company.id,
            "company": company.company_name,
            "title": collaboration.title,
            "description": collaboration.description,
            "status": collaboration.status,
            "created_at": collaboration.created_at,
        }

        for collaboration, company
        in collaborations
    ]

# ============================================================
# UPDATE COLLABORATION STATUS
# ============================================================

class CollaborationStatusUpdate(BaseModel):

    status: str


@router.patch(
    "/collaborations/{collaboration_id}/status"
)
def update_collaboration_status(
    collaboration_id: int,
    request: CollaborationStatusUpdate,
    current_user: User = Depends(
        require_role("ACADEMIA")
    ),
    db: Session = Depends(get_db),
):

    # --------------------------------------------------------
    # Verify academician
    # --------------------------------------------------------

    get_current_academician(
        current_user,
        db,
    )

    # --------------------------------------------------------
    # Validate status
    # --------------------------------------------------------

    allowed_statuses = {
        "Pending",
        "Active",
        "Completed",
        "Rejected",
    }

    if request.status not in allowed_statuses:

        raise HTTPException(
            status_code=400,
            detail=(
                "Status must be Pending, Active, "
                "Completed, or Rejected."
            ),
        )

    # --------------------------------------------------------
    # Find collaboration
    # --------------------------------------------------------

    collaboration = (
        db.query(Collaboration)
        .filter(
            Collaboration.id
            == collaboration_id
        )
        .first()
    )

    if not collaboration:

        raise HTTPException(
            status_code=404,
            detail="Collaboration not found.",
        )

    # --------------------------------------------------------
    # Update status
    # --------------------------------------------------------

    collaboration.status = request.status

    db.commit()

    db.refresh(collaboration)

    return {
        "message": (
            "Collaboration status updated successfully"
        ),

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
# PLACEMENT ANALYTICS
# ============================================================

@router.get("/placement-analytics")
def get_placement_analytics(
    current_user: User = Depends(
        require_role("ACADEMIA")
    ),
    db: Session = Depends(get_db),
):

    # --------------------------------------------------------
    # Verify academician
    # --------------------------------------------------------

    get_current_academician(
        current_user,
        db,
    )

    # --------------------------------------------------------
    # Basic counts
    # --------------------------------------------------------

    total_students = (
        db.query(Student)
        .count()
    )

    total_opportunities = (
        db.query(Opportunity)
        .count()
    )

    active_opportunities = (
        db.query(Opportunity)
        .filter(
            Opportunity.status == "Active"
        )
        .count()
    )

    total_applications = (
        db.query(Application)
        .count()
    )

    # --------------------------------------------------------
    # Application status counts
    # --------------------------------------------------------

    applied = (
        db.query(Application)
        .filter(
            Application.status == "Applied"
        )
        .count()
    )

    shortlisted = (
        db.query(Application)
        .filter(
            Application.status == "Shortlisted"
        )
        .count()
    )

    selected = (
        db.query(Application)
        .filter(
            Application.status == "Selected"
        )
        .count()
    )

    rejected = (
        db.query(Application)
        .filter(
            Application.status == "Rejected"
        )
        .count()
    )

    # --------------------------------------------------------
    # Placement rate
    #
    # Selected applications / total applications
    # --------------------------------------------------------

    if total_applications > 0:

        placement_rate = round(
            (
                selected
                / total_applications
            )
            * 100
        )

    else:

        placement_rate = 0

    # --------------------------------------------------------
    # Selection rate
    #
    # Selected / shortlisted
    # --------------------------------------------------------

    if shortlisted > 0:

        selection_rate = round(
            (
                selected
                / shortlisted
            )
            * 100
        )

    else:

        selection_rate = 0

    return {
        "summary": {
            "total_students": total_students,
            "total_opportunities": total_opportunities,
            "active_opportunities": active_opportunities,
            "total_applications": total_applications,
            "shortlisted": shortlisted,
            "selected": selected,
            "rejected": rejected,
            "placement_rate": placement_rate,
            "selection_rate": selection_rate,
        },

        "application_status": {
            "applied": applied,
            "shortlisted": shortlisted,
            "selected": selected,
            "rejected": rejected,
        },
    }

# ============================================================
# ACADEMIA REPORTS
# ============================================================

@router.get("/reports")
def get_academia_reports(
    current_user: User = Depends(
        require_role("ACADEMIA")
    ),
    db: Session = Depends(get_db),
):

    # --------------------------------------------------------
    # Verify academician
    # --------------------------------------------------------

    academician = get_current_academician(
        current_user,
        db,
    )

    # --------------------------------------------------------
    # STUDENT STATISTICS
    # --------------------------------------------------------

    total_students = (
        db.query(Student)
        .count()
    )

    students = (
        db.query(Student)
        .all()
    )

    if students:

        average_readiness = round(
            sum(
                student.readiness or 0
                for student in students
            )
            / len(students)
        )

    else:

        average_readiness = 0

    # --------------------------------------------------------
    # SKILL STATISTICS
    # --------------------------------------------------------

    total_skills = (
        db.query(Skill)
        .count()
    )

    student_skill_records = (
        db.query(StudentSkill)
        .all()
    )

    if student_skill_records:

        average_skill_score = round(
            sum(
                record.score or 0
                for record in student_skill_records
            )
            / len(student_skill_records)
        )

    else:

        average_skill_score = 0

    # --------------------------------------------------------
    # OPPORTUNITY STATISTICS
    # --------------------------------------------------------

    total_opportunities = (
        db.query(Opportunity)
        .count()
    )

    active_opportunities = (
        db.query(Opportunity)
        .filter(
            Opportunity.status == "Active"
        )
        .count()
    )

    # --------------------------------------------------------
    # APPLICATION STATISTICS
    # --------------------------------------------------------

    total_applications = (
        db.query(Application)
        .count()
    )

    selected_applications = (
        db.query(Application)
        .filter(
            Application.status == "Selected"
        )
        .count()
    )

    shortlisted_applications = (
        db.query(Application)
        .filter(
            Application.status == "Shortlisted"
        )
        .count()
    )

    rejected_applications = (
        db.query(Application)
        .filter(
            Application.status == "Rejected"
        )
        .count()
    )

    # --------------------------------------------------------
    # PLACEMENT RATE
    # --------------------------------------------------------

    if total_applications > 0:

        placement_rate = round(
            (
                selected_applications
                / total_applications
            )
            * 100
        )

    else:

        placement_rate = 0

    # --------------------------------------------------------
    # COLLABORATION STATISTICS
    # --------------------------------------------------------

    total_collaborations = (
        db.query(Collaboration)
        .count()
    )

    active_collaborations = (
        db.query(Collaboration)
        .filter(
            Collaboration.status == "Active"
        )
        .count()
    )

    pending_collaborations = (
        db.query(Collaboration)
        .filter(
            Collaboration.status == "Pending"
        )
        .count()
    )

    completed_collaborations = (
        db.query(Collaboration)
        .filter(
            Collaboration.status == "Completed"
        )
        .count()
    )

    # --------------------------------------------------------
    # REPORT
    # --------------------------------------------------------

    return {
        "institution": {
            "name": academician.institution_name,
            "designation": academician.designation,
        },

        "students": {
            "total": total_students,
            "average_readiness": average_readiness,
        },

        "skills": {
            "total": total_skills,
            "average_score": average_skill_score,
        },

        "opportunities": {
            "total": total_opportunities,
            "active": active_opportunities,
        },

        "applications": {
            "total": total_applications,
            "shortlisted": shortlisted_applications,
            "selected": selected_applications,
            "rejected": rejected_applications,
            "placement_rate": placement_rate,
        },

        "collaborations": {
            "total": total_collaborations,
            "active": active_collaborations,
            "pending": pending_collaborations,
            "completed": completed_collaborations,
        },
    }