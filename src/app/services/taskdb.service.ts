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
/**
 * Injectable service that manages CRUD operations for Tasks.
 */
@Injectable({
  providedIn: 'root',
})
export class TaskDBService {
  private tasks: Subject<Task[]> = new Subject<Task[]>();
  private _dataSub?: Subscription;
  private db = new QuicktaskDatabase();

  public tasks$ = this.tasks.asObservable();
  public completedTasks: Task[] = [];
  public incompleteTasks: Task[] = [];

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

  /**
   * Fetches data from the database, subscribes to the result and
   * refreshes service-local properties on update.
   *
   * Instead of subscribing to the return value of this method,
   * rather subscribe to the `tasks$` property.
   *
   * @returns Promise<Observable<Task[]>>
   */
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

  /**
   * Saves (Updates) a row.
   * @param task : Task - row to update (row.id must be set for this to work)
   */
  async save(task: Task) {
    //this._tasks.Update(task);
    await this.db.tasks.put(task, task.id);
    this.getAll();
  }

  /**
   * Get specific Task by id.
   *
   * @param id
   * @returns Returns a task or undefined if not found.
   */
  getById(id: number) {
    const data = this.db.tasks.get(id);
    return from(data);
  }

  /**
   * Get an array of completed tasks.
   * @deprecated
   * Subscribe to $tasks instead and filter where necessary.
   * @returns Array of completed tasks
   */
  getIncomplete() {
    const data = this.db.tasks.where({ completed: false }).toArray();
    return from(data);
  }

  /**
   * Get an array of incomplete tasks.
   * @deprecated
   * Subscribe to $tasks instead and filter where necessary.
   * @returns Array of incomplete tasks
   */
  getComplete() {
    const data = this.db.tasks.where({ completed: true }).toArray();
    return from(data);
  }

  /**
   * Adds a new row to the database.
   * @param row Row data of type Task
   * @returns
   */
  async insert(row: Task) {
    /// FIXME: Find a better way to do this context-based add.
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

    /// FIXME: Find a better way to handle this.
    if (this.router.url === '/category/completed') {
      this.router.navigate(['/category/inbox']);
    }

    this.getAll();
    return of(data);
  }

  /**
   * Deletes a row from the database.
   * @param row Row with id set
   * @returns
   */
  async deleteRow(row: Task) {
    if (row.id) await this.db.tasks.delete(row.id);
    this.getAll();
    return of(true);
  }

  /**
   * Toggle the completed property of a task, save it to the database
   * and reload data to trigger updates.
   * @param row
   * @returns
   */
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

  /**
   * Toggle backlog tag on a task and refresh data to trigger updates.
   * @param task
   */
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
