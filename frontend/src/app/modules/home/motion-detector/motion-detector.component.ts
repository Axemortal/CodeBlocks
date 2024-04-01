import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-motion-detector',
  templateUrl: './motion-detector.component.html',
  styleUrl: './motion-detector.component.scss',
})
export class MotionDetectorComponent implements AfterViewInit {
  position: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
  velocity: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
  depth: number = 0;
  motionData: DeviceMotionEvent | undefined;

  ngAfterViewInit(): void {
    this.setupMotionDetection();
  }

  private setupMotionDetection(): void {
    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', this.handleMotion.bind(this));
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
}
