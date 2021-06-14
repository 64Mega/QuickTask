import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Project } from 'src/app/models/Project';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-add-project-dialog',
  templateUrl: './add-project-dialog.component.html',
  styleUrls: ['./add-project-dialog.component.scss'],
})
export class AddProjectDialogComponent {
  public projectName: string = '';

  constructor(
    private dialogRef: MatDialogRef<AddProjectDialogComponent>,
    private projects: ProjectsService
  ) {}

  addProject() {
    if (this.projectName.length > 0) {
      const project = new Project();
      project.name = this.projectName;
      project.body = '';
      this.projects.insert(project);
      this.dialogRef.close();
    }
  }

  clickClose() {
    this.dialogRef.close();
  }
}
