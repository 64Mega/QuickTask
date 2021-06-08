import { Injectable } from '@angular/core';
import TaskDB from '../database/TaskDB';
import {
  AsyncSubject,
  BehaviorSubject,
  from,
  of,
  ReplaySubject,
  Subject,
  Subscription,
} from 'rxjs';
import { Task } from '../models/Task';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TaskDBService {
  private _tasks: TaskDB;

  private tasks: Subject<Task[]> = new Subject<Task[]>();
  public tasks$ = this.tasks.asObservable();

  public completedTasks: Task[] = [];
  public incompleteTasks: Task[] = [];

  private _dataSub?: Subscription;

  constructor(
    private snack: MatSnackBar,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
    this._tasks = new TaskDB();
  }

  async getAll() {
    const data = of(this._tasks.GetAll());

    if (this._dataSub) {
      this._dataSub.unsubscribe();
    }

    this._dataSub = data.subscribe(async (taskPromise) => {
      let tasks = await taskPromise;
      this.completedTasks = tasks.filter((x) => x.completed);
      this.incompleteTasks = tasks.filter((x) => !x.completed);
      this.tasks.next(tasks);
    });

    return data;
  }

  save(task: Task) {
    this._tasks.Update(task);
    this.getAll();
  }

  getById(id: number) {
    const data = this._tasks.GetByID(id);
    return of(data);
  }

  getIncomplete() {
    const data = this._tasks.GetByFilter((row) => {
      return !row.completed;
    });
    return from(data);
  }

  getComplete() {
    const data = this._tasks.GetByFilter((row) => {
      return row.completed;
    });
    return from(data);
  }

  async insert(row: Task) {
    if (this.router.url === '/category/backlog') {
      if (!row.tags.includes('backlog')) {
        row.tags.push('backlog');
      }
    }

    const data = await this._tasks.Insert(row);
    this.snack.open("Added '" + row.task + "'", undefined, {
      duration: 3000,
    });

    if (this.router.url === '/category/completed') {
      this.router.navigate(['/category/inbox']);
    }

    this.getAll();
    return data;
  }

  deleteRow(row: Task) {
    const data = this._tasks.DeleteRow(row);
    this.getAll();
    return of(data);
  }

  toggleTaskCompletion(row: Task) {
    if (row.completed) {
      row.completed = !row.completed;
    } else {
      row.completed = true;
    }
    const result = this._tasks.Update(row);
    this.getAll();
    return of(result);
  }

  toggleBacklog(task: Task) {
    if (task.tags.includes('backlog')) {
      let i = task.tags.findIndex((tag) => tag === 'backlog');
      task.tags.splice(i, 1);
    } else {
      task.tags.push('backlog');
    }
    this.save(task);
  }
}
