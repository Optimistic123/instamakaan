from datetime import datetime, timezone
from fastapi import HTTPException
from core.database import get_db
from modules.agents.schemas import AgentCreate, AgentUpdate


async def create_agent(data: AgentCreate):
    db = get_db()
    now = datetime.now(timezone.utc).isoformat()

    agent = data.model_dump()
    agent.update({
        "id": agent.get("id"),
        "status": "active",
        "total_inquiries_handled": 0,
        "created_at": now,
        "updated_at": now,
    })

    await db.agents.insert_one(agent)
    return agent


async def get_agents(filters: dict, limit: int = 100):
    db = get_db()
    agents = await db.agents.find(filters, {"_id": 0}).to_list(limit)

    for agent in agents:
        count = await db.inquiries.count_documents(
            {"assigned_agent_id": agent["id"]}
        )
        agent["total_inquiries_handled"] = count

    return agents


async def get_agent_by_id(agent_id: str):
    db = get_db()
    agent = await db.agents.find_one({"id": agent_id}, {"_id": 0})
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    count = await db.inquiries.count_documents(
        {"assigned_agent_id": agent_id}
    )
    agent["total_inquiries_handled"] = count

    return agent


async def update_agent(agent_id: str, data: AgentUpdate):
    db = get_db()

    existing = await db.agents.find_one({"id": agent_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Agent not found")

    update_data = data.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()

    await db.agents.update_one(
        {"id": agent_id},
        {"$set": update_data}
    )

    return await get_agent_by_id(agent_id)


async def delete_agent(agent_id: str):
    db = get_db()
    result = await db.agents.delete_one({"id": agent_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Agent not found")
from datetime import datetime, timezone
from fastapi import HTTPException
from core.database import get_db
from modules.agents.schemas import AgentCreate, AgentUpdate


async def create_agent(data: AgentCreate):
    db = get_db()
    now = datetime.now(timezone.utc).isoformat()

    agent = data.model_dump()
    agent.update({
        "id": agent.get("id"),
        "status": "active",
        "total_inquiries_handled": 0,
        "created_at": now,
        "updated_at": now,
    })

    await db.agents.insert_one(agent)
    return agent


async def get_agents(filters: dict, limit: int = 100):
    db = get_db()
    agents = await db.agents.find(filters, {"_id": 0}).to_list(limit)

    for agent in agents:
        count = await db.inquiries.count_documents(
            {"assigned_agent_id": agent["id"]}
        )
        agent["total_inquiries_handled"] = count

    return agents


async def get_agent_by_id(agent_id: str):
    db = get_db()
    agent = await db.agents.find_one({"id": agent_id}, {"_id": 0})
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    count = await db.inquiries.count_documents(
        {"assigned_agent_id": agent_id}
    )
    agent["total_inquiries_handled"] = count

    return agent


async def update_agent(agent_id: str, data: AgentUpdate):
    db = get_db()

    existing = await db.agents.find_one({"id": agent_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Agent not found")

    update_data = data.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()

    await db.agents.update_one(
        {"id": agent_id},
        {"$set": update_data}
    )

    return await get_agent_by_id(agent_id)


async def delete_agent(agent_id: str):
    db = get_db()
    result = await db.agents.delete_one({"id": agent_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Agent not found")
