from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

from logger import logger

from compiler.router import router as compiler_router
from scanner.router import router as scanner_router

app = FastAPI()
app.title = "CodeBlocks API"
app.version = "0.0.1"

app.include_router(compiler_router)
app.include_router(scanner_router)

# List of allowed origins
allowed_origins = [
    "http://localhost:3000",  # Allow the Lite Server deploying the frontend in the container
    "http://localhost:4200",  # Allow the Angular Development Server
    # Allow the deployed frontend on Netlify
    "https://codeblocktrial.netlify.app"
]

# Add CORS middleware to the FastAPI app
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  # Allows specified origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


# Middleware to log incoming requests
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    return response


@app.get("/health")
async def health_check():
    return JSONResponse(content={"status": "ok"})


@app.get("/")
async def route_to_documentation():
    raise HTTPException(status_code=307, headers={"Location": "/docs"})

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1",  port=8000, reload=True)
