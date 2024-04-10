import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlocklyComponent } from './blockly/blockly.component';
import { TestComponent } from './test/test.component';
import { LayoutComponent } from './layout/layout.component';

@NgModule({
  declarations: [BlocklyComponent, TestComponent, LayoutComponent],
  imports: [CommonModule],
})
export class TranslatorModule {}
