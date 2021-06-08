import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TaskDetailComponent } from './components/taskdetail/taskdetail.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'category/:category', component: HomeComponent },
  { path: 'task/:id', component: TaskDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
