from fastapi import APIRouter, Depends

from modules.dashboard.schemas import DashboardStats
from modules.dashboard.service import get_admin_dashboard_stats

try:
    # current working RBAC
    from core.security import require_role
except ImportError:
    try:
        # future RBAC (
        from core.rbac import require_role
    except ImportError:
        def require_role(roles):
            async def _noop():
                return None
            return _noop


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/stats", response_model=DashboardStats)
async def admin_dashboard(
    user=Depends(require_role(["admin"]))
):
    return await get_admin_dashboard_stats()


@router.get("/ping")
async def ping():
    return {"message": "Dashboard working"}
