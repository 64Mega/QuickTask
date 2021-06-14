import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Project } from 'src/app/models/Project';
import { Task } from 'src/app/models/Task';
import { ProjectsService } from 'src/app/services/projects.service';
import { TaskDBService } from 'src/app/services/taskdb.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit, OnDestroy {
  public tasks: Task[] = [];
  public project?: Project;
  private _routeSub?: Subscription;

  constructor(
    private activeRoute: ActivatedRoute,
    private taskService: TaskDBService,
    private projectService: ProjectsService
  ) {}

  ngOnDestroy() {
    if (this._routeSub) {
      this._routeSub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this._routeSub = this.activeRoute.params.subscribe(async (params) => {
      let project$ = await this.projectService.getById(+params.id);
      let s = project$.subscribe((project) => {
        this.project = project;
        s.unsubscribe();
      });
    });

    if (this.project?.id) {
      this.taskService.getByProjectId(this.project.id).subscribe((tasks) => {
        this.tasks = tasks;
      });
    }
  }
}
