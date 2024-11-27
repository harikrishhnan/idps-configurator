from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import subprocess
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

app = FastAPI()
Base = declarative_base()

# Database setup
engine = create_engine("sqlite:///rules.db")
Session = sessionmaker(bind=engine)
session = Session()

class Rule(Base):
    __tablename__ = "rules"
    id = Column(Integer, primary_key=True, index=True)
    source = Column(String)
    dest = Column(String)
    port = Column(String)
    action = Column(String)

Base.metadata.create_all(bind=engine)

# Pydantic model
class RuleModel(BaseModel):
    source: str
    dest: str
    port: str
    action: str

@app.post("/add_rule", response_model=RuleModel)
def add_rule(rule: RuleModel):
    # Add to database
    db_rule = Rule(**rule.dict())
    session.add(db_rule)
    session.commit()
    # Apply rule in iptables
    iptables_command = [
        "iptables", "-A", "INPUT", "-s", rule.source, "-p", "tcp",
        "--dport", rule.port, "-j", rule.action.upper()
    ]
    subprocess.run(iptables_command)
    return rule

@app.get("/rules", response_model=List[RuleModel])
def get_rules():
    rules = session.query(Rule).all()
    return [RuleModel(**r.__dict__) for r in rules]
