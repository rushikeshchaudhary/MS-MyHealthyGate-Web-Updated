import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AvailabilityComponent } from '../agency-portal/users/availability/availability.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RadiologyAppointmentComponent } from './radiology-appointment/radiology-appointment.component';
import { RadiologyClientComponent } from './radiology-client/radiology-client.component';
import { RadiologyReferralComponent } from './radiology-referral/radiology-referral.component';
import { EditRadiologyProfileComponent } from './readiology-profile/edit-radiology-profile/edit-radiology-profile.component';
import { ReadiologyProfileComponent } from './readiology-profile/readiology-profile.component';
import { RadiologyClientDetailsComponent } from './radiology-client-details/radiology-client-details.component';

const routes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent
  },

  {
    path: "profile",
   component: ReadiologyProfileComponent,
  },
  {
    path: "clientprofile",
    component: RadiologyClientDetailsComponent,  
  },
  {
    path: "appointment",
    component:RadiologyAppointmentComponent,
  },
  {
    path: "mailbox",
    loadChildren: () => import('../mailing/mailing.module').then(m => m.MailingModule),
  },
  {
    path: "editprofile/:id",
    component: EditRadiologyProfileComponent,
  },
  {
    path: "scheduling",
    component:AvailabilityComponent,
  },
  {
    path: "client",
    component:RadiologyClientComponent,
  },
  {
    path: "radiologyreferral",
    component:RadiologyReferralComponent,
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RadiologyPortalRoutingModule { }
