import * as Blockly from 'blockly';

export const cppGenerator = new Blockly.Generator('cpp');

cppGenerator.forBlock['move_forward'] = function (block) {
  const code = 'forward(motorL, motorR, 150)';
  return code;
};

cppGenerator.forBlock['move_backward'] = function (block, generator) {
  const code = 'back(motorL, motorR, 150)';
  return code;
};

cppGenerator.forBlock['turn_left'] = function (block, generator) {
  const code = `motorL.drive(-255,1000);
motorR.drive(255,1000)`;
  return code;
};

cppGenerator.forBlock['turn_right'] = function (block, generator) {
  const code = `motorL.drive(255,1000);
motorR.drive(-255,1000)`;
  return code;
};

cppGenerator.forBlock['stop'] = function (block, generator) {
  const code = 'brake(motorL, motorR)';
  return code;
};

cppGenerator.forBlock['quack'] = function (block, generator) {
  // TODO - Add CPP Code
  const code = '...\n';
  return code;
};

cppGenerator.forBlock['wait'] = function (block, generator) {
  // TODO - Update implementation
  const delay_ms = block.getFieldValue('WAIT');
  let code = '';
  if (delay_ms) {
    code = `delay(${delay_ms}000)`;
  }
  return code;
};

cppGenerator.forBlock['if_else'] = function (block, generator) {
  const condition = generator.statementToCode(block, 'if_else_if');
  const if_do = generator.statementToCode(block, 'if_else_do');
  const else_do = generator.statementToCode(block, 'if_else_else');
  const code = `update();
if(${condition}) {
${if_do}
} else{
${else_do}
}`;
  return code;
};

cppGenerator.forBlock['if'] = function (block, generator) {
  const condition = generator.statementToCode(block, 'if_if');
  const if_do = generator.statementToCode(block, 'if_do');
  const code = `update();
if(${condition}) {
${if_do}
}`;
  return code;
};

cppGenerator.forBlock['repeat'] = function (block, generator) {
  const count = block.getFieldValue('NAME');
  const repeat_do = generator.statementToCode(block, 'repeat_repeat');
  const code = `for (int i=0; i<${count}; i++) {
update();
${repeat_do}
}`;
  return code;
};

cppGenerator.forBlock['obstacle_front'] = function (block, generator) {
  const code = 'distance < 10';
  return code;
};

cppGenerator.forBlock['clap'] = function (block, generator) {
  // TODO - Add CPP Code
  const code = '...';
  return code;
};

// @ts-ignore
cppGenerator.scrub_ = function (block, code, thisOnly) {
  const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  if (nextBlock && !thisOnly) {
    return code + ';\n' + cppGenerator.blockToCode(nextBlock);
  } else {
    // Remove semicolon for blocks that don't need it
    const blockType = block.type;
    if (['obstacle_front', 'clap'].includes(blockType)) {
      return code;
    }
    return code + ';';
  }
};