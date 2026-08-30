from sqlalchemy import Column, Integer, String, ForeignKey, Text

from ..database import Base


class Company(Base):

    __tablename__ = "companies"

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

    company_name = Column(
        String(200),
        nullable=False
    )

    industry = Column(
        String(150),
        nullable=True
    )

    location = Column(
        String(150),
        nullable=True
    )

    description = Column(
        Text,
        nullable=True
    )