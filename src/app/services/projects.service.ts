import { Injectable } from '@angular/core';
import { from, of, Subject, Subscription } from 'rxjs';
import QuicktaskDatabase from '../database/DB';
import { Project } from '../models/Project';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private projects: Subject<Project[]> = new Subject<Project[]>();
  private _dataSub?: Subscription;
  private db = new QuicktaskDatabase();

  public projects$ = this.projects.asObservable();

  constructor() {}

  async getAll() {
    const data = of(await this.db.projects.toArray());

    this._dataSub?.unsubscribe();

    this._dataSub = data.subscribe(async (projectPromise) => {
      let projects = await projectPromise;
      this.projects.next(projects);
    });

    return data;
  }

  async save(project: Project) {
    await this.db.projects.put(project, project.id);
    this.getAll();
  }

  getById(id: number) {
    const data = this.db.projects.get(id);
    return from(data);
  }

  async insert(row: Project) {
    const key = await this.db.projects.put(row);
    const data = await this.db.projects.get(key);
    this.getAll();
    return of(data);
  }

  async deleteRow(row: Project) {
    if (row.id) await this.db.tasks.delete(row.id);
    this.getAll();
  }
}
