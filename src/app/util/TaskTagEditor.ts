import { Task } from '../models/Task';

export default class TaskTagEditor {
  constructor(private task: Task) {}

  public set(tag: string): void {
    if (!this.has(tag)) {
      this.task.tags.push(tag);
    }
  }

  public clear(tag: string): void {
    if (this.has(tag)) {
      const index = this.task.tags.indexOf(tag);
      this.task.tags.splice(index, 1);
    }
  }

  public toggle(tag: string): void {
    if (this.has(tag)) {
      this.clear(tag);
    } else {
      this.set(tag);
    }
  }

  public has(tag: string): boolean {
    return this.task.tags.includes(tag);
  }
}
