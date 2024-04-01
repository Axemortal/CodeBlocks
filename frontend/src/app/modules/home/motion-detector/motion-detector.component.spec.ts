import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotionDetectorComponent } from './motion-detector.component';

describe('MotionDetectorComponent', () => {
  let component: MotionDetectorComponent;
  let fixture: ComponentFixture<MotionDetectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MotionDetectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MotionDetectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
