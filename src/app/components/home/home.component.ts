import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

import { TaskDBService } from 'src/app/services/taskdb.service';
import { Task } from '../../models/Task';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  completedTasks: Task[] = [];
  taskBody: string = '';
  viewing: 'inbox' | 'completed' | 'backlog' = 'inbox';
  viewTitle: string = 'Inbox';
  _logicClock = 0;

  private _taskSub?: Subscription;
  private _activeRouteSub?: Subscription;

  constructor(
    public taskService: TaskDBService,
    private changeDetectorRef: ChangeDetectorRef,
    private activeRoute: ActivatedRoute
  ) {
    //this.changeDetectorRef.detach();
  }

  @ViewChild(MatMenuTrigger) trigger?: MatMenuTrigger;

  showMenu(task: Task) {
    console.dir(task);
  }

  ngOnDestroy() {
    if (this._taskSub) this._taskSub.unsubscribe();
    if (this._activeRouteSub) this._activeRouteSub.unsubscribe();
  }

  async ngOnInit() {
    this._taskSub = this.taskService.tasks$
      .pipe(delay(50))
      .subscribe(async (newTasks) => {
        let res = await newTasks;
        if (res) {
          this.tasks = res.filter((t) => {
            switch (this.viewing) {
              case 'inbox':
                return !t.completed && !t.tags.includes('backlog');
              case 'completed':
                return t.completed;
              case 'backlog':
                return !t.completed && t.tags.includes('backlog');
            }
          });
        }

        //this.changeDetectorRef.detectChanges();
      });

    this._activeRouteSub = this.activeRoute.params.subscribe((params) => {
      this.viewing = params.category;
      switch (this.viewing) {
        case 'inbox':
          this.viewTitle = 'Inbox';
          break;
        case 'completed':
          this.viewTitle = 'Completed Tasks';
          break;
        case 'backlog':
          this.viewTitle = 'Backlog';
          break;
      }
      this.taskService.getAll();
      //this.changeDetectorRef.detectChanges();
    });

    this.refreshData();
  }

  async refreshData() {
    this.taskService.getAll();
  }

  async removeTask(task: Task) {
    this.taskService.deleteRow(task);
  }

  async toggleTask(task: Task) {
    this.taskService.toggleTaskCompletion(task);
  }

  toggleBacklog(task: Task) {
    this.taskService.toggleBacklog(task);
  }

  async addTask() {
    const task = new Task();
    task.body = this.taskBody;
    const data = await this.taskService.insert(task);
    this.refreshData();
  }
}
