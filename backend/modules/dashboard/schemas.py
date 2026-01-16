from pydantic import BaseModel
from typing import Dict, List


class DashboardStats(BaseModel):
    total_properties: int
    active_properties: int
    total_inquiries: int
    new_inquiries: int
    total_owners: int
    total_agents: int
    properties_by_type: Dict[str, int]
    recent_inquiries: List[dict]
