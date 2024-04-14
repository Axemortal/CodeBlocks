import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  isSupported = false;
  isOpenCamera = false;
  isUploading = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

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

  goToUpload(){
    this.isUploading = true;
    // this.router.navigate(['/translator'])
  }

  goToRun() {
    // Route to translator page
    this.router.navigate(['/translator']);
  }
}

