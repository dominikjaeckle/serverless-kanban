import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoardComponent } from './board/board.component';
import { BoardsComponent } from './boards/boards.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_guard/auth-guard.guard';

const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },

  // { path: '', component: BoardsComponent, outlet: 'boardSelection', canActivate: [AuthGuard] },
  { path: 'boards', component: BoardsComponent, outlet: 'boardSelection', canActivate: [AuthGuard] },
  { path: 'board', component: BoardComponent, outlet: 'boardSelection', canActivate: [AuthGuard] },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
