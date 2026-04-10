import { TestBed } from '@angular/core/testing';

import { OilServiceService } from './oil-service.service';

describe('OilServiceService', () => {
  let service: OilServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OilServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
