import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlocklyComponent } from './blockly/blockly.component';
import { LayoutComponent } from './layout/layout.component';
import { TranslatorRoutingModule } from './translator-routing.module';

@NgModule({
  declarations: [BlocklyComponent, LayoutComponent],
  imports: [CommonModule, TranslatorRoutingModule],
})
export class TranslatorModule {}
