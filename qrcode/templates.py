code_templates = {
    "for": lambda x: f"for i in range({x}):\n",
    "if": lambda condition: f"if {condition}:\n",
    "while": lambda condition: f"while {condition}:\n",
    "variable": lambda var_name, value: f"{var_name} = {value}\n",
    "print": lambda message: f"print({message})\n",
    "function": lambda func_name, params: f"def {func_name}({params}):\n",
    "comment": lambda text: f"# {text}\n"
}
