from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .dependencies import get_current_user
from ..database import get_db

from ..models import (
    User,
    Student,
    Company,
    Academician,
)

from .schemas import (
    RegisterRequest,
    LoginRequest,
)

from .security import (
    hash_password,
    verify_password,
    create_access_token,
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


# ============================================================
# REGISTER
# ============================================================

@router.post("/register")
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db),
):

    # --------------------------------------------------------
    # Validate role
    # --------------------------------------------------------

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


    # --------------------------------------------------------
    # Check whether email already exists
    # --------------------------------------------------------

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


    # --------------------------------------------------------
    # Create common user
    # --------------------------------------------------------

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


    # --------------------------------------------------------
    # Create role-specific profile
    # --------------------------------------------------------

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


    # --------------------------------------------------------
    # Save everything
    # --------------------------------------------------------

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


# ============================================================
# LOGIN
# ============================================================

@router.post("/login")
def login(
    request: LoginRequest,
    db: Session = Depends(get_db),
):

    # --------------------------------------------------------
    # Find user by email
    # --------------------------------------------------------

    user = (
        db.query(User)
        .filter(
            User.email == request.email
        )
        .first()
    )

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password.",
        )


    # --------------------------------------------------------
    # Verify password
    # --------------------------------------------------------

    if not verify_password(
        request.password,
        user.password_hash,
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password.",
        )


    # --------------------------------------------------------
    # Generate JWT access token
    # --------------------------------------------------------

    access_token = create_access_token(
        user_id=user.id,
        role=user.role,
    )


    # --------------------------------------------------------
    # Return login response
    # --------------------------------------------------------

    return {
        "message": "Login successful",

        "access_token": access_token,

        "token_type": "bearer",

        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
        },
    }

@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user),
):

    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
    }