from config.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Table, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql.sqltypes import TIMESTAMP
from sqlalchemy.sql.expression import text


group_members = Table(
    "group_members",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("group_id", Integer, ForeignKey("groups.id"), primary_key=True)
)


expense_splits = Table(
    "expense_splits",
    Base.metadata,
    Column("expense_id", Integer, ForeignKey("expenses.id"), primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True)
)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String, unique=True)

    groups = relationship("Group", secondary=group_members, back_populates="members")
    paid_expenses = relationship("Expense", back_populates="payer")

    expenses = relationship(
        "Expense",
        secondary=expense_splits,
        back_populates="split_between"
    )


class Group(Base):
    __tablename__ = "groups"

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String, nullable=False)

    created_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=text("now()")
    )

    members = relationship("User", secondary=group_members, back_populates="groups")
    expenses = relationship("Expense", back_populates="group")


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, nullable=False)
    title = Column(String, nullable=False)
    amount = Column(Float, nullable=False)

    group_id = Column(Integer, ForeignKey("groups.id"), nullable=False)
    paid_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    created_at = Column(TIMESTAMP(timezone=True),
                        nullable=False,
                        server_default=text("now()"))

    group = relationship("Group", back_populates="expenses")
    payer = relationship("User", back_populates="paid_expenses")

    split_between = relationship(
        "User",
        secondary=expense_splits,
        back_populates="expenses"
    )