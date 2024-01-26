import cv2
import numpy as np
from pyzbar.pyzbar import decode
from templates import code_templates

def generate_code_block(decoded_data, *args):
    
    if decoded_data in code_templates:
        return code_templates[decoded_data](3)

    return None

cap = cv2.VideoCapture(0)

while True:
    success, img = cap.read()
    
    if not success:
        break

    for code in decode(img):
        decoded_data = code.data.decode("utf-8")
        print(type(decoded_data))
        rect_points = code.rect

        if decoded_data:
            code_block = generate_code_block(decoded_data)
            if code_block:
                print("Generated Code Block:\n", code_block)

            pts = np.array([code.polygon], np.int32)
            cv2.polylines(img, [pts], True, (255, 0, 0), 3)
            cv2.putText(img, str(decoded_data), (rect_points[0], rect_points[1]), cv2.FONT_HERSHEY_COMPLEX_SMALL, 1, (0, 255, 0), 2)

    cv2.imshow("image", img)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
