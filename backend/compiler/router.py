from fastapi import APIRouter, HTTPException, Request
import os

from compiler.dependencies import cleanup, compile_sketch, upload_sketch

router = APIRouter(
    tags=['Compiler'],
    prefix='/compiler'
)

DEVICE_IP = "192.168.248.59"


@router.post('/compile')
async def compile_code(request: Request):
    code_bytes = await request.body()
    code = code_bytes.decode('utf-8')

    file_path = os.path.dirname(os.path.abspath(__file__))

    source_file_path = os.path.join(file_path, 'Template.ino')
    dest_file_path = os.path.join(file_path, 'ino', 'ino.ino')

    with open(source_file_path, 'r', encoding='utf-8') as source_file:
        data = source_file.read()

        modified_data = data.replace('// BLOCK CODE HERE', code)

        if not os.path.exists(os.path.join(file_path, 'ino')):
            os.makedirs(os.path.join(file_path, 'ino'))  # Create the directory if it doesn't exist

        with open(dest_file_path, 'w', encoding='utf-8') as new_file:
            new_file.write(modified_data)

    try:
        compile_sketch(os.path.join(file_path, 'ino'))
        upload_sketch(os.path.join(file_path, 'ino'), DEVICE_IP)
        cleanup(os.path.join(file_path, 'ino'))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Compilation failed: {e}")

    return "Code has been compiled and uploaded successfully."
