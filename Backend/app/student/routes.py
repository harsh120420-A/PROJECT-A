from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime

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
    Project,
    Certification,
    Achievement,
    LearningResource,
    StudentLearning,
)
from ..auth.dependencies import require_role
from .schemas import (
    ProjectCreate,
    CertificationCreate,
    AchievementCreate,
    LearningResourceCreate,
    LearningProgressUpdate,
)

router = APIRouter(
    prefix="/student",
    tags=["Student"],
)

# ============================================================
# STUDENT PROFILE SCHEMA
# ============================================================

class StudentProfileUpdate(BaseModel):

    name: str
    email: str
    phone: str | None = None
    college: str | None = None
    degree: str | None = None
    branch: str | None = None
    graduation_year: int | None = None
    career_goal: str | None = None
    preferred_location: str | None = None

# ============================================================
# ASSESSMENT SCHEMA
# ============================================================

class AssessmentRequest(BaseModel):

    answers: dict[str, int]

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

        "phone": student.phone,
        "college": student.college,
        "degree": student.degree,
        "branch": student.branch,
        "graduation_year": student.graduation_year,

        "career_goal": student.career_goal,
        "preferred_location": student.preferred_location,

        "readiness": student.readiness,
    }

# ============================================================
# UPDATE STUDENT PROFILE
# ============================================================

@router.put("/profile")
def update_student_profile(
    request: StudentProfileUpdate,
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
    # Check email
    # --------------------------------------------------------

    existing_user = (
        db.query(User)
        .filter(
            User.email == request.email,
            User.id != current_user.id,
        )
        .first()
    )

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered.",
        )


    # --------------------------------------------------------
    # Update User information
    # --------------------------------------------------------

    current_user.name = request.name
    current_user.email = request.email


    # --------------------------------------------------------
    # Update Student information
    # --------------------------------------------------------

    student.phone = request.phone
    student.college = request.college
    student.degree = request.degree
    student.branch = request.branch
    student.graduation_year = request.graduation_year
    student.career_goal = request.career_goal
    student.preferred_location = (
        request.preferred_location
    )


    # --------------------------------------------------------
    # Save
    # --------------------------------------------------------

    db.commit()

    db.refresh(current_user)
    db.refresh(student)


    return {
        "message": "Profile updated successfully",

        "profile": {
            "id": student.id,
            "user_id": current_user.id,

            "name": current_user.name,
            "email": current_user.email,

            "phone": student.phone,
            "college": student.college,
            "degree": student.degree,
            "branch": student.branch,
            "graduation_year": (
                student.graduation_year
            ),

            "career_goal": student.career_goal,
            "preferred_location": (
                student.preferred_location
            ),

            "readiness": student.readiness,
        },
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

# ============================================================
# SUBMIT STUDENT ASSESSMENT
# ============================================================

@router.post("/assessment")
def submit_assessment(
    request: AssessmentRequest,
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
    # Validate answers
    # --------------------------------------------------------

    if not request.answers:

        raise HTTPException(
            status_code=400,
            detail="Assessment answers cannot be empty.",
        )


    for skill_name, score in request.answers.items():

        if score < 0 or score > 100:

            raise HTTPException(
                status_code=400,
                detail=(
                    f"Invalid score for {skill_name}. "
                    "Score must be between 0 and 100."
                ),
            )


    # --------------------------------------------------------
    # Update StudentSkill records
    # --------------------------------------------------------

    updated_skills = []


    for skill_name, score in request.answers.items():

        skill = (
            db.query(Skill)
            .filter(
                Skill.name == skill_name
            )
            .first()
        )

        if not skill:

            raise HTTPException(
                status_code=404,
                detail=(
                    f"Skill '{skill_name}' "
                    "not found."
                ),
            )


        # Find existing StudentSkill

        student_skill = (
            db.query(StudentSkill)
            .filter(
                StudentSkill.student_id == student.id,
                StudentSkill.skill_id == skill.id,
            )
            .first()
        )


        # Create if it doesn't exist

        if not student_skill:

            student_skill = StudentSkill(
                student_id=student.id,
                skill_id=skill.id,
                score=score,
            )

            db.add(student_skill)

        else:

            student_skill.score = score


        updated_skills.append(
            {
                "skill_id": skill.id,
                "name": skill.name,
                "category": skill.category,
                "score": score,
            }
        )


    # --------------------------------------------------------
    # Calculate readiness
    # --------------------------------------------------------

    scores = [
        skill["score"]
        for skill in updated_skills
    ]


    if scores:

        readiness = round(
            sum(scores) / len(scores)
        )

    else:

        readiness = 0


    student.readiness = readiness


    # --------------------------------------------------------
    # Save
    # --------------------------------------------------------

    db.commit()

    db.refresh(student)


    # --------------------------------------------------------
    # Response
    # --------------------------------------------------------

    return {
        "message": "Assessment submitted successfully",

        "readiness": readiness,

        "skills": updated_skills,
    }

@router.get("/portfolio")
def get_student_portfolio(
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


    projects = (
        db.query(Project)
        .filter(
            Project.student_id == student.id
        )
        .order_by(Project.id.desc())
        .all()
    )


    certifications = (
        db.query(Certification)
        .filter(
            Certification.student_id == student.id
        )
        .order_by(Certification.id.desc())
        .all()
    )


    achievements = (
        db.query(Achievement)
        .filter(
            Achievement.student_id == student.id
        )
        .order_by(Achievement.id.desc())
        .all()
    )


    return {
        "projects": [
            {
                "id": project.id,
                "title": project.title,
                "description": project.description,
                "technologies": (
                    [
                        item.strip()
                        for item in project.technologies.split(",")
                        if item.strip()
                    ]
                    if project.technologies
                    else []
                ),
                "github": project.github,
                "demo": project.demo,
                "created_at": project.created_at,
            }
            for project in projects
        ],

        "certifications": [
            {
                "id": certification.id,
                "name": certification.name,
                "issuer": certification.issuer,
                "date": certification.date,
                "created_at": certification.created_at,
            }
            for certification in certifications
        ],

        "achievements": [
            {
                "id": achievement.id,
                "title": achievement.title,
                "description": achievement.description,
                "date": achievement.date,
                "created_at": achievement.created_at,
            }
            for achievement in achievements
        ],
    }

@router.post("/portfolio/projects")
def create_project(
    request: ProjectCreate,
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


    project = Project(
        student_id=student.id,
        title=request.title,
        description=request.description,
        technologies=", ".join(
            request.technologies
        ),
        github=request.github,
        demo=request.demo,
    )


    db.add(project)

    db.commit()

    db.refresh(project)


    return {
        "message": "Project added successfully",

        "project": {
            "id": project.id,
            "title": project.title,
            "description": project.description,
            "technologies": request.technologies,
            "github": project.github,
            "demo": project.demo,
        },
    }

@router.delete("/portfolio/projects/{project_id}")
def delete_project(
    project_id: int,
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


    project = (
        db.query(Project)
        .filter(
            Project.id == project_id,
            Project.student_id == student.id,
        )
        .first()
    )

    if not project:

        raise HTTPException(
            status_code=404,
            detail="Project not found.",
        )


    db.delete(project)

    db.commit()


    return {
        "message": "Project deleted successfully"
    }

@router.post("/portfolio/certifications")
def create_certification(
    request: CertificationCreate,
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


    certification = Certification(
        student_id=student.id,
        name=request.name,
        issuer=request.issuer,
        date=request.date,
    )


    db.add(certification)

    db.commit()

    db.refresh(certification)


    return {
        "message": "Certification added successfully",

        "certification": {
            "id": certification.id,
            "name": certification.name,
            "issuer": certification.issuer,
            "date": certification.date,
        },
    }

@router.delete("/portfolio/certifications/{certification_id}")
def delete_certification(
    certification_id: int,
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


    certification = (
        db.query(Certification)
        .filter(
            Certification.id == certification_id,
            Certification.student_id == student.id,
        )
        .first()
    )

    if not certification:

        raise HTTPException(
            status_code=404,
            detail="Certification not found.",
        )


    db.delete(certification)

    db.commit()


    return {
        "message": "Certification deleted successfully"
    }

@router.post("/portfolio/achievements")
def create_achievement(
    request: AchievementCreate,
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


    achievement = Achievement(
        student_id=student.id,
        title=request.title,
        description=request.description,
        date=request.date,
    )


    db.add(achievement)

    db.commit()

    db.refresh(achievement)


    return {
        "message": "Achievement added successfully",

        "achievement": {
            "id": achievement.id,
            "title": achievement.title,
            "description": achievement.description,
            "date": achievement.date,
        },
    }

@router.delete("/portfolio/achievements/{achievement_id}")
def delete_achievement(
    achievement_id: int,
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


    achievement = (
        db.query(Achievement)
        .filter(
            Achievement.id == achievement_id,
            Achievement.student_id == student.id,
        )
        .first()
    )

    if not achievement:

        raise HTTPException(
            status_code=404,
            detail="Achievement not found.",
        )


    db.delete(achievement)

    db.commit()


    return {
        "message": "Achievement deleted successfully"
    }


@router.get("/learning")
def get_learning_resources(
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


    resources = (
        db.query(
            LearningResource,
            Skill,
        )
        .join(
            Skill,
            LearningResource.skill_id == Skill.id,
        )
        .all()
    )


    progress_records = (
        db.query(StudentLearning)
        .filter(
            StudentLearning.student_id == student.id
        )
        .all()
    )


    progress_map = {
        record.resource_id: record
        for record in progress_records
    }


    return [

        {
            "id": resource.id,
            "skill_id": resource.skill_id,
            "skill": skill.name,
            "title": resource.title,
            "description": resource.description,
            "provider": resource.provider,
            "difficulty": resource.difficulty,
            "duration": resource.duration,
            "url": resource.url,

            "status": (
                progress_map[resource.id].status
                if resource.id in progress_map
                else "Not Started"
            ),

            "progress": (
                progress_map[resource.id].progress
                if resource.id in progress_map
                else 0
            ),
        }

        for resource, skill in resources

    ]

@router.post("/learning/{resource_id}/start")
def start_learning(
    resource_id: int,
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


    resource = (
        db.query(LearningResource)
        .filter(
            LearningResource.id == resource_id
        )
        .first()
    )

    if not resource:

        raise HTTPException(
            status_code=404,
            detail="Learning resource not found.",
        )


    existing = (
        db.query(StudentLearning)
        .filter(
            StudentLearning.student_id == student.id,
            StudentLearning.resource_id == resource_id,
        )
        .first()
    )


    if existing:

        existing.status = "In Progress"

        if existing.progress == 0:
            existing.progress = 1

        db.commit()
        db.refresh(existing)

        return {
            "message": "Learning resource already started",
            "status": existing.status,
            "progress": existing.progress,
        }


    learning = StudentLearning(
        student_id=student.id,
        resource_id=resource_id,
        status="In Progress",
        progress=1,
    )


    db.add(learning)

    db.commit()

    db.refresh(learning)


    return {
        "message": "Learning resource started successfully",
        "status": learning.status,
        "progress": learning.progress,
    }


@router.put("/learning/{resource_id}/progress")
def update_learning_progress(
    resource_id: int,
    request: LearningProgressUpdate,
    current_user: User = Depends(
        require_role("STUDENT")
    ),
    db: Session = Depends(get_db),
):

    if request.progress < 0 or request.progress > 100:

        raise HTTPException(
            status_code=400,
            detail="Progress must be between 0 and 100.",
        )


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


    learning = (
        db.query(StudentLearning)
        .filter(
            StudentLearning.student_id == student.id,
            StudentLearning.resource_id == resource_id,
        )
        .first()
    )

    if not learning:

        raise HTTPException(
            status_code=404,
            detail="Learning progress not found. Start the resource first.",
        )


    learning.progress = request.progress

    if request.progress == 100:

        learning.status = "Completed"
        learning.completed_at = datetime.now()

    elif request.progress > 0:

        learning.status = "In Progress"


    db.commit()

    db.refresh(learning)


    return {
        "message": "Learning progress updated successfully",
        "status": learning.status,
        "progress": learning.progress,
    }