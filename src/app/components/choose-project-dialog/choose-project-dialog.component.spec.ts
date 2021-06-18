import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseProjectDialogComponent } from './choose-project-dialog.component';

describe('ChooseProjectDialogComponent', () => {
  let component: ChooseProjectDialogComponent;
  let fixture: ComponentFixture<ChooseProjectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseProjectDialogComponent ]
    })
    .compileComponents();
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
