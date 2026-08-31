from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.sql import func

from ..database import Base


class Achievement(Base):

    __tablename__ = "student_achievements"

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

    title = Column(
        String(200),
        nullable=False
    )

    description = Column(
        Text,
        nullable=True
    )

    date = Column(
        String(20),
        nullable=True
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )