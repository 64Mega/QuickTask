import { DBTable, LocalDB } from 'localdb';
import { Task } from '../models/Task';

class TaskDB extends DBTable<Task> {
  constructor() {
    super('tasks');
  }
}

export default TaskDB;
