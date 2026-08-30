from sqlalchemy import Column, Integer, String, ForeignKey

from ..database import Base


class Academician(Base):

    __tablename__ = "academicians"

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

    institution_name = Column(
        String(200),
        nullable=False
    )

    designation = Column(
        String(100),
        nullable=True
    )