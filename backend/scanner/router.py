from fastapi import APIRouter, Depends, HTTPException

router = APIRouter(
    tags=['Scanner'],
    prefix='/scanner'
)


@router.get('/')
def get_scanner():
    return {"scanner": "scanner"}
