import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  isSupported = false;
  isOpenCamera = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isSupported = 'mediaDevices' in window.navigator;
    }
  }

  openCamera() {
    this.isOpenCamera = true;
  }

  onOffCamera() {
    this.isOpenCamera = false;
  }
}
