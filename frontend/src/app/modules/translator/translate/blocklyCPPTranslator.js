python.pythonGenerator.forBlock["move_forward"] = function (block, generator) {
    var code = "forward(motorL, motorR, 150);\n";
    return code;
};

python.pythonGenerator.forBlock["move_backward"] = function (block, generator) {
    var code = "back(motorL, motorR, 150);\n";
    return code;
};

python.pythonGenerator.forBlock["turn_left"] = function (block, generator) {
    var code = "motorL.drive(-255,1000);\n motorR.drive(255,1000);\n";
    return code;
};

python.pythonGenerator.forBlock["turn_right"] = function (block, generator) {
    var code = "motorL.drive(255,1000);\n motorR.drive(-255,1000);\n";
    return code;
};

python.pythonGenerator.forBlock["stop"] = function (block, generator) {
    var code = "brake(motorL, motorR);\n";
    return code;
};

python.pythonGenerator.forBlock["quack"] = function (block, generator) {
    // TODO: Assemble python into code variable.
    var code = "...\n";
    return code;
};

python.pythonGenerator.forBlock["wait"] = function (block, generator) {
    var value_wait_wait = generator.valueToCode(
        block,
        "wait_wait",
        python.Order.ATOMIC
    );
    var code = `delay(${value_wait_wait}000);\n`;
    return code;
};

python.pythonGenerator.forBlock["if_else"] = function (block, generator) {
    var statements_if_else_if = generator.statementToCode(block, "if_else_if");
    var statements_if_else_do = generator.statementToCode(block, "if_else_do");
    var statements_if_else_else = generator.statementToCode(
        block,
        "if_else_else"
    );
    var code = `update();\n if(${statements_if_else_if}) {\n ${statements_if_else_do}\n} else{\n ${statements_if_else_else}\n }\n`;
    return code;
};

python.pythonGenerator.forBlock["if"] = function (block, generator) {
    var statements_if_if = generator.statementToCode(block, "if_if");
    var statements_if_do = generator.statementToCode(block, "if_do");
    var code = `update();\n if(${statements_if_if}) {\n ${statements_if_do}\n }\n`;
    return code;
};

python.pythonGenerator.forBlock["repeat"] = function (block, generator) {
    var number_name = block.getFieldValue("NAME");
    var statements_repeat_repeat = generator.statementToCode(
        block,
        "repeat_repeat"
    );
    var code = `for (int i=0; i < ${number_name}; i++){\n update();\n ${statements_repeat_repeat}\n }\n`;
    return code;
};

python.pythonGenerator.forBlock["obstacle"] = function (block, generator) {
    var code = "distance < 10";
    return code;
};

python.pythonGenerator.forBlock["more_than"] = function (block, generator) {
    var statements_more_than_if = generator.statementToCode(
        block,
        "more_than_if"
    );
    var number_name = block.getFieldValue("NAME");
    var statements_more_than_then = generator.statementToCode(
        block,
        "more_than_then"
    );
    // TODO: Assemble python into code variable.
    var code = "...\n";
    return code;
};

python.pythonGenerator.forBlock["less_than"] = function (block, generator) {
    var statements_less_than_if = generator.statementToCode(
        block,
        "less_than_if"
    );
    var number_name = block.getFieldValue("NAME");
    var statements_less_than_then = generator.statementToCode(
        block,
        "less_than_then"
    );
    // TODO: Assemble python into code variable.
    var code = "...\n";
    return code;
};

python.pythonGenerator.forBlock["equals_to"] = function (block, generator) {
    var statements_equals_to_if = generator.statementToCode(
        block,
        "equals_to_if"
    );
    var number_name = block.getFieldValue("NAME");
    var statements_equals_to_then = generator.statementToCode(
        block,
        "equals_to_then"
    );
    // TODO: Assemble python into code variable.
    var code = "...\n";
    return code;
};

python.pythonGenerator.forBlock["clap"] = function (block, generator) {
    var statements_clap_do = generator.statementToCode(block, "clap_do");
    // TODO: Assemble python into code variable.
    var code = "...\n";
    return code;
};
