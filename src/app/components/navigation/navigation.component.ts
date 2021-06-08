import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskDialogComponent } from '../add-task-dialog/add-task-dialog.component';
import { TaskDBService } from 'src/app/services/taskdb.service';
import { UpdateService } from 'src/app/services/update.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private tasks: TaskDBService,
    private updates: UpdateService,
    private snackbar: MatSnackBar
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

  ngOnInit() {
    this.updates.updateAvailable$.subscribe((isUpdateAvailable) => {
      if (isUpdateAvailable === true) {
        let ref = this.snackbar.open('A new update is available!', 'Update');
        ref.onAction().subscribe(() => {
          this.updates.updates.activateUpdate().then(() => {
            document.location.reload();
          });
        });
      }
    });
  }

  ngOnDestroy() {
    if (this._inboxSub) {
      this._inboxSub.unsubscribe();
    }
  }

  openAddDialog() {
    if (this.dialog.openDialogs.length === 0) {
      this.dialog.open(AddTaskDialogComponent, {
        width: '250px',
        restoreFocus: false,
      });
    }
  }
}
