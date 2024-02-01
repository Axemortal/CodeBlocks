import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-capture',
  templateUrl: './capture.component.html',
  styleUrl: './capture.component.scss',
})
export class CaptureComponent implements OnInit {
  @Output() offCameraEvent = new EventEmitter<boolean>();
  @ViewChild('videoElement', { static: false }) videoElement:
    | ElementRef
    | undefined;
  @ViewChild('outputContainer', { static: false }) outputContainer:
    | ElementRef
    | undefined;
  videoStream: any;
  isSnapshotTaken = false;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
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
    this.isSnapshotTaken = true;
    return image;
  }

  deleteSnapshot() {
    const outputDiv: HTMLDivElement = this.outputContainer?.nativeElement;
    outputDiv.innerHTML = '';
    this.isSnapshotTaken = false;
  }

  offCamera() {
    this.videoStream.getTracks().forEach((track: any) => {
      track.stop();
    });
    this.offCameraEvent.emit(false);
  }
}
