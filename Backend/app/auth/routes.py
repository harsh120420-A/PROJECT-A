from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db

from ..models import (
    User,
    Student,
    Company,
    Academician,
)

from .schemas import RegisterRequest
from .security import hash_password


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post("/register")
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db),
):

    # -----------------------------------------
    # Validate role
    # -----------------------------------------

    allowed_roles = {
        "STUDENT",
        "INDUSTRY",
        "ACADEMIA",
    }

    role = request.role.upper()

    if role not in allowed_roles:

        raise HTTPException(
            status_code=400,
            detail=(
                "Role must be STUDENT, "
                "INDUSTRY, or ACADEMIA."
            ),
        )


    # -----------------------------------------
    # Check existing email
    # -----------------------------------------

    existing_user = (
        db.query(User)
        .filter(
            User.email == request.email
        )
        .first()
    )

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered.",
        )


    # -----------------------------------------
    # Create common user
    # -----------------------------------------

    user = User(
        name=request.name,
        email=request.email,
        password_hash=hash_password(
            request.password
        ),
        role=role,
    )

    db.add(user)

    db.flush()


    # -----------------------------------------
    # Create role-specific profile
    # -----------------------------------------

    if role == "STUDENT":

        student = Student(
            user_id=user.id,
            career_goal=request.career_goal,
            readiness=0,
        )

        db.add(student)


    elif role == "INDUSTRY":

        if not request.company_name:

            raise HTTPException(
                status_code=400,
                detail=(
                    "company_name is required "
                    "for INDUSTRY registration."
                ),
            )

        company = Company(
            user_id=user.id,
            company_name=request.company_name,
            industry=request.industry,
            location=request.location,
            description=request.description,
        )

        db.add(company)


    elif role == "ACADEMIA":

        if not request.institution_name:

            raise HTTPException(
                status_code=400,
                detail=(
                    "institution_name is required "
                    "for ACADEMIA registration."
                ),
            )

        academician = Academician(
            user_id=user.id,
            institution_name=request.institution_name,
            designation=request.designation,
        )

        db.add(academician)


    db.commit()

    db.refresh(user)


    return {
        "message": "Registration successful",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
        },
    }