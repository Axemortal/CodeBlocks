import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { CaptureComponent } from './capture/capture.component';
import { BlocklyComponent } from './blockly/blockly.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { MotionDetectorComponent } from './motion-detector/motion-detector.component';
import { TestComponent } from './test/test.component';

@NgModule({
  declarations: [
    LayoutComponent,
    CaptureComponent,
    BlocklyComponent,
    WelcomeComponent,
    MotionDetectorComponent,
    TestComponent,
  ],
  imports: [CommonModule],
})
export class HomeModule {}
