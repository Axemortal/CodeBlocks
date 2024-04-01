from fastapi import APIRouter, Depends, HTTPException

router = APIRouter(
    tags=['Compiler'],
    prefix='/compiler'
)


@router.get('/compile')
def compile():
    return {"scanner": "scanner"}
