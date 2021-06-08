import { DBTable, LocalDB } from '@64mega/localdb';
import { Task } from '../models/Task';

class TaskDB extends DBTable<Task> {
  constructor() {
    super('tasks');
  }
}

export default TaskDB;
