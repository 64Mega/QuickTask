import { Overlay } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TasksService } from './tasks.service';

import { RouterTestingModule } from '@angular/router/testing';
import AppRoutes from '../config/AppRoutes';
import { LocationStrategy } from '@angular/common';
import { MockLocationStrategy } from '@angular/common/testing';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MatSnackBar,
        Overlay,
        { provide: LocationStrategy, useClass: MockLocationStrategy },
      ],
      imports: [RouterTestingModule.withRoutes(AppRoutes)],
    });
    service = TestBed.inject(TasksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
