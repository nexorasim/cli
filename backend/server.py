from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
import logging
from auth import router as auth_router

# Create the main app
app = FastAPI(
    title="eSIM Myanmar API",
    description="API for eSIM Myanmar Company Limited",
    version="1.0.0"
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Company Information
COMPANY_INFO = {
    "name": "ESIM MYANMAR COMPANY LIMITED",
    "address": "Parami Road, No-70/A, Ward (16), Hlaing Township, Yangon, Myanmar",
    "phone": "(+95) 96 50000172",
    "website": "https://www.esim.com.mm",
    "email": "info@esim.com.mm"
}

# eSIM Plans Data
ESIM_PLANS = [
    {
        "id": "tourist-7d",
        "name": "Tourist Plan",
        "duration_days": 7,
        "data_gb": 5,
        "price_usd": 15,
        "features": ["5GB High-Speed Data", "Nationwide Coverage", "Instant Activation"]
    },
    {
        "id": "business-30d",
        "name": "Business Plan",
        "duration_days": 30,
        "data_gb": 20,
        "price_usd": 35,
        "features": ["20GB High-Speed Data", "Premium Network", "24/7 Support"]
    },
    {
        "id": "extended-90d",
        "name": "Extended Stay",
        "duration_days": 90,
        "data_gb": 50,
        "price_usd": 85,
        "features": ["50GB High-Speed Data", "Renewable", "Best Value"]
    }
]

# Define Models
class HealthCheck(BaseModel):
    status: str
    timestamp: datetime
    company: str
    api_version: str

class ESIMPlan(BaseModel):
    id: str
    name: str
    duration_days: int
    data_gb: int
    price_usd: int
    features: List[str]

class ESIMActivation(BaseModel):
    plan_id: str
    device_imei: str
    customer_email: str

class ESIMActivationResponse(BaseModel):
    activation_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    qr_code_url: str
    activation_code: str
    status: str
    expires_at: datetime

class ESIMBalance(BaseModel):
    activation_id: str
    data_remaining_gb: float
    days_remaining: int
    status: str

class ESIMUsage(BaseModel):
    activation_id: str
    data_used_gb: float
    data_total_gb: int
    usage_percentage: float
    last_updated: datetime

# API Routes
@api_router.get("/health", response_model=HealthCheck)
async def health_check():
    return HealthCheck(
        status="OK",
        timestamp=datetime.utcnow(),
        company=COMPANY_INFO["name"],
        api_version="1.0.0"
    )

@api_router.get("/company")
async def get_company_info():
    return COMPANY_INFO

@api_router.get("/packages", response_model=List[ESIMPlan])
async def get_esim_packages():
    return [ESIMPlan(**plan) for plan in ESIM_PLANS]

@api_router.get("/packages/{plan_id}", response_model=ESIMPlan)
async def get_esim_package(plan_id: str):
    plan = next((p for p in ESIM_PLANS if p["id"] == plan_id), None)
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    return ESIMPlan(**plan)

@api_router.post("/esim/activate", response_model=ESIMActivationResponse)
async def activate_esim(activation: ESIMActivation):
    # Validate plan exists
    plan = next((p for p in ESIM_PLANS if p["id"] == activation.plan_id), None)
    if not plan:
        raise HTTPException(status_code=400, detail="Invalid plan ID")
    
    activation_id = str(uuid.uuid4())
    return ESIMActivationResponse(
        activation_id=activation_id,
        qr_code_url=f"https://api.esim.com.mm/qr/{activation_id}",
        activation_code=f"ESM{activation_id[:8].upper()}",
        status="pending",
        expires_at=datetime.utcnow().replace(hour=23, minute=59, second=59)
    )

@api_router.get("/esim/{activation_id}/balance", response_model=ESIMBalance)
async def get_esim_balance(activation_id: str):
    # Mock data - in production, fetch from database
    return ESIMBalance(
        activation_id=activation_id,
        data_remaining_gb=3.2,
        days_remaining=5,
        status="active"
    )

@api_router.get("/esim/{activation_id}/usage", response_model=ESIMUsage)
async def get_esim_usage(activation_id: str):
    # Mock data - in production, fetch from database
    return ESIMUsage(
        activation_id=activation_id,
        data_used_gb=1.8,
        data_total_gb=5,
        usage_percentage=36.0,
        last_updated=datetime.utcnow()
    )

@api_router.post("/esim/{activation_id}/topup")
async def topup_esim(activation_id: str, amount_usd: int):
    return {
        "activation_id": activation_id,
        "topup_amount_usd": amount_usd,
        "status": "success",
        "transaction_id": str(uuid.uuid4())
    }

# Include the routers in the main app
app.include_router(api_router)
app.include_router(auth_router, prefix="/api")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://www.esim.com.mm", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "eSIM Myanmar API",
        "company": COMPANY_INFO["name"],
        "version": "1.0.0",
        "docs": "/docs"
    }
