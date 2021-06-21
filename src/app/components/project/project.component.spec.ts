import { Overlay } from '@angular/cdk/overlay';
import { LocationStrategy } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import AppRoutes from 'src/app/config/AppRoutes';

import { ProjectComponent } from './project.component';
import { MockLocationStrategy } from '@angular/common/testing';
import { MatDividerModule } from '@angular/material/divider';

describe('ProjectComponent', () => {
  let component: ProjectComponent;
  let fixture: ComponentFixture<ProjectComponent>;

  const mockActivatedRoute = {
    params: { subscribe: jasmine.createSpy('subscribe') },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: LocationStrategy, useClass: MockLocationStrategy },
        MatSnackBar,
        Overlay,
      ],
      imports: [RouterTestingModule.withRoutes(AppRoutes), MatDividerModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
