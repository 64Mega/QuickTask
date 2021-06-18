import Dexie from 'dexie';
import { Project } from '../models/Project';
import { Task } from '../models/Task';

class QuicktaskDatabase extends Dexie {
  tasks: Dexie.Table<Task, number>;
  projects: Dexie.Table<Project, number>;

  constructor() {
    super('QuicktaskDatabase');
    this.version(4).stores({
      tasks: '++id, task, completed, project_id',
      projects: '++id, name',
    });

    this.tasks = this.table('tasks');
    this.projects = this.table('projects');
  }
}

export default QuicktaskDatabase;
