import json
import uuid
import numpy as np
import os
from scanner.templates import id_mappings

HEIGHT_TOLERANCE = 225


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
            # Sample: ("QR Data Here", (100, 200))
            qr_codes_with_positions.append((data, (top, left)))

    sorted_qrs = sorted(qr_codes_with_positions, key=lambda item: (
        get_row(item[1][0]), item[1][1]))

    function_structure = []
    current_row = [sorted_qrs[0]]  # Insert first QR Code in first row

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


def map_functions(function_structure):
    function_sequence = []

    for row in function_structure:
        for func in row:
            if func[0] is not None:
                function_sequence.append(id_mappings[func[0]])

    return function_sequence


def map_blocks(function_sequence):
    file_directory = os.path.dirname(__file__)
    file_path = os.path.join(file_directory, "blocks.json")

    with open(file_path, 'r') as f:
        block_types = json.load(f)

    blocks = []  # Keeps track of all blocks
    if_stack = []  # Keep track of if blocks
    i = 0  # Index of the function calls

    while i < len(function_sequence):
        func = function_sequence[i]

        if func in block_types:
            block = {"type": block_types[func], "id": uuid.uuid4().hex}

            if func == 'if':
                if_stack.append(block)

            elif func == 'else':
                if if_stack:
                    top_block = if_stack.pop()
                    top_block["type"] = "if_else"

            elif func == 'end_if':
                if if_stack:
                    top_block = if_stack.pop()

            elif func == "repeat":
                # Increment to the next block, which should be a number
                num = ''
                while i+1 < len(function_sequence) and function_sequence[i+1].isdigit():
                    num += function_sequence[i+1]
                    i += 1
                block["fields"] = {"NAME": num}

            elif func == "wait":
                num = ''
                while i+1 < len(function_sequence) and function_sequence[i+1].isdigit():
                    num += function_sequence[i+1]
                    i += 1
                block["fields"] = {"wait_wait": num}

            blocks.append(block)

        i += 1

    stack = []  # Stack to keep track of control blocks
    i = 0  # Index of the blocks
    while i < len(blocks) - 1:
        if blocks[i]["type"] == "if":
            stack.append(blocks[i])
            blocks[i].update({
                "inputs": {
                    "if_if": {
                        "block": blocks[i + 1]
                    },
                    "if_do": {
                        "block": blocks[i + 2]
                    }
                }
            })
            # Skip an iteration for the condition block
            i += 1

        elif blocks[i]["type"] == "end_if":
            if stack and stack[-1]["type"] == "if":
                if_block = stack.pop()
                if_block["next"] = {
                    "block": blocks[i + 1]
                }

        elif blocks[i]["type"] == "repeat":
            blocks[i].update({
                "inputs": {
                    "repeat_repeat": {
                        "block": blocks[i + 1]
                    }
                }
            })

        elif blocks[i]["type"] == "repeat_end":
            if stack and stack[-1]["type"] == "repeat":
                repeat_block = stack.pop()
                repeat_block["next"] = {
                    "block": blocks[i + 1]
                }

        elif blocks[i]["type"] == "if_else":
            stack.append(blocks[i])
            blocks[i].update({
                "inputs": {
                    "if_else_if": {
                        "block": blocks[i + 1]  # This is the condition block
                    },
                    "if_else_do": {
                        "block": blocks[i + 2]  # This is the action block
                    }
                }
            })
            # Skip an iteration for the condition block
            i += 1

        elif blocks[i]["type"] == "else":
            if stack and stack[-1]["type"] == "if_else":
                stack[-1]["inputs"].update({
                    "if_else_else": {
                        "block": blocks[i + 1]
                    }
                })

        elif blocks[i]["type"] == "end_else":
            if stack and stack[-1]["type"] == "if_else":
                if_else_block = stack.pop()
                if_else_block["next"] = {
                    "block": blocks[i + 1]
                }

        else:
            if blocks[i + 1]["type"] not in ["end_if", "end_else", "end_repeat", "else"]:
                blocks[i]["next"] = {
                    "block": blocks[i + 1]
                }
        i += 1

    output = {
        "blocks": {
            "languageVersion": 0,
            "blocks": [blocks[0]]
        }
    }

    return output
