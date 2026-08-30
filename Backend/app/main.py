from fastapi import FastAPI
from sqlalchemy import text

from .database import engine, Base
from .auth.routes import router as auth_router
from .student.routes import router as student_router
from .industry.routes import router as industry_router
from .academia.routes import router as academia_router

# Import all models so SQLAlchemy registers them
from .models import (
    User,
    Student,
    Academician,
    Company,
    Skill,
    StudentSkill,
    Opportunity,
    OpportunitySkill,
    Application,
    Collaboration,
    Placement,
)


app = FastAPI(
    title="SkillBridge API",
    description="Academia–Industry Portal Backend",
    version="1.0.0",
)
app.include_router(auth_router)
app.include_router(student_router)
app.include_router(industry_router)
app.include_router(academia_router)

@app.on_event("startup")
def create_tables():

    Base.metadata.create_all(
        bind=engine
    )


@app.get("/")
def root():

    return {
        "message": "SkillBridge API is running",
        "status": "success",
    }


@app.get("/health")
def health_check():

    try:

        with engine.connect() as connection:

            connection.execute(
                text("SELECT 1")
            )

        return {
            "status": "healthy",
            "database": "connected",
        }

    except Exception as error:

        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(error),
        }