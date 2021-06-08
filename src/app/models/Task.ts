import { DBRow } from '@64mega/localdb';

interface WorkSession {
  start_time: Date;
  end_time?: Date;
}

export class Task implements DBRow {
  id?: number;
  task: string = '';
  body: string = '';
  completed: boolean = false;
  project_id?: number;
  value: number = 0;
  blocked_by: Task[] = [];
  tags: string[] = [];
  priority: number = 0;
  due_date?: Date;
  created_at: Date = new Date(Date.now());
  modified_at?: Date;
  workRanges: WorkSession[] = [];
}
