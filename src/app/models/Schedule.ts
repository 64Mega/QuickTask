import { DBRow } from '@64mega/localdb';
import { Task } from './Task';

export class Schedule implements DBRow {
  id?: number;
  task: Task = new Task();
  next?: Date;
  interval: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'daily';
}
