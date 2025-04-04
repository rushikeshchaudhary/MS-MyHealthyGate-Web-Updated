import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgencyPermissionGuard } from '../agency_routing_permission.guard';
import { MyAppointmentsComponent } from './my-appointment/my-appointments.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AgencyPermissionGuard],
    component: MyAppointmentsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyAppointmentsRoutingModule { }
