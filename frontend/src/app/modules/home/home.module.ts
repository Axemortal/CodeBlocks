import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { CaptureComponent } from './capture/capture.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { MotionDetectorComponent } from './motion-detector/motion-detector.component';

@NgModule({
  declarations: [
    LayoutComponent,
    CaptureComponent,
    WelcomeComponent,
    MotionDetectorComponent,
  ],
  imports: [CommonModule],
})
export class HomeModule {}
