from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse
from scanner.dependencies import analyse_qr_layout, extract_image_from_upload, map_functions, map_blocks, HEIGHT_TOLERANCE_SCAN, HEIGHT_TOLERANCE_UPLOAD, detect_and_decode_qr_codes

router = APIRouter(
    tags=['Scanner'],
    prefix='/scanner'
)

SCAN_CONSENSUS_THRESHOLD = 2
scan_cache = []


def clear_scan_cache():
    scan_cache.clear()


@router.post("/scan")
async def scan_code(upload_file: UploadFile = File(...)):
    try:
        image = await extract_image_from_upload(upload_file)
        qr_data, metadata = detect_and_decode_qr_codes(image)

        if len(qr_data) > 0:
            function_structure = analyse_qr_layout(
                qr_data, metadata, HEIGHT_TOLERANCE_SCAN)
            function_sequence = map_functions(function_structure)

            if len(function_sequence) > 0:
                if len(scan_cache) > SCAN_CONSENSUS_THRESHOLD:
                    scan_cache.pop(0)

                if all(code == scan_cache[0] for code in scan_cache):
                    clear_scan_cache()
                    return JSONResponse({
                        "message": "Consensus reached on QR code interpretation.",
                        "code": map_blocks(function_sequence)
                    })
        else:
            return JSONResponse({"message": "No QR code detected in the frame"})

    except Exception as e:
        clear_scan_cache()
        raise HTTPException(
            status_code=500, detail=f"Failed to process the video frame: {e}")


@router.post("/upload")
async def upload_image(upload_file: UploadFile = File(...)):
    try:
        image = await extract_image_from_upload(upload_file)

        qr_data, metadata = detect_and_decode_qr_codes(image)

        if len(qr_data) > 0:
            function_structure = analyse_qr_layout(
                qr_data, metadata, HEIGHT_TOLERANCE_UPLOAD)
            function_sequence = map_functions(function_structure)
            code_blocks = map_blocks(function_sequence)
            return JSONResponse({"message": "Image uploaded successfully", "code": code_blocks})
        else:
            return JSONResponse({"message": "No QR code detected in the image"}, status_code=400)

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to process the image: {e}")
