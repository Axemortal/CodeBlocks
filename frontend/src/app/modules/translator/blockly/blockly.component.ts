import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import * as Blockly from 'blockly';
import { BlocklyOptions } from 'blockly';
import { cppGenerator } from './generators/cpp';
import { environment } from '../../../../environments/environment';
import { BlockService } from '../../../services/block.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-blockly',
  templateUrl: './blockly.component.html',
  styleUrls: ['./blockly.component.scss'],
})
export class BlocklyComponent implements AfterViewInit {
  @ViewChild('blocklyDiv') blocklyDiv!: ElementRef;
  blocks: any;

  constructor(private blockService: BlockService, private http: HttpClient) {}

  async ngAfterViewInit() {
    // Add timeout for the blockService to load the toolbox
    setTimeout(() => {
      const toolbox = this.blockService.getToolbox();

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

      this.blocks = this.blockService.getCode();
      this.blockService.loadSavedContext(this.blocks);
    }, 1000);
  }

  saveContext() {
    this.blockService.saveContext();
  }

  loadSavedContext() {
    this.blockService.loadSavedContext();
  }

  runCode() {
    const code = cppGenerator.workspaceToCode(Blockly.getMainWorkspace());

    this.http.post(`${environment.apiUrl}/compiler/compile`, code).subscribe(
      (res: any) => {
        if (!res.ok) {
          throw new Error('Error compiling code');
        }
        return res;
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
