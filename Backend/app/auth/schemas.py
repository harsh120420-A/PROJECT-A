from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):

    name: str

    email: EmailStr

    password: str

    role: str

    career_goal: str | None = None

    institution_name: str | None = None

    designation: str | None = None

    company_name: str | None = None

    industry: str | None = None

    location: str | None = None

    description: str | None = None