import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  @ViewChild('videoElement', { static: false }) videoElement:
    | ElementRef
    | undefined;
  @ViewChild('outputContainer', { static: false }) outputContainer:
    | ElementRef
    | undefined;
  isSupported = false;
  videoStream: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isSupported = 'mediaDevices' in window.navigator;
      const mediaConstraints = {
        video: true,
      };

      window.navigator.mediaDevices
        .getUserMedia(mediaConstraints)
        .then((stream) => {
          this.videoStream = stream;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  captureSnapshot() {
    const video = this.videoElement?.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas
      ?.getContext('2d')
      ?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    const image = canvas.toDataURL('image/png');
    const outputDiv: HTMLDivElement = this.outputContainer?.nativeElement;
    this.renderer.appendChild(outputDiv, canvas);
    console.log('t');
    return image;
  }

  async requestMediaDevices() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      // Use the stream for your application logic
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  }
}
