from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    Numeric,
    ForeignKey
)

from ..database import Base


class Placement(Base):

    __tablename__ = "placements"

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

    company_id = Column(
        Integer,
        ForeignKey("companies.id"),
        nullable=False
    )

    opportunity_id = Column(
        Integer,
        ForeignKey("opportunities.id"),
        nullable=True
    )

    package = Column(
        Numeric(10, 2),
        nullable=True
    )

    placement_date = Column(
        Date,
        nullable=True
    )

    status = Column(
        String(50),
        default="Placed"
    )