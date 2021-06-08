import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from 'src/app/models/Task';
import { TaskDBService } from 'src/app/services/taskdb.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './taskdetail.component.html',
  styleUrls: ['./taskdetail.component.scss'],
})
export class TaskDetailComponent implements OnInit, OnDestroy {
  public id?: number;
  private sub: any;
  public task!: Task;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tasks: TaskDBService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(async (params) => {
      this.id = +params['id'];
      this.tasks.getById(this.id).subscribe((res) => (this.task = res));
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  async deleteTask() {
    await (await this.tasks.deleteRow(this.task)).subscribe((res) => {
      if (res === true) {
        this.snackBar.open('Deleted task.', undefined, {
          duration: 2 * 1000,
        });
        this.router.navigate(['/']);
      } else {
        this.snackBar.open("Couldn't delete task!");
      }
    });
  }
}
