import * as Blockly from 'blockly';

Blockly.defineBlocksWithJsonArray([{
    "type": "move_forward",
    "message0": "Move forward",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 285,
    "tooltip": "Move",
    "helpUrl": ""
  },
  {
    "type": "move_backward",
    "message0": "Move backward",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 285,
    "tooltip": "Move",
    "helpUrl": ""
  },
  {
    "type": "turn_left",
    "message0": "Turn left",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 285,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "turn_right",
    "message0": "Turn right",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 285,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "stop",
    "message0": "Stop!",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 285,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "quack",
    "message0": "Quack!",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 285,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "wait",
    "message0": "wait %1",
    "args0": [
      {
        "type": "input_value",
        "name": "NAME"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 285,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "if_else",
    "message0": "if %1 do %2 else %3",
    "args0": [
      {
        "type": "input_statement",
        "name": "NAME",
        "align": "RIGHT"
      },
      {
        "type": "input_statement",
        "name": "NAME",
        "align": "RIGHT"
      },
      {
        "type": "input_statement",
        "name": "NAME",
        "align": "RIGHT"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 135,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "if",
    "message0": "if %1 do %2",
    "args0": [
      {
        "type": "input_statement",
        "name": "NAME",
        "align": "RIGHT"
      },
      {
        "type": "input_statement",
        "name": "NAME",
        "align": "RIGHT"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 135,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "repeat",
    "message0": "repeat %1 times %2",
    "args0": [
      {
        "type": "field_number",
        "name": "NAME",
        "value": 0
      },
      {
        "type": "input_statement",
        "name": "NAME",
        "align": "RIGHT"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 135,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "obstacle",
    "message0": "if obstacle in front %1 do %2",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "NAME",
        "align": "RIGHT"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 300,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "more_than",
    "message0": "if %1 more than %2 %3 then %4",
    "args0": [
      {
        "type": "input_statement",
        "name": "NAME"
      },
      {
        "type": "field_number",
        "name": "NAME",
        "value": 0
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "NAME"
      }
    ],
    "previousStatement": null,
    "colour": 300,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "less_than",
    "message0": "if %1 less than %2 %3 then %4",
    "args0": [
      {
        "type": "input_statement",
        "name": "NAME"
      },
      {
        "type": "field_number",
        "name": "NAME",
        "value": 0
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "NAME"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 300,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "equals_to",
    "message0": "if %1 equals to %2 %3 then %4",
    "args0": [
      {
        "type": "input_statement",
        "name": "NAME"
      },
      {
        "type": "field_number",
        "name": "NAME",
        "value": 0
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "NAME"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 300,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "clap",
    "message0": "if clap %1 do %2",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "NAME",
        "align": "RIGHT"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 300,
    "tooltip": "",
    "helpUrl": ""
  }])


  //insert block logic here