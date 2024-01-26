code_templates = {
    "for loop": lambda x: f"for i in range({x}):\n",
    "if statement": lambda condition: f"if {condition}:\n",
    "while loop": lambda condition: f"while {condition}:\n",
    "variable assignment": lambda var_name, value: f"{var_name} = {value}\n",
    "print statement": lambda message: f"print({message})\n",
    "function definition": lambda func_name, params: f"def {func_name}({params}):\n",
    "class definition": lambda class_name: f"class {class_name}:\n    def __init__(self):\n",
    "comment": lambda text: f"# {text}\n"
}
