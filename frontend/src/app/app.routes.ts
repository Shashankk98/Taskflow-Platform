import { Routes } from '@angular/router';
import { TaskManagerComponent } from './components/task-manager/task-manager';

export const routes: Routes = [
  { path: '', component: TaskManagerComponent },
  { path: '**', redirectTo: '' }
];