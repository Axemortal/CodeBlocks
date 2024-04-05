from fastapi import APIRouter, Depends, File, HTTPException, Response, UploadFile
import subprocess
import os

router = APIRouter(
    tags=['Compiler'],
    prefix='/compiler'
)


@router.post('/compile')
async def compile_code(file: UploadFile = File(...)):
    # Save the uploaded file
    with open(file.filename, "wb") as buffer:
        buffer.write(await file.read())

    # Check if the uploaded file is a C++ source code file
    if not file.filename.endswith('.cpp'):
        raise HTTPException(
            status_code=400, detail="Uploaded file must be a C++ source code file with .cpp extension")

    # Compile the C++ code
    try:
        # Extract the file name without extension
        executable_name = file.filename.split('.')[0]
        subprocess.run(['g++', file.filename, '-o',
                       f'{executable_name}.exe'], check=True)
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=f"Compilation failed: {e}")

    # Check if the executable file was created successfully
    if not os.path.exists(f'{executable_name}.exe'):
        raise HTTPException(
            status_code=500, detail="Compilation failed: Executable file was not created")

    # Read the compiled executable file
    with open(f'{executable_name}.exe', 'rb') as f:
        file_content = f.read()

    # Remove the source code file and the executable file
    os.remove(file.filename)
    os.remove(f'{executable_name}.exe')

    # Return the compiled executable file as response
    response = Response(content=file_content,
                        media_type='application/octet-stream')
    response.headers['Content-Disposition'] = f'attachment; filename="{executable_name}.exe"'
    return response
