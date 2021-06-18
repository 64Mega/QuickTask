import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProjectComponent } from './components/project/project.component';
import { TaskDetailComponent } from './components/taskdetail/taskdetail.component';

const routes: Routes = [
  { path: '', redirectTo: 'category/inbox', pathMatch: 'full' },
  { path: 'category/:category', component: HomeComponent },
  { path: 'task/:id', component: TaskDetailComponent },
  { path: 'project/:id', component: ProjectComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
