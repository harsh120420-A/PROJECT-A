from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func

from ..database import Base


class StudentLearning(Base):

    __tablename__ = "student_learning"

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

    resource_id = Column(
        Integer,
        ForeignKey("learning_resources.id"),
        nullable=False
    )

    status = Column(
        String(30),
        default="Not Started"
    )

    progress = Column(
        Integer,
        default=0
    )

    started_at = Column(
        DateTime,
        nullable=True
    )

    completed_at = Column(
        DateTime,
        nullable=True
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )