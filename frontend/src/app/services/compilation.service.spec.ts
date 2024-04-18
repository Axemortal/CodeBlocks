import { TestBed } from '@angular/core/testing';

import { CompilationService } from './compilation.service';

describe('CompilationService', () => {
  let service: CompilationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompilationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
