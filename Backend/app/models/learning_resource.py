from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.sql import func

from ..database import Base


class LearningResource(Base):

    __tablename__ = "learning_resources"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    skill_id = Column(
        Integer,
        ForeignKey("skills.id"),
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

    provider = Column(
        String(150),
        nullable=True
    )

    difficulty = Column(
        String(50),
        nullable=True
    )

    duration = Column(
        String(50),
        nullable=True
    )

    url = Column(
        String(500),
        nullable=True
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )