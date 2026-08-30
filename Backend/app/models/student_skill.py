from sqlalchemy import Column, Integer, ForeignKey

from ..database import Base


class StudentSkill(Base):

    __tablename__ = "student_skills"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    student_id = Column(
        Integer,
        ForeignKey("students.id"),
        nullable=False
    )

    skill_id = Column(
        Integer,
        ForeignKey("skills.id"),
        nullable=False
    )

    score = Column(
        Integer,
        default=0
    )