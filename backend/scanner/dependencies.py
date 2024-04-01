import cv2
import numpy as np
from pyzbar.pyzbar import decode
from templates import code_templates
import subprocess

filename = "script.py"

# Generate a code block
# Data should be comma separated E.g. for 3 => for i in range(3):


def generate_code_block(decoded_data):
    parts = decoded_data.split(',')
    if not parts:
        return None

    command = parts[0]
    args = parts[1:]

    if command in code_templates:
        return code_templates[command](*args)

    return None


def write_code(code_block, filename):
    # Write the code block to a file
    with open(filename, 'a') as file:
        file.write(code_block)


def capture_and_decode_image():
    # Start video camera
    cap = cv2.VideoCapture(0)
    success, img = cap.read()
    cap.release()

    if not success:
        print("Failed to capture image")
        return

    # Decode QR codes in the image
    decoded_objects = decode(img)

    # Sort decoded QR codes by their topmost y-coordinate
    sorted_decoded_objects = sorted(decoded_objects, key=lambda x: x.rect.top)

    for code in sorted_decoded_objects:
        decoded_data = code.data.decode("utf-8")

        # Generate code block based on decoded data
        code_block = generate_code_block(decoded_data)
        if code_block:
            print("Generated Code Block: " + code_block)
            write_code(code_block, filename)

    '''
    This portion is for formatting the code blocks, but right now it can't really detect indentions well :/
    I'll see what other libraries are there
    '''
    # try:
    #     subprocess.run(["black", filename], check=True)
    #     print(f"Formatted script written to {filename}")
    # except subprocess.CalledProcessError as e:
    #     print(f"Error formatting script with Black: {e}")

    # cv2.imshow("Decoded QR Codes", img)
    cv2.waitKey(0)  # Wait for a key press to exit
    cv2.destroyAllWindows()


# Call the function to capture an image and decode QR codes
if __name__ == "__main__":
    capture_and_decode_image()
