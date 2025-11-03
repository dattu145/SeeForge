from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from dotenv import load_dotenv
from contextlib import asynccontextmanager
from pathlib import Path
import os
import logging
import uuid
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Safe import for emergentintegrations with fallback
try:
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    HAS_EMERGENT = True
    logger.info("emergentintegrations loaded successfully")
except ImportError:
    HAS_EMERGENT = False
    logger.warning("emergentintegrations not available, using mock AI")

# MongoDB connection with fallback
try:
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    from motor.motor_asyncio import AsyncIOMotorClient
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ.get('DB_NAME', 'seeforge_db')]
    HAS_MONGO = True
    logger.info("MongoDB connected successfully")
except Exception as e:
    logger.error(f"MongoDB connection failed: {e}")
    HAS_MONGO = False
    db = None
    logger.info("Using in-memory storage (MongoDB not available)")

# Create the main app without a prefix
app = FastAPI(title="SeeForge API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

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
    deployment_option: str = "vercel"
    github_repo_url: Optional[str] = None
    tier: str = "Starter"
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
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

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

# ==================== Demo Data ====================

demo_templates = [
    {
        "id": "1",
        "name": "E-commerce Starter",
        "description": "Complete e-commerce platform with product catalog, cart, and checkout",
        "category": "ecommerce",
        "preview_image": "https://images.unsplash.com/photo-1557821552-17105176677c?w=800",
        "features": ["Product Management", "Shopping Cart", "Payment Integration", "Admin Dashboard"],
        "tech_stack": {"frontend": "React + Tailwind", "backend": "Node.js + MongoDB"},
        "estimated_build_time": "2-3 weeks",
        "base_price": 6000,
        "created_at": datetime.now(timezone.utc)
    },
    {
        "id": "2", 
        "name": "SaaS Dashboard",
        "description": "Modern SaaS dashboard with user management and analytics",
        "category": "saas", 
        "preview_image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
        "features": ["User Auth", "Analytics Dashboard", "Subscription Management", "API Integration"],
        "tech_stack": {"frontend": "Next.js", "backend": "Supabase"},
        "estimated_build_time": "2 weeks",
        "base_price": 8000,
        "created_at": datetime.now(timezone.utc)
    },
    {
        "id": "3",
        "name": "Marketplace Platform",
        "description": "Multi-vendor marketplace with seller and buyer interfaces",
        "category": "marketplace",
        "preview_image": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
        "features": ["Vendor Dashboard", "Product Listings", "Order Management", "Reviews & Ratings"],
        "tech_stack": {"frontend": "React + Redux", "backend": "FastAPI + PostgreSQL"},
        "estimated_build_time": "3-4 weeks",
        "base_price": 12000,
        "created_at": datetime.now(timezone.utc)
    },
    {
        "id": "4",
        "name": "Portfolio Website",
        "description": "Stunning portfolio website for creators and professionals",
        "category": "portfolio",
        "preview_image": "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800",
        "features": ["Project Showcase", "Blog", "Contact Form", "Admin Panel"],
        "tech_stack": {"frontend": "Next.js", "backend": "Contentful CMS"},
        "estimated_build_time": "1 week",
        "base_price": 3000,
        "created_at": datetime.now(timezone.utc)
    }
]

demo_projects = []

# ==================== Helper Functions ====================

def get_current_user_id(authorization: Optional[str] = Header(None)) -> str:
    """Extract user ID from JWT token with fallback for demo"""
    if not authorization:
        # For demo purposes, return a mock user ID
        return "demo-user-123"
    
    try:
        token = authorization.replace("Bearer ", "")
        jwt_secret = os.environ.get('SUPABASE_JWT_SECRET', 'demo-secret')
        payload = jwt.decode(token, jwt_secret, algorithms=["HS256"], options={"verify_signature": False})
        return payload.get("sub", "demo-user-123")
    except Exception as e:
        logger.error(f"JWT decode error: {e}")
        return "demo-user-123"

async def generate_ai_scaffold(project_config: Dict[str, Any]) -> Dict[str, Any]:
    """Generate project scaffold using Gemini API with fallback"""
    try:
        if not HAS_EMERGENT:
            # Return mock data if emergentintegrations is not available
            return {
                "scaffold": {
                    "file_structure": [
                        "src/",
                        "src/components/",
                        "src/pages/", 
                        "package.json",
                        "README.md"
                    ],
                    "key_files": {
                        "package.json": '{"name": "' + project_config.get('name', 'project') + '", "version": "1.0.0"}',
                        "README.md": "# " + project_config.get('name', 'Project') + " Documentation\n\nBuilt with SeeForge"
                    },
                    "setup_instructions": ["npm install", "npm run dev", "Start coding!"],
                    "estimated_time": "48 hours"
                },
                "status": "generated",
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        
        # Get API key from environment
        api_key = os.environ.get('GEMINI_API_KEY', '')
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found")
        
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
        # Return mock data on error
        return {
            "scaffold": {
                "file_structure": ["src/", "package.json", "README.md"],
                "key_files": {
                    "package.json": '{"name": "project", "version": "1.0.0"}',
                    "README.md": "# Project\n\nAI generation failed, but you can still build!"
                },
                "setup_instructions": ["npm install", "npm run dev"],
                "estimated_time": "48 hours"
            },
            "status": "mock_generated",
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
        "total_cost": round(total),
        "currency": "INR"
    }

# ==================== Routes ====================

@api_router.get("/")
async def root():
    return {"message": "SeeForge API", "version": "1.0.0", "status": "running", "database": HAS_MONGO, "ai": HAS_EMERGENT}

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
    
    if HAS_MONGO:
        doc = project_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        
        await db.projects.insert_one(doc)
    else:
        # Store in demo data
        demo_projects.append(project_obj.model_dump())
    
    return project_obj

@api_router.get("/projects", response_model=List[Project])
async def get_projects(authorization: Optional[str] = Header(None)):
    """Get all projects for authenticated user"""
    user_id = get_current_user_id(authorization)
    
    if HAS_MONGO:
        projects = await db.projects.find({"user_id": user_id}, {"_id": 0}).to_list(1000)
        
        for project in projects:
            if isinstance(project.get('created_at'), str):
                project['created_at'] = datetime.fromisoformat(project['created_at'])
            if isinstance(project.get('updated_at'), str):
                project['updated_at'] = datetime.fromisoformat(project['updated_at'])
        
        return projects
    else:
        # Filter projects by user_id from demo data
        user_projects = [p for p in demo_projects if p.get('user_id') == user_id]
        return user_projects

@api_router.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: str, authorization: Optional[str] = Header(None)):
    """Get a specific project"""
    user_id = get_current_user_id(authorization)
    
    if HAS_MONGO:
        project = await db.projects.find_one({"id": project_id, "user_id": user_id}, {"_id": 0})
    else:
        project = next((p for p in demo_projects if p['id'] == project_id and p.get('user_id') == user_id), None)
    
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
    
    updates['updated_at'] = datetime.now(timezone.utc)
    
    if HAS_MONGO:
        result = await db.projects.update_one(
            {"id": project_id, "user_id": user_id},
            {"$set": updates}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Project not found")
        
        updated_project = await db.projects.find_one({"id": project_id}, {"_id": 0})
    else:
        project_index = next((i for i, p in enumerate(demo_projects) if p['id'] == project_id and p.get('user_id') == user_id), -1)
        if project_index == -1:
            raise HTTPException(status_code=404, detail="Project not found")
        
        demo_projects[project_index].update(updates)
        updated_project = demo_projects[project_index]
    
    if isinstance(updated_project.get('created_at'), str):
        updated_project['created_at'] = datetime.fromisoformat(updated_project['created_at'])
    if isinstance(updated_project.get('updated_at'), str):
        updated_project['updated_at'] = datetime.fromisoformat(updated_project['updated_at'])
    
    return Project(**updated_project)

@api_router.delete("/projects/{project_id}")
async def delete_project(project_id: str, authorization: Optional[str] = Header(None)):
    """Delete a project"""
    user_id = get_current_user_id(authorization)
    
    if HAS_MONGO:
        result = await db.projects.delete_one({"id": project_id, "user_id": user_id})
    else:
        result = type('obj', (object,), {'deleted_count': 0})()
        demo_projects[:] = [p for p in demo_projects if not (p['id'] == project_id and p.get('user_id') == user_id)]
        result.deleted_count = 1
    
    if getattr(result, 'deleted_count', 0) == 0:
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
        if not HAS_EMERGENT:
            return {
                "analysis": "Mock analysis: Your repository looks good! We can add new features and improve performance.",
                "base_cost": 700,
                "status": "completed",
                "suggestions": [
                    "Add user authentication",
                    "Improve code structure", 
                    "Add responsive design",
                    "Enhance performance"
                ]
            }
        
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
    try:
        if HAS_MONGO:
            templates = await db.templates.find({}, {"_id": 0}).to_list(1000)
            
            for template in templates:
                if isinstance(template.get('created_at'), str):
                    template['created_at'] = datetime.fromisoformat(template['created_at'])
            
            return templates
        else:
            # Return demo data if no database
            return demo_templates
    except Exception as e:
        logger.error(f"Templates fetch error: {e}")
        return demo_templates

@api_router.get("/templates/{template_id}", response_model=Template)
async def get_template(template_id: str):
    """Get a specific template"""
    try:
        if HAS_MONGO:
            template = await db.templates.find_one({"id": template_id}, {"_id": 0})
        else:
            template = next((t for t in demo_templates if t['id'] == template_id), None)
        
        if not template:
            raise HTTPException(status_code=404, detail="Template not found")
        
        if isinstance(template.get('created_at'), str):
            template['created_at'] = datetime.fromisoformat(template['created_at'])
        
        return Template(**template)
    except Exception as e:
        logger.error(f"Template fetch error: {e}")
        raise HTTPException(status_code=500, detail="Error fetching template")

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
    
    # Mock response for development
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
    
    # Mock verification for development
    return {
        "status": "verified",
        "payment_id": payment_data.get('payment_id', f"pay_{uuid.uuid4()}")
    }

# ==================== Admin Routes ====================

@api_router.get("/admin/projects")
async def admin_get_all_projects(authorization: Optional[str] = Header(None)):
    """Admin: Get all projects"""
    if HAS_MONGO:
        projects = await db.projects.find({}, {"_id": 0}).to_list(1000)
    else:
        projects = demo_projects
    
    return projects

@api_router.post("/admin/templates", response_model=Template)
async def admin_create_template(
    template: Template,
    authorization: Optional[str] = Header(None)
):
    """Admin: Create a new template"""
    if HAS_MONGO:
        doc = template.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        
        await db.templates.insert_one(doc)
    else:
        demo_templates.append(template.model_dump())
    
    return template

# Include the router in the main app
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("SeeForge API starting up...")
    yield
    # Shutdown
    logger.info("SeeForge API shutting down...")
    if HAS_MONGO:
        client.close()
        logger.info("MongoDB connection closed")

# Create the main app with lifespan
app = FastAPI(title="SeeForge API", version="1.0.0", lifespan=lifespan)

# Include the router in the main app (AFTER creating the app)
app.include_router(api_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)