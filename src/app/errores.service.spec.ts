import { TestBed } from '@angular/core/testing';

import { ErroresService } from './errores.service';

describe('ErroresService', () => {
  let service: ErroresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErroresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
