import os
import shutil
import subprocess


def compile_sketch(dir_path):
    compile_command = ['arduino-cli', 'compile', '-b',
                       'esp32:esp32:esp32doit-devkit-v1', dir_path]
    subprocess.run(compile_command, check=True)


def upload_sketch(dir_path, device_ip):
    upload_command = ['arduino-cli', 'upload', dir_path, '-b',
                      'esp32:esp32:esp32doit-devkit-v1', '-p', device_ip, '--upload-field', 'password=abc']
    subprocess.run(upload_command, check=True)


def cleanup(file_path):
    # if os.path.exists(file_path):
    #     shutil.rmtree(file_path)
    pass
