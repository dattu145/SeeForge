from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header, Body
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from dotenv import load_dotenv
from pathlib import Path
import os
import logging
import uuid
import jwt
import httpx
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="SeeForge API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ==================== Models ====================

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    auth_provider: str = "email"
    github_username: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_signin: Optional[datetime] = None
    is_student: bool = False

class Project(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    name: str
    description: str
    category: str
    platform: str = "web"
    frontend: str
    backend: str
    ui_template: str
    features: List[str] = []
    addons: List[str] = []
    deployment_option: str
    estimated_cost: float
    estimated_timeline: str
    status: str = "pending"
    github_repo_url: Optional[str] = None
    deployed_url: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProjectCreate(BaseModel):
    name: str
    description: str
    category: str
    platform: str = "web"
    frontend: str
    backend: str
    ui_template: str
    features: List[str] = []
    addons: List[str] = []
    deployment_option: str
    github_repo_url: Optional[str] = None

class Template(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    category: str
    preview_image: str
    features: List[str]
    tech_stack: Dict[str, str]
    estimated_build_time: str
    base_price: float
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc()))

class AIScaffoldRequest(BaseModel):
    project_config: Dict[str, Any]

class PaymentOrder(BaseModel):
    amount: float
    currency: str = "INR"
    project_id: str
    user_id: str

class GithubRepoAnalysis(BaseModel):
    repo_url: str
    requirements: str

# ==================== Helper Functions ====================

def get_current_user_id(authorization: Optional[str] = Header(None)) -> str:
    """Extract user ID from JWT token"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        token = authorization.replace("Bearer ", "")
        jwt_secret = os.environ.get('SUPABASE_JWT_SECRET', 'secret')
        payload = jwt.decode(token, jwt_secret, algorithms=["HS256"], options={"verify_signature": False})
        return payload.get("sub")
    except Exception as e:
        logger.error(f"JWT decode error: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")

async def generate_ai_scaffold(project_config: Dict[str, Any]) -> Dict[str, Any]:
    """Generate project scaffold using Gemini API"""
    try:
        # Get API key from environment
        api_key = os.environ.get('GEMINI_API_KEY', '')
        
        # Create LlmChat instance
        chat = LlmChat(
            api_key=api_key,
            session_id=f"project_{uuid.uuid4()}",
            system_message="You are an expert full-stack developer who generates complete project scaffolds with file structures and code."
        ).with_model("gemini", "gemini-2.0-flash")
        
        # Create prompt
        prompt = f"""
Generate a complete project scaffold for the following requirements:

Project Name: {project_config.get('name')}
Description: {project_config.get('description')}
Category: {project_config.get('category')}
Frontend: {project_config.get('frontend')}
Backend: {project_config.get('backend')}
UI Template: {project_config.get('ui_template')}
Features: {', '.join(project_config.get('features', []))}
Addons: {', '.join(project_config.get('addons', []))}

Provide a JSON response with the following structure:
{{
  "file_structure": ["list of files and folders"],
  "key_files": {{
    "filename": "code content"
  }},
  "setup_instructions": ["step by step setup"],
  "estimated_time": "time in hours"
}}
"""
        
        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        return {
            "scaffold": response,
            "status": "generated",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    except Exception as e:
        logger.error(f"AI scaffold generation error: {e}")
        return {
            "scaffold": "Error generating scaffold",
            "status": "error",
            "error": str(e)
        }

def calculate_pricing(project_data: Dict[str, Any]) -> Dict[str, Any]:
    """Calculate project pricing based on selections"""
    base_prices = {
        "Idea Spark": 1499,
        "Starter": 3000,
        "MVP Launch": 6000,
        "Growth": 12000,
        "AI Pro": 20000
    }
    
    addon_prices = {
        "Custom Domain Setup": 499,
        "Logo + Branding Pack": 799,
        "SEO Optimization": 999,
        "AI Assistant Integration": 1499,
        "Hosting Extension": 199,
        "Maintenance Support": 999,
        "Analytics Dashboard": 499,
        "Auth": 0,
        "Payments": 500,
        "Admin Panel": 1500,
        "Multi-language": 800,
        "Chat Support": 1200,
        "Data Migration": 2000
    }
    
    # Calculate base cost
    base_cost = base_prices.get(project_data.get('tier', 'Starter'), 3000)
    
    # Calculate addons cost
    addons_cost = sum(addon_prices.get(addon, 0) for addon in project_data.get('addons', []))
    
    # Calculate features cost
    features_cost = sum(addon_prices.get(feature, 0) for feature in project_data.get('features', []))
    
    total = base_cost + addons_cost + features_cost
    
    # Apply student discount if applicable
    if project_data.get('is_student', False):
        total = total * 0.85  # 15% discount
    
    return {
        "base_cost": base_cost,
        "addons_cost": addons_cost,
        "features_cost": features_cost,
        "total_cost": total,
        "currency": "INR"
    }

# ==================== Routes ====================

@api_router.get("/")
async def root():
    return {"message": "SeeForge API", "version": "1.0.0"}

# ==================== Projects Routes ====================

@api_router.post("/projects", response_model=Project)
async def create_project(
    project: ProjectCreate,
    authorization: Optional[str] = Header(None)
):
    """Create a new project"""
    user_id = get_current_user_id(authorization)
    
    # Calculate pricing
    pricing = calculate_pricing(project.model_dump())
    
    project_obj = Project(
        **project.model_dump(),
        user_id=user_id,
        estimated_cost=pricing['total_cost'],
        estimated_timeline="2-3 weeks"
    )
    
    doc = project_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.projects.insert_one(doc)
    return project_obj

@api_router.get("/projects", response_model=List[Project])
async def get_projects(authorization: Optional[str] = Header(None)):
    """Get all projects for authenticated user"""
    user_id = get_current_user_id(authorization)
    
    projects = await db.projects.find({"user_id": user_id}, {"_id": 0}).to_list(1000)
    
    for project in projects:
        if isinstance(project.get('created_at'), str):
            project['created_at'] = datetime.fromisoformat(project['created_at'])
        if isinstance(project.get('updated_at'), str):
            project['updated_at'] = datetime.fromisoformat(project['updated_at'])
    
    return projects

@api_router.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: str, authorization: Optional[str] = Header(None)):
    """Get a specific project"""
    user_id = get_current_user_id(authorization)
    
    project = await db.projects.find_one({"id": project_id, "user_id": user_id}, {"_id": 0})
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if isinstance(project.get('created_at'), str):
        project['created_at'] = datetime.fromisoformat(project['created_at'])
    if isinstance(project.get('updated_at'), str):
        project['updated_at'] = datetime.fromisoformat(project['updated_at'])
    
    return Project(**project)

@api_router.put("/projects/{project_id}", response_model=Project)
async def update_project(
    project_id: str,
    updates: Dict[str, Any] = Body(...),
    authorization: Optional[str] = Header(None)
):
    """Update a project"""
    user_id = get_current_user_id(authorization)
    
    updates['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    result = await db.projects.update_one(
        {"id": project_id, "user_id": user_id},
        {"$set": updates}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    
    updated_project = await db.projects.find_one({"id": project_id}, {"_id": 0})
    
    if isinstance(updated_project.get('created_at'), str):
        updated_project['created_at'] = datetime.fromisoformat(updated_project['created_at'])
    if isinstance(updated_project.get('updated_at'), str):
        updated_project['updated_at'] = datetime.fromisoformat(updated_project['updated_at'])
    
    return Project(**updated_project)

@api_router.delete("/projects/{project_id}")
async def delete_project(project_id: str, authorization: Optional[str] = Header(None)):
    """Delete a project"""
    user_id = get_current_user_id(authorization)
    
    result = await db.projects.delete_one({"id": project_id, "user_id": user_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return {"message": "Project deleted successfully"}

# ==================== AI Generation Routes ====================

@api_router.post("/ai/generate-scaffold")
async def generate_scaffold(
    request: AIScaffoldRequest,
    authorization: Optional[str] = Header(None)
):
    """Generate AI scaffold for project"""
    user_id = get_current_user_id(authorization)
    
    scaffold = await generate_ai_scaffold(request.project_config)
    
    return scaffold

@api_router.post("/ai/analyze-repo")
async def analyze_github_repo(
    request: GithubRepoAnalysis,
    authorization: Optional[str] = Header(None)
):
    """Analyze GitHub repository and provide enhancement suggestions"""
    user_id = get_current_user_id(authorization)
    
    try:
        # Create LlmChat instance
        api_key = os.environ.get('GEMINI_API_KEY', '')
        chat = LlmChat(
            api_key=api_key,
            session_id=f"repo_analysis_{uuid.uuid4()}",
            system_message="You are an expert code reviewer and full-stack developer."
        ).with_model("gemini", "gemini-2.0-flash")
        
        prompt = f"""
Analyze the GitHub repository at {request.repo_url} and provide enhancement suggestions based on these requirements:

{request.requirements}

Provide:
1. Current tech stack analysis
2. Suggested improvements
3. New features to add
4. Code quality recommendations
5. Estimated cost for enhancements (base: ₹700)
6. Timeline estimate
"""
        
        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        return {
            "analysis": response,
            "base_cost": 700,
            "status": "completed"
        }
    except Exception as e:
        logger.error(f"Repo analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ==================== Templates Routes ====================

@api_router.get("/templates", response_model=List[Template])
async def get_templates():
    """Get all available templates"""
    templates = await db.templates.find({}, {"_id": 0}).to_list(1000)
    
    for template in templates:
        if isinstance(template.get('created_at'), str):
            template['created_at'] = datetime.fromisoformat(template['created_at'])
    
    return templates

@api_router.get("/templates/{template_id}", response_model=Template)
async def get_template(template_id: str):
    """Get a specific template"""
    template = await db.templates.find_one({"id": template_id}, {"_id": 0})
    
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    if isinstance(template.get('created_at'), str):
        template['created_at'] = datetime.fromisoformat(template['created_at'])
    
    return Template(**template)

# ==================== Pricing Routes ====================

@api_router.post("/pricing/calculate")
async def calculate_project_pricing(project_data: Dict[str, Any] = Body(...)):
    """Calculate pricing for project configuration"""
    pricing = calculate_pricing(project_data)
    return pricing

# ==================== Payment Routes ====================

@api_router.post("/payments/create-order")
async def create_payment_order(
    order: PaymentOrder,
    authorization: Optional[str] = Header(None)
):
    """Create Razorpay payment order"""
    user_id = get_current_user_id(authorization)
    
    # In production, integrate with Razorpay
    # For now, return mock response
    order_id = f"order_{uuid.uuid4()}"
    
    return {
        "order_id": order_id,
        "amount": order.amount,
        "currency": order.currency,
        "status": "created"
    }

@api_router.post("/payments/verify")
async def verify_payment(
    payment_data: Dict[str, Any] = Body(...),
    authorization: Optional[str] = Header(None)
):
    """Verify Razorpay payment"""
    user_id = get_current_user_id(authorization)
    
    # In production, verify with Razorpay
    return {
        "status": "verified",
        "payment_id": payment_data.get('payment_id')
    }

# ==================== Admin Routes ====================

@api_router.get("/admin/projects")
async def admin_get_all_projects(authorization: Optional[str] = Header(None)):
    """Admin: Get all projects"""
    # In production, add admin authentication check
    projects = await db.projects.find({}, {"_id": 0}).to_list(1000)
    return projects

@api_router.post("/admin/templates", response_model=Template)
async def admin_create_template(
    template: Template,
    authorization: Optional[str] = Header(None)
):
    """Admin: Create a new template"""
    doc = template.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.templates.insert_one(doc)
    return template

@api_router.put("/admin/templates/{template_id}")
async def admin_update_template(
    template_id: str,
    updates: Dict[str, Any] = Body(...),
    authorization: Optional[str] = Header(None)
):
    """Admin: Update a template"""
    result = await db.templates.update_one(
        {"id": template_id},
        {"$set": updates}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Template not found")
    
    return {"message": "Template updated successfully"}

@api_router.delete("/admin/templates/{template_id}")
async def admin_delete_template(
    template_id: str,
    authorization: Optional[str] = Header(None)
):
    """Admin: Delete a template"""
    result = await db.templates.delete_one({"id": template_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Template not found")
    
    return {"message": "Template deleted successfully"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()