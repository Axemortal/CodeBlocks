from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse

router = APIRouter(
    tags=['Scanner'],
    prefix='/scanner'
)


@router.post("/scan")
async def scan_code(videoFrame: UploadFile = File(...)):
    contents = await videoFrame.read()
    # Aidan add functions under dependencies that handles the parsing of the videoframe
    print(
        f"Received file: {videoFrame.filename}, size: {len(contents)} bytes")
    return JSONResponse({"message": "Video stream uploaded successfully"})
