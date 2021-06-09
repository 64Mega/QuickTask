import Dexie from 'dexie';
import { Task } from '../models/Task';

class QuicktaskDatabase extends Dexie {
  tasks: Dexie.Table<Task, number>;

  constructor() {
    super('QuicktaskDatabase');
    this.version(1).stores({
      tasks: '++id, task, completed',
    });

    this.tasks = this.table('tasks');
  }
}

export default QuicktaskDatabase;
