from fastapi import APIRouter, Depends
from typing import Optional, List

from modules.agents.schemas import Agent, AgentCreate, AgentUpdate
from modules.agents.service import (
    create_agent,
    get_agents,
    get_agent_by_id,
    update_agent,
    delete_agent,
)
from core.security import require_role

router = APIRouter(
    prefix="/agents",
    tags=["Agents"]
)


@router.post("/", response_model=Agent)
async def create(
    data: AgentCreate,
    user=Depends(require_role(["admin"]))
):
    return await create_agent(data)


@router.get("/", response_model=List[Agent])
async def list_all(
    status: Optional[str] = None,
    limit: int = 100,
    user=Depends(require_role(["admin"]))
):
    filters = {}
    if status:
        filters["status"] = status
    return await get_agents(filters, limit)


@router.get("/{agent_id}", response_model=Agent)
async def get_one(
    agent_id: str,
    user=Depends(require_role(["admin"]))
):
    return await get_agent_by_id(agent_id)


@router.put("/{agent_id}", response_model=Agent)
async def update(
    agent_id: str,
    data: AgentUpdate,
    user=Depends(require_role(["admin"]))
):
    return await update_agent(agent_id, data)


@router.delete("/{agent_id}")
async def delete(
    agent_id: str,
    user=Depends(require_role(["admin"]))
):
    await delete_agent(agent_id)
    return {"message": "Agent deleted successfully"}


@router.get("/ping")
async def ping():
    return {"message": "Agents working"}
