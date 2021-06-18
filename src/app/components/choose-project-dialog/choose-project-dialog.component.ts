import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Project } from 'src/app/models/Project';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-choose-project-dialog',
  templateUrl: './choose-project-dialog.component.html',
  styleUrls: ['./choose-project-dialog.component.scss'],
})
export class ChooseProjectDialogComponent implements OnInit {
  selectedProject?: Project;

  constructor(
    public projects: ProjectsService,
    private dialogRef: MatDialogRef<ChooseProjectDialogComponent>
  ) {}

  ngOnInit() {
    this.projects.getAll();
  }

  clickClose() {
    this.dialogRef.close(null);
  }

  selectProject() {
    this.dialogRef.close(this.selectedProject);
  }
}
