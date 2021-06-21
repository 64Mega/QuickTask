import { TestBed } from '@angular/core/testing';
import { SwUpdate } from '@angular/service-worker';

import { UpdateService } from './update.service';

describe('UpdateService', () => {
  let service: UpdateService;

  const mockSWUpdate = {
    available: {
      subscribe: jasmine.createSpy('subscribe'),
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: SwUpdate, useValue: mockSWUpdate }],
    });
    service = TestBed.inject(UpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
