import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { CaptureComponent } from './capture/capture.component';
import { BlocklyComponent } from './blockly/blockly.component';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  declarations: [
    LayoutComponent,
    CaptureComponent,
    BlocklyComponent,
    WelcomeComponent,
  ],
  imports: [CommonModule],
})
export class HomeModule {}
