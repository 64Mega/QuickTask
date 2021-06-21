import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ChooseProjectDialogComponent } from './choose-project-dialog.component';

describe('ChooseProjectDialogComponent', () => {
  let component: ChooseProjectDialogComponent;
  let fixture: ComponentFixture<ChooseProjectDialogComponent>;

  const mockDialogRef = {
    close: jasmine.createSpy('close'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChooseProjectDialogComponent],
      providers: [{ provide: MatDialogRef, useValue: mockDialogRef }],
      imports: [MatSelectModule, MatFormFieldModule, BrowserAnimationsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseProjectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
