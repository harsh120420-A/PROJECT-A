from sqlalchemy import Column, Integer, String, ForeignKey

from ..database import Base


class Student(Base):

    __tablename__ = "students"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True,
        nullable=False
    )

    career_goal = Column(
        String(150),
        nullable=True
    )

    readiness = Column(
        Integer,
        default=0
    )