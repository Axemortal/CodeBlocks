import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  isSupported = false;
  isOpenCamera = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
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

  closeCamera() {
    this.isOpenCamera = false;
  }

  finishRecording() {
    this.router.navigate(['/translator']);
  }

  uploadImage() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      this.http
        .post(`${environment.apiUrl}/scanner/upload`, formData)
        .subscribe(
          (res) => {
            console.log(res);
          },
          (err) => {
            console.error(err);
          }
        );
    }
  }
}
