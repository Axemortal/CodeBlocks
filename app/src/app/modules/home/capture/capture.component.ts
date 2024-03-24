import {
  AfterViewInit,
  Component,
  ElementRef,
  Host,
  HostListener,
  ViewChild,
} from '@angular/core';

import jsQR, { QRCode } from 'jsqr';
import { Point } from 'jsqr/dist/locator';

@Component({
  selector: 'app-capture',
  templateUrl: './capture.component.html',
  styleUrl: './capture.component.scss',
})
export class CaptureComponent implements AfterViewInit {
  @ViewChild('canvasElement', { static: false })
  canvasElement!: ElementRef<HTMLCanvasElement>;

  aspectRatio: number | undefined;
  videoContainerWidth: string | undefined;
  videoContainerHeight: string | undefined;
  private video!: HTMLVideoElement;
  private canvas!: HTMLCanvasElement;
  private canvasContext!: CanvasRenderingContext2D;
  output: string =
    '🎥 Unable to access video stream (please make sure you have a webcam enabled)';

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.initializeCamera();
  }

  ngOnDestroy(): void {
    this.stopCamera();
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
    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas context not found');
    }
    this.canvasContext = context;

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
    this.output = '⌛ Loading video...';
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
      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );

      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code) {
        console.log(code);
        this.drawQRCodeBorders(code);
        this.output = code.data;
      } else {
        this.output = '🔍 No QR code found';
      }
    }
    requestAnimationFrame(() => this.tick());
  }
}
