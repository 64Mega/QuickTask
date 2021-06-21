import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Project } from 'src/app/models/Project';
import { Task } from 'src/app/models/Task';
import { ProjectsService } from 'src/app/services/projects.service';
import { TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit, OnDestroy {
  public tasks: Task[] = [];
  public project?: Project;
  private _routeSub?: Subscription;
  private _taskSub?: Subscription;

  constructor(
    private activeRoute: ActivatedRoute,
    private taskService: TasksService,
    private projectService: ProjectsService
  ) {}

  ngOnDestroy() {
    this._routeSub?.unsubscribe();
    this._taskSub?.unsubscribe();
  }

  subToTasks() {
    this._taskSub?.unsubscribe();

    if (this.project?.id) {
      this._taskSub = this.taskService
        .getByProjectId(this.project.id)
        .subscribe((tasks) => {
          this.tasks = tasks;
        });
    }
  }

  ngOnInit(): void {
    this._routeSub = this.activeRoute.params.subscribe(async (params) => {
      let project = await this.projectService.getById(+params.id);
      this.project = project;
      this.subToTasks();
    });

    this.subToTasks();
  }
}
