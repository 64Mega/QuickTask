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
import QuicktaskDatabase from '../database/DB';
@Injectable({
  providedIn: 'root',
})
export class TaskDBService {
  private tasks: Subject<Task[]> = new Subject<Task[]>();
  public tasks$ = this.tasks.asObservable();

  public completedTasks: Task[] = [];
  public incompleteTasks: Task[] = [];

  private _dataSub?: Subscription;

  private db = new QuicktaskDatabase();

  constructor(
    private snack: MatSnackBar,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
    // This bit of code checks for residual data in LocalDB and moves
    // it to Dexie.
    if (localStorage.getItem('tasks')) {
      const _tasks = new TaskDB();

      const tasks = _tasks.GetAll();
      tasks.forEach((task) => {
        let id = task.id;
        delete task.id;
        this.db.tasks.put(task);
        if (id) _tasks.DeleteById(id);
      });

      localStorage.removeItem('tasks');
    }
  }

  async getAll() {
    //const data = of(this._tasks.GetAll());
    const data = of(await this.db.tasks.toArray());

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

  async save(task: Task) {
    //this._tasks.Update(task);
    await this.db.tasks.put(task, task.id);
    this.getAll();
  }

  getById(id: number) {
    const data = this.db.tasks.get(id);
    return from(data);
  }

  getIncomplete() {
    const data = this.db.tasks.where({ completed: false }).toArray();
    return from(data);
  }

  getComplete() {
    const data = this.db.tasks.where({ completed: true }).toArray();
    return from(data);
  }

  async insert(row: Task) {
    if (this.router.url === '/category/backlog') {
      if (!row.tags.includes('backlog')) {
        row.tags.push('backlog');
      }
    }

    const key = await this.db.tasks.put(row);
    const data = await this.db.tasks.get(key);

    this.snack.open("Added '" + row.task + "'", undefined, {
      duration: 3000,
    });

    if (this.router.url === '/category/completed') {
      this.router.navigate(['/category/inbox']);
    }

    this.getAll();
    return of(data);
  }

  async deleteRow(row: Task) {
    if (row.id) await this.db.tasks.delete(row.id);
    this.getAll();
    return of(true);
  }

  async toggleTaskCompletion(row: Task) {
    if (row.completed) {
      row.completed = !row.completed;
    } else {
      row.completed = true;
    }
    const result = await this.save(row);
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
