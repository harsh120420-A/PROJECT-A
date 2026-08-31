from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func

from ..database import Base


class Certification(Base):

    __tablename__ = "student_certifications"

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

    name = Column(
        String(200),
        nullable=False
    )

    issuer = Column(
        String(200),
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