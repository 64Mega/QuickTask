import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AppComponent } from './app.component';
import { LinkComponent } from './components/link/link.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import AppRoutes from './config/AppRoutes';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(AppRoutes),
        MatDialogModule,
        MatSnackBarModule,
        MatSidenavModule,
        MatToolbarModule,
        BrowserAnimationsModule,
        MatIconModule,
        MatListModule,
        MatDividerModule,
        ServiceWorkerModule.register('', { enabled: false }),
      ],
      declarations: [AppComponent, NavigationComponent, LinkComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
