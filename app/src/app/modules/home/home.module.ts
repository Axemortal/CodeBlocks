import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { CaptureComponent } from './capture/capture.component';
import { LandingComponent } from './landing/landing.component';
import { BlocklyComponent } from './blockly/blockly.component';
import { WelcomeComponent } from './welcome/welcome.component';


@NgModule({
  declarations: [
    LayoutComponent,
    CaptureComponent,
    LandingComponent,
    BlocklyComponent,
    WelcomeComponent,
  ],
  imports: [
    CommonModule
  ]
})
export class HomeModule { }
