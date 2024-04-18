import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BlocklyComponent } from '../blockly/blockly.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  @ViewChild('blocklyComponent') blocklyComponent!: BlocklyComponent;

  constructor(private router: Router) {}

  endRun() {
    this.router.navigate(['/home']);
  }

  runCode() {
    this.blocklyComponent.runCode();
  }
}
