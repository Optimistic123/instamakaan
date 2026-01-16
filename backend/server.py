from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from core.config import APP_NAME, CORS_ORIGINS
from core.database import close_db

from modules.auth.routes import router as auth_router
from modules.listings.routes import router as listings_router
from modules.leads.routes import router as leads_router
from modules.owners.routes import router as owners_router
from modules.agents.routes import router as agents_router
from modules.properties.routes import router as properties_router
from modules.inquiries.routes import router as inquiries_router
from modules.dashboard.routes import router as dashboard_router
from modules.whatsapp.webhook import router as whatsapp_webhook_router
from modules.user_auth.router import router as user_auth_router


BASE_DIR = Path(__file__).parent

app = FastAPI(title=APP_NAME)

# Static uploads
app.mount(
    "/uploads",
    StaticFiles(directory=BASE_DIR / "uploads"),
    name="uploads"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router, prefix="/api")
app.include_router(listings_router, prefix="/api")
app.include_router(leads_router, prefix="/api")
app.include_router(owners_router, prefix="/api")
app.include_router(agents_router, prefix="/api")
app.include_router(properties_router, prefix="/api")
app.include_router(inquiries_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(whatsapp_webhook_router)
app.include_router(user_auth_router)


@app.on_event("shutdown")
async def shutdown():
    close_db()
