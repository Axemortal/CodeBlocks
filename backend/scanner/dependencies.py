import numpy as np
from scanner.templates import id_mappings

HEIGHT_TOLERANCE = 250

def get_row(y):
    return round(y / HEIGHT_TOLERANCE)

def get_qr_top_and_left(quad_xy):
    # Calculate the average top Y coordinate (mean of the Y values of the top-left and top-right corners)
    top = np.mean([quad_xy[0][1], quad_xy[1][1]])
    # Calculate the average left X coordinate (mean of the X values of the top-left and bottom-left corners)
    left = np.mean([quad_xy[0][0], quad_xy[3][0]])
    return top, left

# Analyses the X and Y values of each QR Code to determine their orders
def analyse_spatial_arrangement(qr_data, metadata):
    qr_codes_with_positions = []
    for i, data in enumerate(qr_data):
        if i < len(metadata):
            top, left = get_qr_top_and_left(metadata[i]['quad_xy'])
            qr_codes_with_positions.append((data, (top, left))) # Sample: ("QR Data Here", (100, 200))
    
    sorted_qrs = sorted(qr_codes_with_positions, key = lambda item: (get_row(item[1][0]), item[1][1]))

    function_structure = []
    current_row = [sorted_qrs[0]] # Insert first QR Code in first row

    for item in sorted_qrs[1:]:
        qr, (top, left) = item
        if len(current_row) == 0:
            current_row = [item]
        last_qr, (last_top, last_left) = current_row[-1]

        if get_row(top) == get_row(last_top):  
            if item in current_row:
                continue
            current_row.append(item)

        else:
            function_structure.append(current_row)
            current_row = [item]

    if current_row:
        function_structure.append(current_row)

    return function_structure

# Iterate through the formatted list to achieve function calls
def build_function_calls(function_structure):
    function_sequence = []
    for each_row in function_structure:
        row = list(reversed(each_row))

        for index, each_func in enumerate(row):
            if index == 0:
                if each_func in ['1', '2', '3', '4', '5', '6', '7', '8', '9']:
                    mapped_func = id_mappings[each_func[0]]
                else:
                    mapped_func = id_mappings[each_func[0]]("")
            else:
                mapped_func = id_mappings[each_func[0]](mapped_func)

        function_sequence.append(mapped_func)

    return function_sequence