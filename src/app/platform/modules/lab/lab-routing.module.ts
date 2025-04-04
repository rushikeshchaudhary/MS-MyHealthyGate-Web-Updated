import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AvailabilityComponent } from "../agency-portal/users/availability/availability.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { LabAppointmentsComponent } from "./lab-appointments/lab-appointments.component";
import { LabClientsComponent } from "./lab-clients/lab-clients.component";
import { LabDocumentComponent } from "./lab-document/lab-document.component";
import { EditLabProfileComponent } from "./lab-profile/edit-lab-profile/edit-lab-profile.component";
import { LabAvaibilityComponent } from "./lab-profile/edit-lab-profile/lab-avaibility/lab-avaibility.component";
import { LabProfileComponent } from "./lab-profile/lab-profile.component";
import { LabSchedulingComponent } from "./lab-scheduling/lab-scheduling.component";
import { LabWaitingRoomComponent } from "./lab-waiting-room/lab-waiting-room.component";
import { LabClientsDetailsComponent } from "./lab-clients/lab-clients-details/lab-clients-details.component";

const routes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent,
  },
  // {
  //   path: "scheduling",
  //   loadChildren: "../scheduling/scheduling.module#SchedulingModule",
  // },
  {
    path: "scheduling",
    component:AvailabilityComponent,
  },
  {
    path: "lab-document",
    component: LabDocumentComponent,
  },

  {
    path: "client",
    component: LabClientsComponent,
  },
  {
    path: "payment",
    loadChildren:() => import('./lab-payment/lab-payment.module').then(m => m.LabPaymentModule),

  },
  {
    path: "appointment",
    component: LabAppointmentsComponent
  },
 

  {
    path: "waitingroom/:id",
    component: LabWaitingRoomComponent,
  },
  {
    path: "availability",
    component: LabAvaibilityComponent,
  },
  {
    path: "profile",
    component: LabProfileComponent,
  },
  {
    path: "mailbox",
    loadChildren: () => import('../mailing/mailing.module').then(m => m.MailingModule),
  },
  {
    path: "editprofile/:id",
    component: EditLabProfileComponent,
  },
  {
    path: "labclientsdetails",
    component: LabClientsDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LabRoutingModule {}
