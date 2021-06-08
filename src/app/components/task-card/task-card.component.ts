import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { Task } from 'src/app/models/Task';
import { TaskDBService } from 'src/app/services/taskdb.service';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
})
export class TaskCardComponent implements OnInit {
  @Input() task!: Task;
  @Input() menu!: MatMenu;
  @Output() deleteTask = new EventEmitter<Task>();
  @Output() toggleTask = new EventEmitter<Task>();
  @Output() openMenu = new EventEmitter<Task>();
  constructor(
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private tasks: TaskDBService
  ) {}

  clickDelete() {
    //this.deleteTask.emit(this.task);
    this.tasks.deleteRow(this.task);
  }

  clickToggle() {
    //this.toggleTask.emit(this.task);
    this.tasks.toggleTaskCompletion(this.task);
  }

  clickMoveToBacklog() {
    this.tasks.toggleBacklog(this.task);
  }

  @ViewChild(MatMenuTrigger) trigger?: MatMenuTrigger;

  clickMenu() {
    if (this.trigger) {
      this.trigger.openMenu();
      this.changeDetectorRef.detectChanges();
      this.openMenu.emit(this.task);
    }
  }

  clickDetails() {
    this.router.navigate(['/task/', this.task.id]);
  }

  ngOnInit(): void {}
}
