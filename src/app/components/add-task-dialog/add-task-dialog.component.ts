import { Component, NgZone, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Task } from 'src/app/models/Task';
import { TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-add-task-dialog',
  templateUrl: './add-task-dialog.component.html',
  styleUrls: ['./add-task-dialog.component.scss'],
})
export class AddTaskDialogComponent {
  public taskShort: string = '';
  constructor(
    private dialogRef: MatDialogRef<AddTaskDialogComponent>,
    private tasks: TasksService,
    private zone: NgZone
  ) {}

  addTask() {
    if (this.taskShort.length > 0) {
      const task = new Task();
      task.body = this.taskShort;
      task.task = this.taskShort;
      this.tasks.insert(task);

      this.tasks.getAll();
      this.dialogRef.close();
    }
  }

  clickClose() {
    this.dialogRef.close();
  }
}
