from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey
)
from sqlalchemy.sql import func

from ..database import Base


class Collaboration(Base):

    __tablename__ = "collaborations"

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

    academician_id = Column(
        Integer,
        ForeignKey("academicians.id"),
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

    status = Column(
        String(50),
        default="Pending"
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )