import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';

import jsQR, { QRCode } from 'jsqr';
import { Point } from 'jsqr/dist/locator';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { BlockService } from '../../../services/block.service';

@Component({
  selector: 'app-capture',
  templateUrl: './capture.component.html',
  styleUrl: './capture.component.scss',
})
export class CaptureComponent implements AfterViewInit {
  @ViewChild('canvasElement', { static: false })
  canvasElement!: ElementRef<HTMLCanvasElement>;

  videoContainerWidth: string | undefined;
  videoContainerHeight: string | undefined;
  output: string =
    '🎥 Unable to access video stream (please make sure you have a webcam enabled)';

  private aspectRatio: number | undefined;
  private video!: HTMLVideoElement;
  private canvas!: HTMLCanvasElement;
  private canvasContext!: CanvasRenderingContext2D;
  private framesSinceLastSend = 0;
  private isDestroyed = false;

  constructor(
    private elementRef: ElementRef,
    private http: HttpClient,
    private router: Router,
    private blockService: BlockService
  ) {}

  ngAfterViewInit(): void {
    this.initializeCamera();
  }

  ngOnDestroy(): void {
    this.stopCamera();
    this.isDestroyed = true;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.calculateAspectRatio();
  }

  calculateAspectRatio(): void {
    const componentWidth = this.elementRef.nativeElement.clientWidth;
    const componentHeight = this.elementRef.nativeElement.clientHeight;

    const componentAspectRatio = componentWidth / componentHeight;

    if (!this.aspectRatio) {
      return;
    }

    if (componentAspectRatio < this.aspectRatio) {
      this.videoContainerWidth = componentWidth + 'px';
      this.videoContainerHeight =
        (componentWidth / this.aspectRatio).toString() + 'px';
    } else {
      this.videoContainerHeight = componentHeight + 'px';
      this.videoContainerWidth =
        (componentHeight * this.aspectRatio).toString() + 'px';
    }
  }

  private initializeCamera(): void {
    this.video = document.createElement('video');
    this.canvas = this.canvasElement.nativeElement;
    const context = this.canvas.getContext('2d', { willReadFrequently: true });
    if (!context) {
      throw new Error('Canvas context not found');
    }
    this.canvasContext = context;

    this.output = '⌛ Loading video...';

    // Use facingMode: environment to attempt to get the front camera on phones
    const mediaConstraints = { video: { facingMode: 'environment' } };
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then((stream) => {
        this.aspectRatio = stream.getVideoTracks()[0].getSettings().aspectRatio;
        this.calculateAspectRatio();
        this.video.srcObject = stream;
        this.video.setAttribute('playsinline', 'true'); // required to tell iOS safari we don't want fullscreen
        this.video.play();
        this.output = 'Scanning';
        requestAnimationFrame(() => this.tick());
      })
      .catch((err) => {
        console.log(err);
      });
  }

  private stopCamera(): void {
    const stream = this.video.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  }

  private drawLine(begin: Point, end: Point, color: string): void {
    this.canvasContext.beginPath();
    this.canvasContext.moveTo(begin.x, begin.y);
    this.canvasContext.lineTo(end.x, end.y);
    this.canvasContext.lineWidth = 4;
    this.canvasContext.strokeStyle = color;
    this.canvasContext.stroke();
  }

  private drawQRCodeBorders(code: QRCode): void {
    const {
      topLeftCorner,
      topRightCorner,
      bottomRightCorner,
      bottomLeftCorner,
    } = code.location;
    this.drawLine(topLeftCorner, topRightCorner, '#FF3B58');
    this.drawLine(topRightCorner, bottomRightCorner, '#FF3B58');
    this.drawLine(bottomRightCorner, bottomLeftCorner, '#FF3B58');
    this.drawLine(bottomLeftCorner, topLeftCorner, '#FF3B58');
  }

  private tick(): void {
    if (this.isDestroyed) {
      return;
    }
    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
      this.canvas.hidden = false;
      this.canvas.height = this.video.videoHeight;
      this.canvas.width = this.video.videoWidth;
      this.canvasContext.drawImage(
        this.video,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );

      const dataURL = this.canvas.toDataURL('image/png');
      const base64Data = dataURL.split(',')[1];
      this.sendVideoFrameToBackend(base64Data);

      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );

      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code && this.isValidCode(code.data)) {
        this.drawQRCodeBorders(code);
      }
    }
    requestAnimationFrame(() => this.tick());
  }

  private isValidCode(data: string): boolean {
    if (isNaN(parseInt(data))) {
      return false;
    }
    return true;
  }

  private sendVideoFrameToBackend(videoFrame: string): void {
    const samplingRate = 100;

    if (this.framesSinceLastSend < samplingRate) {
      this.framesSinceLastSend++;
      return;
    } else {
      this.framesSinceLastSend = 0;

      const byteCharacters = atob(videoFrame);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });
      const formData = new FormData();

      formData.append('videoFrame', videoFrame);
      formData.append('videoFrame', blob, 'videoFrame.png');

      // Send the video frame to the backend
      this.http.post(`${environment.apiUrl}/scanner/scan`, formData).subscribe(
        (res: any) => {
          this.blockService.setCode(res.code);
          this.router.navigate(['/translator']);
        },
        (err) => {
          console.error('Error sending video frame to backend:', err);
        }
      );
    }
  }
}
