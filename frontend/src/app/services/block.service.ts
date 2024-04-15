import { Injectable } from '@angular/core';
import Blockly from 'blockly';

@Injectable({
  providedIn: 'root',
})
export class BlockService {
  private storageKey = 'blocklyWorkspace';
  private code: string = '';
  private toolbox: any;

  constructor() {
    this.initBlockly();
  }

  private async initBlockly() {
    const blocks = await fetch('../../assets/blocks.json').then((res) =>
      res.json()
    );
    Blockly.defineBlocksWithJsonArray(blocks);

    this.toolbox = {
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
  }

  setCode(code: string) {
    this.code = code;
  }

  getCode(): string {
    return this.code;
  }

  getToolbox(): any {
    return this.toolbox;
  }

  saveContext() {
    const workspace = Blockly.getMainWorkspace();
    const data = Blockly.serialization.workspaces.save(workspace);
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  loadSavedContext(data: any = {}) {
    const workspace = Blockly.getMainWorkspace();
    if (!Object.keys(data).length) {
      data = JSON.parse(localStorage.getItem(this.storageKey) ?? '{}');
    }
    // Don't emit events during loading.
    Blockly.Events.disable();
    Blockly.serialization.workspaces.load(data, workspace);
    Blockly.Events.enable();
  }
}
