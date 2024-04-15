import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import * as Blockly from 'blockly';
import { BlocklyOptions } from 'blockly';
import { cppGenerator } from './generators/cpp';

@Component({
  selector: 'app-blockly',
  templateUrl: './blockly.component.html',
  styleUrls: ['./blockly.component.scss'],
})
export class BlocklyComponent implements AfterViewInit {
  @ViewChild('blocklyDiv') blocklyDiv!: ElementRef;
  storageKey = 'blocklyWorkspace';

  constructor() {}

  async ngAfterViewInit() {
    // Read blocks.json
    const blocks = await fetch('../../../../assets/blocks.json').then((res) =>
      res.json()
    );
    Blockly.defineBlocksWithJsonArray(blocks);

    const toolbox = {
      kind: 'categoryToolbox',
      contents: [
        {
          kind: 'category',
          name: 'Actions',
          colour: '#5C81A6',
          contents: [
            {
              kind: 'block',
              type: 'move_forward',
            },
            {
              kind: 'block',
              type: 'move_backward',
            },
            {
              kind: 'block',
              type: 'turn_left',
            },
            {
              kind: 'block',
              type: 'turn_right',
            },
            {
              kind: 'block',
              type: 'stop',
            },
            {
              kind: 'block',
              type: 'quack',
            },
            {
              kind: 'block',
              type: 'wait',
            },
          ],
        },
        {
          kind: 'category',
          name: 'Controls',
          colour: '#5CA65C',
          contents: [
            {
              kind: 'block',
              type: 'if_else',
            },
            {
              kind: 'block',
              type: 'if',
            },
            {
              kind: 'block',
              type: 'repeat',
            },
          ],
        },
        {
          kind: 'category',
          name: 'Conditions',
          colour: '#A65C5C',
          contents: [
            {
              kind: 'block',
              type: 'obstacle_front',
            },
            {
              kind: 'block',
              type: 'clap',
            },
          ],
        },
      ],
    };

    if (this.blocklyDiv) {
      Blockly.inject(this.blocklyDiv.nativeElement, {
        readOnly: false,
        media: 'media/',
        trashcan: true,
        move: {
          scrollbars: true,
          drag: true,
          wheel: true,
        },
        toolbox,
        horizontalLayout: true,
        toolboxPosition: 'start',
      } as BlocklyOptions);
    }
  }

  saveContext() {
    // TODO - Implement CPP Generator in a meaningful way
    console.log(cppGenerator.workspaceToCode(Blockly.getMainWorkspace()));
    const workspace = Blockly.getMainWorkspace();
    const data = Blockly.serialization.workspaces.save(workspace);
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  loadSavedContext() {
    const workspace = Blockly.getMainWorkspace();
    const data = JSON.parse(localStorage.getItem(this.storageKey) ?? '{}');

    // Don't emit events during loading.
    Blockly.Events.disable();
    Blockly.serialization.workspaces.load(data, workspace);
    Blockly.Events.enable();
  }
}
