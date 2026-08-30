from sqlalchemy import Column, Integer, ForeignKey

from ..database import Base


class OpportunitySkill(Base):

    __tablename__ = "opportunity_skills"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    opportunity_id = Column(
        Integer,
        ForeignKey("opportunities.id"),
        nullable=False
    )

    skill_id = Column(
        Integer,
        ForeignKey("skills.id"),
        nullable=False
    )