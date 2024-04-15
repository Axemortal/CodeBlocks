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

cached_results = []

# Clear the scan cache
async def clear_scan_cache():
    cached_results.clear()

# Update the scan cache and check for consensus
async def update_scan_cache(assembled_code):
    cached_results.append(assembled_code)
    if len(cached_results) > 3:
        cached_results.pop(0)  # Maintain only the last three results

    # Check if all three entries are the same and there are exactly three entries
    if len(cached_results) == 3 and all(code == cached_results[0] for code in cached_results):
        return True
    
    return False

# Credit for this idea goes to the great Tan Shao Chong!
@router.post("/scan")
async def scan_code(videoFrame: UploadFile = File(...)):
    try:
        contents = await videoFrame.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        decoded_objects = qreader.detect_and_decode(
            image, return_detections=True)
        
        if decoded_objects:
            qr_data = decoded_objects[0]
            metadata = decoded_objects[1]

            function_structure = analyse_spatial_arrangement(qr_data, metadata)
            function_calls = build_function_calls(function_structure)

            print(f"Assembled Code Block: {function_calls}")

            consensus_reached = await update_scan_cache(function_calls)
            if consensus_reached:
                await clear_scan_cache()  # Clear the cache once consensus is reached
                return JSONResponse({
                    "message": "Consensus reached on QR code interpretation.",
                    "code": function_calls
                })
            else:
                return JSONResponse({
                    "message": "Consensus not yet reached, continue scanning.",
                    "temp_code": function_calls  # Return the temporarily built function calls
                }, status_code=202)

        else:
            return JSONResponse({"message": "No QR code detected in the frame"}, status_code=400)

    except Exception as e:
        await clear_scan_cache()  # Clear cache in case of error to prevent stale data
        print(f"Failed to process video frame: {repr(e)}")
        return JSONResponse({"message": "Failed to process the video frame"}, status_code=500)

@router.post("/upload")
async def upload_image(image: UploadFile = File(...)):
    try:
        contents = await image.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        decoded_objects = qreader.detect_and_decode(
            image, return_detections=True)

        qr_data = decoded_objects[0]
        metadata = decoded_objects[1]

        if len(qr_data) > 0:
            function_structure = analyse_spatial_arrangement(qr_data, metadata)
            function_calls = build_function_calls(function_structure)

            print(f"Assembled Code Block: {function_calls}")
            return JSONResponse({"message": "Image uploaded successfully", "code": function_calls})

        else:
            return JSONResponse({"message": "No QR code detected in the image"}, status_code=400)

    except Exception as e:
        print(f"Failed to process image: {repr(e)}")
        return JSONResponse({"message": "Failed to process the image"}, status_code=500)


'''Commented out old version'''
# @ router.post("/scan")
# async def scan_code(videoFrame: UploadFile = File(...)):
#     try:
#         contents = await videoFrame.read()
#         nparr = np.frombuffer(contents, np.uint8)
#         image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
#         print(image)

#         decoded_objects = qreader.detect_and_decode(
#             image, return_detections=True)
#         if decoded_objects:
#             qr_data = decoded_objects[0]
#             metadata = decoded_objects[1]

#             function_structure = analyse_spatial_arrangement(qr_data, metadata)
#             function_calls = build_function_calls(function_structure)

#             print(f"Assembled Code Block: {function_calls}")
#             return JSONResponse({"message": "Video stream uploaded successfully", "code": function_calls})

#         else:
#             return JSONResponse({"message": "No QR code detected in the frame"}, status_code=400)

#     except Exception as e:
#         print(f"Failed to process image: {repr(e)}")
#         return JSONResponse({"message": "Failed to process the image"}, status_code=500)
