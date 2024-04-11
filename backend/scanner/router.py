from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse
from scanner.dependencies import analyse_spatial_arrangement, build_function_calls
from qreader import QReader
import cv2
import numpy as np

router = APIRouter(
    tags=['Scanner'],
    prefix='/scanner'
)

qreader = QReader()

@router.post("/scan")
async def scan_code(videoFrame: UploadFile = File(...)):
    try:
        contents = await videoFrame.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        decoded_objects = qreader.detect_and_decode(image, return_detections=True)
        if decoded_objects:
            qr_data = decoded_objects[0]
            metadata = decoded_objects[1]

            function_structure = analyse_spatial_arrangement(qr_data, metadata)
            function_calls = build_function_calls(function_structure)

            print(f"Assembled Code Block: {function_calls}")
            return JSONResponse({"message": "Video stream uploaded successfully", "code": function_calls})
    
        else:
            return JSONResponse({"message": "No QR code detected in the frame"}, status_code=400)

    except Exception as e:
        print(f"Failed to process image: {repr(e)}")
        return JSONResponse({"message": "Failed to process the image"}, status_code=500)
