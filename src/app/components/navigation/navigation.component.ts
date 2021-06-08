import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskDialogComponent } from '../add-task-dialog/add-task-dialog.component';
import { TaskDBService } from 'src/app/services/taskdb.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent
  implements OnInit, OnDestroy, AfterContentInit {
  inboxNum: number = 0;
  completeNum: number = 0;
  backlogNum: number = 0;
  private _inboxSub?: Subscription;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private tasks: TaskDBService
  ) {}

  ngAfterContentInit() {
    this._inboxSub = this.tasks.tasks$.subscribe((tasks) => {
      this.inboxNum = tasks.filter(
        (x) => !x.completed && !x.tags.includes('backlog')
      ).length;
      this.completeNum = tasks.filter((x) => x.completed).length;
      this.backlogNum = tasks.filter(
        (x) => !x.completed && x.tags.includes('backlog')
      ).length;
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this._inboxSub) {
      this._inboxSub.unsubscribe();
    }
  }

  openAddDialog() {
    this.dialog.open(AddTaskDialogComponent, {
      width: '250px',
    });
  }
}
