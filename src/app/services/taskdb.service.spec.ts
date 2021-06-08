import { TestBed } from '@angular/core/testing';

import { TaskDBService } from './taskdb.service';

describe('TaskService', () => {
  let service: TaskDBService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskDBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
