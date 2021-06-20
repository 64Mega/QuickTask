import { Injectable } from '@angular/core';
import TaskDB from '../database/TaskDB';
import { from, of, Subject, Subscription } from 'rxjs';
import { Task } from '../models/Task';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import QuicktaskDatabase from '../database/DB';
import TaskTagEditor from '../util/TaskTagEditor';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private tasks: Subject<Task[]> = new Subject<Task[]>();
  private _dataSub?: Subscription;
  private db = new QuicktaskDatabase();

  public tasks$ = this.tasks.asObservable();

  private migrateLocalStorage(): void {
    const db = new TaskDB();
    const oldTasks = db.GetAll();

    for (let task of oldTasks) {
      this.removeTaskID(task);
      this.insert(task);
    }

    this.deleteLocalStorage();
  }

  private removeTaskID(task: Task): number | undefined {
    let tmp_id = task.id;
    delete task.id;
    return tmp_id;
  }

  private deleteLocalStorage(): void {
    localStorage.removeItem('tasks');
  }

  private hasExistingLocalStorage(): boolean {
    return localStorage.getItem('tasks') !== undefined;
  }

  constructor(private snack: MatSnackBar, private router: Router) {
    if (this.hasExistingLocalStorage()) {
      this.migrateLocalStorage();
    }
  }

  async getAll() {
    const data = of(await this.db.tasks.toArray());

    this._dataSub?.unsubscribe();

    this._dataSub = data.subscribe(async (taskPromise) => {
      let tasks = await taskPromise;
      this.tasks.next(tasks);
    });
  }

  async update(task: Task) {
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

  getByProjectId(projectId: number) {
    const data = this.db.tasks.where({ project_id: projectId }).toArray();
    return from(data);
  }

  getComplete() {
    const data = this.db.tasks.where({ completed: true }).toArray();
    return from(data);
  }

  private notifyOfTaskAdded(task?: Task) {
    if (task) {
      this.snack.open(`Added '${task.task}'`, 'OK', { duration: 3000 });
    } else {
      throw new Error('Task not set.');
    }
  }

  private async insertAndReturnTask(task: Task): Promise<Task | undefined> {
    const key = await this.db.tasks.put(task);
    return await this.db.tasks.get(key);
  }

  private tagIfOnBacklogView(task: Task) {
    if (this.isOnRoute('/category/backlog')) {
      const tagEditor = new TaskTagEditor(task);
      tagEditor.set('backlog');
      this.update(task);
    }
  }

  async insert(task: Task) {
    this.tagIfOnBacklogView(task);

    try {
      const data = await this.insertAndReturnTask(task);
      this.notifyOfTaskAdded(data);

      if (this.isOnRoute('/category/completed')) {
        this.goToRoute('/category/inbox');
      }

      this.getAll();
    } catch (err) {
      console.error('Error adding new task.');
      console.error(task);
      console.error(err);
    }
  }

  private goToRoute(path: string) {
    this.router.navigate([path]);
  }

  private isOnRoute(route: string) {
    return this.router.url === route;
  }

  async deleteRow(row: Task) {
    if (row.id) await this.db.tasks.delete(row.id);
    this.getAll();
    return of(true);
  }

  async toggleTaskCompletion(row: Task) {
    row.completed = !row.completed;
    const result = await this.update(row);
    this.getAll();
    return of(result);
  }

  async toggleBacklog(task: Task) {
    const tagEditor = new TaskTagEditor(task);
    tagEditor.toggle('backlog');
    await this.update(task);
    this.getAll();
  }
}
