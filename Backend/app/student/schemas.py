from pydantic import BaseModel


class ProjectCreate(BaseModel):

    title: str
    description: str | None = None
    technologies: list[str] = []
    github: str | None = None
    demo: str | None = None


class CertificationCreate(BaseModel):

    name: str
    issuer: str | None = None
    date: str | None = None


class AchievementCreate(BaseModel):

    title: str
    description: str | None = None
    date: str | None = None


class LearningResourceCreate(BaseModel):

    skill_id: int
    title: str
    description: str | None = None
    provider: str | None = None
    difficulty: str | None = None
    duration: str | None = None
    url: str | None = None


class LearningProgressUpdate(BaseModel):

    progress: int