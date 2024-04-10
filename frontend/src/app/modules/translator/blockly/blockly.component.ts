import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import * as Blockly from 'blockly';
import { BlocklyOptions } from 'blockly';

@Component({
  selector: 'app-blockly',
  templateUrl: './blockly.component.html',
  styleUrls: ['./blockly.component.scss'],
})
export class BlocklyComponent implements AfterViewInit {
  @ViewChild('blocklyDiv') blocklyDiv!: ElementRef;
  constructor() {}

  async ngAfterViewInit() {
    // Read blocks.json
    const blocks = await fetch('../../../../assets/blocks.json').then((res) =>
      res.json()
    );
    Blockly.defineBlocksWithJsonArray(blocks);

    const toolbox = {
      kind: 'flyoutToolbox',
      contents: [
        {
          kind: 'block',
          type: 'stop',
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
}
