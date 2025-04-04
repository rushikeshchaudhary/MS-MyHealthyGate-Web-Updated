import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PharmacyDashboardComponent } from "./pharmacy-dashboard/pharmacy-dashboard.component";
import { PharmacyMyClientComponent } from "./pharmacy-my-client/pharmacy-my-client.component";
import { EditPharmacyProfileComponent } from "./pharmacy-profile/edit-pharmacy-profile/edit-pharmacy-profile.component";
import { PharmacyProfileComponent } from "./pharmacy-profile/pharmacy-profile.component";
import { SharedPrescriptionComponent } from "./shared-prescription/shared-prescription.component";
import { PharmacyClientDetailsComponent } from "./pharmacy-my-client/pharmacy-client-details/pharmacy-client-details.component";

const routes: Routes = [
  {
    path: "shared-prescription",
    component: SharedPrescriptionComponent,
  },
  {
    path: "dashboard",
    component: PharmacyDashboardComponent,
  },
  {
    path: "scheduling",
    loadChildren: () => import('../scheduling/scheduling.module').then(m => m.SchedulingModule),
  },
  {
    path: "mailbox",
    loadChildren: () => import('../mailing/mailing.module').then(m => m.MailingModule),
  },
  {
    path: "my-profile",
    component: PharmacyProfileComponent,
  },
  {
    path: "editprofile/:id",
    component: EditPharmacyProfileComponent
  },
  {
    path: "my-client",
    component: PharmacyMyClientComponent
  },
  {
    path: "client-details",
    component: PharmacyClientDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PharmacyPortalRoutingModule {}
