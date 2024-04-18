from fastapi import APIRouter, HTTPException, Request
import subprocess
import os

router = APIRouter(
    tags=['Compiler'],
    prefix='/compiler'
)


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

        with open(dest_file_path, 'w', encoding='utf-8') as new_file:
            new_file.write(modified_data)

    def compile_sketch():
        compile_command = ['arduino-cli', 'compile', '-b',
                           'esp32:esp32:esp32doit-devkit-v1', os.path.join(file_path, 'ino')]
        subprocess.run(compile_command, check=True)

    def upload_sketch():
        upload_command = ['arduino-cli', 'upload', os.path.join(file_path, 'ino'), '-b',
                          'esp32:esp32:esp32doit-devkit-v1', '-p', '192.168.248.21', '--upload-field', 'password=abc']
        subprocess.run(upload_command, check=True)

    try:
        compile_sketch()
        upload_sketch()
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=f"Compilation failed: {e}")

    # # Check if the executable file was created successfully
    # if not os.path.exists(f'{executable_name}.exe'):
    #     raise HTTPException(
    #         status_code=500, detail="Compilation failed: Executable file was not created")

    # os.remove(f'{executable_name}.exe')

    return "Code has been compiled successfully."
