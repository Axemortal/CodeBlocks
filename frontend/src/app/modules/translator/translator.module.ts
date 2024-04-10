import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlocklyComponent } from './blockly/blockly.component';
import { LayoutComponent } from './layout/layout.component';
import { TranslateComponent } from './translate/translate.component';

@NgModule({
  declarations: [BlocklyComponent, LayoutComponent, TranslateComponent],
  imports: [CommonModule],
})
export class TranslatorModule {}
