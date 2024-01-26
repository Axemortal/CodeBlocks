import cv2
import numpy as np
from pyzbar.pyzbar import decode
from templates import code_templates

# Generates the code block based on the QR Code data, accepting a list of arguments 
# Example: decode_data: "for loop", *args: 3, 6 ====> for i in range(3, 6):
def generate_code_block(decoded_data, *args):
    if decoded_data in code_templates:
        return code_templates[decoded_data](3) # Testing for loop function, using range value of 3 for dummy data

    return None

# Start video camera
cap = cv2.VideoCapture(0)

# True statement to constantly scan
while True:
    # Read a frame
    success, img = cap.read()
    
    if not success:
        break
    
    # Decode data
    for code in decode(img):
        decoded_data = code.data.decode("utf-8")
        rect_points = code.rect

        # If successfully decoded, attempt to generate code block
        if decoded_data:
            code_block = generate_code_block(decoded_data)
            if code_block:
                print("Generated Code Block:\n", code_block)

            # This is for visual debugging, basically it draws a rectangle on the QR Code for you and prints the decoded data
            pts = np.array([code.polygon], np.int32)
            cv2.polylines(img, [pts], True, (255, 0, 0), 3)
            cv2.putText(img, str(decoded_data), (rect_points[0], rect_points[1]), cv2.FONT_HERSHEY_COMPLEX_SMALL, 1, (0, 255, 0), 2)

    cv2.imshow("image", img)

    # Press q to quit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
