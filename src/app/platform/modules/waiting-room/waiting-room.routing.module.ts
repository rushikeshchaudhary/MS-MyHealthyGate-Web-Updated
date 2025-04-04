import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EncounterComponent } from "../agency-portal/clients/encounter/encounter.component";
import { MedicationComponent } from "../agency-portal/clients/medication/medication.component";
import { PrescriptionComponent } from "../agency-portal/clients/prescription/prescription.component";
import { SoapNoteComponent } from "../agency-portal/clients/soap-note/soap-note.component";
import { SoapComponent } from "../agency-portal/encounter/soap/soap.component";
import { VideoCallComponent } from "../agency-portal/encounter/video-call/video-call.component";
import { SchedulerComponent } from "../scheduling/scheduler/scheduler.component";
import { AssessmentAppointmentComponent } from "./assessment-appointment/assessment-appointment.component";
import { CheckInCallComponent } from "./check-in/check-in-call.component";
import { PatientDocumentsComponent } from "./patient-documents/patient-documents.component";
import { PermissionComponent } from "./permission/permission.component";
import { VitalsListComponent } from "./vitals-list/vitals-list.component";
import { WaitingRoomContainerComponent } from "./waiting-room-container.component";

const routes: Routes = [
  {
    path: "",
    component: WaitingRoomContainerComponent,
    children: [
      {
        path: "reshedule/:id",
        component: SchedulerComponent,
      },
      {
        path: "permission/:id",
        component: PermissionComponent,
      },
      {
        path: "assessment/:id",
        component: AssessmentAppointmentComponent,
      },
      {
        path: "documents/:id",
        component: PatientDocumentsComponent,
      },
      {
        path: "vitalslist/:id",
        component: VitalsListComponent,
      },
      {
        path: "medication/:id",
        component: MedicationComponent,
      },
      {
        path: "doctornotes/:id",
        component: SoapNoteComponent,
      },
      {
        path: "e-prescription/:id",
        component: PrescriptionComponent,
      },
      {
        path: "check-in/:id",
        component: CheckInCallComponent,
      },
      {
        path: "check-in-soap/:id",
        component: SoapComponent,
      },
      {
        path: "check-in-call/:id",
        component: CheckInCallComponent,
      },
      {
        path: "check-in-video-call/:id",
        component: VideoCallComponent,
      },
      {
        path: "past-appointment/:id",
        component: EncounterComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaitingRoomRoutingModule { }
