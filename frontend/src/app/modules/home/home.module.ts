import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { CaptureComponent } from './capture/capture.component';
import { MotionDetectorComponent } from './motion-detector/motion-detector.component';
import { TestComponent } from './test/test.component';


@NgModule({
  declarations: [
    LayoutComponent,
    CaptureComponent,
    MotionDetectorComponent,
    TestComponent
  ],
  imports: [
    CommonModule
  ]
})
export class HomeModule { }
