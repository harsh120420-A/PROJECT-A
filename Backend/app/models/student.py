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

    phone = Column(
        String(20),
        nullable=True
    )

    college = Column(
        String(200),
        nullable=True
    )

    degree = Column(
        String(100),
        nullable=True
    )

    branch = Column(
        String(150),
        nullable=True
    )

    graduation_year = Column(
        Integer,
        nullable=True
    )

    preferred_location = Column(
        String(150),
        nullable=True
    )