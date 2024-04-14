import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { CaptureComponent } from './capture/capture.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeRoutingModule } from './home-routing.module';
import { UploadComponent } from './upload/upload.component';

@NgModule({
  declarations: [LayoutComponent, CaptureComponent, WelcomeComponent, UploadComponent],
  imports: [CommonModule, HttpClientModule, HomeRoutingModule],
})
export class HomeModule {}
