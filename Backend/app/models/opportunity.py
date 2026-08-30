from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Date,
    DateTime,
    ForeignKey
)
from sqlalchemy.sql import func

from ..database import Base


class Opportunity(Base):

    __tablename__ = "opportunities"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    company_id = Column(
        Integer,
        ForeignKey("companies.id"),
        nullable=False
    )

    title = Column(
        String(200),
        nullable=False
    )

    type = Column(
        String(50),
        nullable=False
    )

    description = Column(
        Text,
        nullable=True
    )

    location = Column(
        String(150),
        nullable=True
    )

    mode = Column(
        String(50),
        nullable=True
    )

    duration = Column(
        String(100),
        nullable=True
    )

    deadline = Column(
        Date,
        nullable=True
    )

    status = Column(
        String(50),
        default="Active"
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )