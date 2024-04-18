import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BlocklyComponent } from '../blockly/blockly.component';
import { CompilationService } from '../../../services/compilation.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  @ViewChild('blocklyComponent') blocklyComponent!: BlocklyComponent;
  isCompiling = false

  constructor(private router: Router, private compilationService:CompilationService) {
    this.compilationService.getData().subscribe(isCompiling => {
      this.isCompiling = isCompiling;
  });
  }

  endRun() {
    this.router.navigate(['/home']);
  }

  runCode() {
    this.blocklyComponent.runCode();
  }
}
