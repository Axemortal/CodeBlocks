import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { CaptureComponent } from './capture/capture.component';


@NgModule({
  declarations: [
    LayoutComponent,
    CaptureComponent
  ],
  imports: [
    CommonModule
  ]
})
export class HomeModule { }
