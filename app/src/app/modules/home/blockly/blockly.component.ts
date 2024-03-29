import { Component, OnInit } from '@angular/core';

import * as Blockly from 'blockly';
import { BlocklyOptions } from 'blockly';

@Component({
  selector: 'app-blockly',
  templateUrl: './blockly.component.html',
  styleUrls: ['./blockly.component.scss']
})
export class BlocklyComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const blocklyDiv = document.getElementById('blocklyDiv');
    const toolbox = {
      kind: 'flyoutToolbox',
      contents: [
        {
          kind: 'block',
          type: 'controls_ifelse',
        },
        {
          kind: 'block',
          type: 'logic_compare',
        },
        {
          kind: 'block',
          type: 'logic_operation',
        },
        {
          kind: 'block',
          type: 'controls_repeat_ext',
          inputs: {
            TIMES: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 10,
                },
              },
            },
          },
        },
        {
          kind: 'block',
          type: 'logic_operation',
        },
        {
          kind: 'block',
          type: 'logic_negate',
        },
        {
          kind: 'block',
          type: 'logic_boolean',
        },
        {
          kind: 'block',
          type: 'logic_null',
          disabled: 'true',
        },
        {
          kind: 'block',
          type: 'logic_ternary',
        },
        {
          kind: 'block',
          type: 'text_charAt',
          inputs: {
            VALUE: {
              block: {
                type: 'variables_get',
                fields: {
                  VAR: {
                    name: 'text',
                  }
                },
              },
            },
          },
        }
      ]
    };

    if (blocklyDiv){
      Blockly.inject(blocklyDiv, {
      readOnly: false,
      media: 'media/',
      trashcan: true,
      move: {
        scrollbars: true,
        drag: true,
        wheel: true
      },
      toolbox
    } as BlocklyOptions);
    }
  }
}


// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-blockly',
//   templateUrl: './blockly.component.html',
//   styleUrl: './blockly.component.scss'
// })
// export class BlocklyComponent {

// }
