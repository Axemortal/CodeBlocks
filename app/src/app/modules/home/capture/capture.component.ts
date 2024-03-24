import {
  AfterViewInit,
  Component,
  ElementRef,
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

  videoContainerWidth: string | undefined;
  videoContainerHeight: string | undefined;
  output: string =
    '🎥 Unable to access video stream (please make sure you have a webcam enabled)';

  private aspectRatio: number | undefined;
  private focalLength = 1; // TODO: Find the focal length of the camera
  position: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
  velocity: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
  depth: number = 0;
  motionData: DeviceMotionEvent | undefined;
  private capturedData: QRCode[] = [];
  private video!: HTMLVideoElement;
  private canvas!: HTMLCanvasElement;
  private canvasContext!: CanvasRenderingContext2D;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.initializeCamera();
    this.setupMotionDetection();
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.calculateAspectRatio();
  }

  private setupMotionDetection(): void {
    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', this.handleMotion.bind(this));
    } else {
      this.output =
        'Device is unable to detect motion, please take pictures instead';
    }
  }

  private handleMotion(event: DeviceMotionEvent): void {
    // Skip velocity calculation for the first motion event
    if (!this.motionData) {
      this.motionData = event;
      return;
    }

    const previousAcceleration = this.motionData.acceleration;
    const previousTimestamp = this.motionData.timeStamp;

    const currentAcceleration = event.acceleration;
    const currentTimestamp = event.timeStamp;

    const dt = (currentTimestamp - previousTimestamp) / 1000; // Convert to seconds

    const averageAcceleration = {
      x: ((currentAcceleration?.x ?? 0) + (previousAcceleration?.x ?? 0)) / 2,
      y: ((currentAcceleration?.y ?? 0) + (previousAcceleration?.y ?? 0)) / 2,
      z: ((currentAcceleration?.z ?? 0) + (previousAcceleration?.z ?? 0)) / 2,
    };

    const dampingFactor = 0.98;

    const previousVelocity = this.velocity;
    this.velocity.x =
      this.velocity.x * dampingFactor + averageAcceleration.x * dt;
    this.velocity.y =
      this.velocity.y * dampingFactor + averageAcceleration.y * dt;
    this.velocity.z =
      this.velocity.z * dampingFactor + averageAcceleration.z * dt;

    this.motionData = event;

    // Skip position calculation for the first two motion events
    if (
      previousVelocity.x === 0 &&
      previousVelocity.y === 0 &&
      previousVelocity.z === 0
    ) {
      return;
    }

    const averageVelocity = {
      x: (this.velocity.x + previousVelocity.x) / 2,
      y: (this.velocity.y + previousVelocity.y) / 2,
      z: (this.velocity.z + previousVelocity.z) / 2,
    };

    this.position.x += averageVelocity.x * dt;
    this.position.y += averageVelocity.y * dt;
    this.position.z += averageVelocity.z * dt;
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

      const grayscaleData = convertToGrayscale(imageData);
      this.depth = estimateDepth(grayscaleData);

      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code && this.isValidCode(code.data)) {
        this.drawQRCodeBorders(code);
        let codeWithUpdatedLocation = this.modifyQRLocationData(
          code,
          this.depth
        );
        if (!this.checkForRepeatedQRCode(codeWithUpdatedLocation)) {
          this.capturedData.push(codeWithUpdatedLocation);
        }
      }

      if (this.capturedData.length > 0) {
        const output = this.capturedData
          .map((code) => code.data + code.location.bottomLeftCorner)
          .join(', ');
        this.output = '📸 Captured data: ' + output;
      } else {
        this.output = '🔍 No QR code found';
      }
    }
    requestAnimationFrame(() => this.tick());
  }

  private isValidCode(data: string): boolean {
    if (data in BlockQRCode) {
      return true;
    }
    return false;
  }

  private modifyQRLocationData(code: QRCode, depth: number): QRCode {
    const xTranslation = (depth / this.focalLength) * this.position.x;
    const yTranslation = (depth / this.focalLength) * this.position.y;

    const updateLocation = (point: Point) => {
      point.x += xTranslation;
      point.y += yTranslation;
    };

    updateLocation(code.location.topRightCorner);
    updateLocation(code.location.bottomRightCorner);
    updateLocation(code.location.bottomLeftCorner);
    updateLocation(code.location.topLeftCorner);

    return code;
  }

  private checkForRepeatedQRCode(code: QRCode): boolean {
    for (const captured of this.capturedData) {
      const distance = this.calculateDistance(code.location, captured.location);
      if (distance < 10) {
        return true;
      }
    }
    return false;
  }

  private calculateDistance(
    qrOneLocation: QRCodeLocation,
    qrTwoLocation: QRCodeLocation
  ): number {
    const dx = qrOneLocation.topLeftCorner.x - qrTwoLocation.topLeftCorner.x;
    const dy = qrOneLocation.topLeftCorner.y - qrTwoLocation.topLeftCorner.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

enum BlockQRCode {
  MOVE_FRONT,
  MOVE_BACK,
  TURN_LEFT,
  TURN_RIGHT,
  IF,
  WHILE,
}

interface QRCodeLocation {
  topRightCorner: Point;
  topLeftCorner: Point;
  bottomRightCorner: Point;
  bottomLeftCorner: Point;
}

function convertToGrayscale(imageData: ImageData) {
  const grayscaleData = new Uint8ClampedArray(
    imageData.width * imageData.height
  );
  for (let i = 0; i < imageData.data.length; i += 4) {
    const avg =
      (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
    grayscaleData[i / 4] = avg; // Store single channel (grayscale) value
  }
  return grayscaleData;
}

function estimateDepth(grayscaleData: Uint8ClampedArray) {
  const width = Math.sqrt(grayscaleData.length); // Calculate width from array length
  const height = grayscaleData.length / width; // Calculate height from array length
  const maxDisparity = 50; // Maximum disparity to search for

  const depthMap = new Float32Array(width * height).fill(0);
  let totalDepth = 0;

  for (let y = 0; y < height; y++) {
    for (let x = maxDisparity; x < width; x++) {
      let minDiff = Number.MAX_SAFE_INTEGER;
      let bestDisparity = 0;

      for (let d = 1; d <= maxDisparity; d++) {
        const leftIdx = y * width + x;
        const rightIdx = y * width + (x - d);

        // Check bounds
        if (rightIdx >= 0) {
          // Calculate absolute difference between grayscale values
          const diff = Math.abs(
            grayscaleData[leftIdx] - grayscaleData[rightIdx]
          );

          if (diff < minDiff) {
            minDiff = diff;
            bestDisparity = d;
          }
        }
      }

      // Store disparity as depth value (inverse relationship)
      const depth = 1 / bestDisparity;
      depthMap[y * width + x] = depth;
      totalDepth += depth;
    }
  }

  const averageDepth = totalDepth / (width * height);
  return averageDepth;
}
