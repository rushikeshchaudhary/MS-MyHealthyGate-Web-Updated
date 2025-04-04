import { SharedModule } from "./../../../../shared/shared.module";
import { DiagnosisService } from "./diagnosis/diagnosis.service";
//import { DiagnosisModalComponent } from "./../clients/diagnosis/diagnosis-modal/diagnosis-modal.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SoapComponent } from "./soap/soap.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { EncounterRoutingModule } from "./encounter-routing.module";
import { EncounterService } from "./encounter.service";
import { SignaturePad } from "angular2-signaturepad";
import { SignDialogComponent } from "./sign-dialog/sign-dialog.component";
import { NonBillableSoapComponent } from "./non-billable-soap/non-billable-soap.component";
import { VideoChatComponent } from "./video-chat/video-chat.component";
import { PublisherComponent } from "./video-chat/publisher/publisher.component";
import { SubscriberComponent } from "./video-chat/subscriber/subscriber.component";
import { VideoCallComponent } from "./video-call/video-call.component";
import { FormioModule } from '@formio/angular';
import { TemplateFormComponent } from "./template-form/template-form.component";
import { ResizableModule } from "angular-resizable-element";
import { DragAndDropModule } from "angular-draggable-droppable";
//import { SocketIoModule, SocketIoConfig } from "ngx-socket-io";
//import { MeanVideoComponent } from "src/app/platform/modules/agency-portal/encounter/mean-video/mean-video.component";
//import { ChatService } from "src/app/platform/modules/agency-portal/encounter/mean-video/chat.service";
import { ScrollbarModule } from 'ngx-scrollbar';
import { DiagnosisModalComponent } from "./diagnosis/diagnosis-modal/diagnosis-modal.component";
import { AddServiceCodeModalComponent } from "src/app/platform/modules/agency-portal/encounter/service-code-modal/add-service-code-modal.component";
import { ThankYouComponent } from "./thank-you/thank-you.component";
import { VideoButtonComponent } from './video-chat/video-button/video-button.component';
import { PatientEncounterNotesModalComponent } from "./patientencounternotes-modal/patientencounternotes.component";
import { ClientsModule } from "../clients/clients.module";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { VideoCallInvitationComponent } from './video-call-invitation/video-call-invitation.component';
//import { DiagnosisModelComponent } from "./diagnosis/diagnosis-model/diagnosis-model.component";
// const config: SocketIoConfig = {
//   url: "https://turn.stagingsdei.com:5187",
//   options: {}
// };
//import { DndModule } from 'ngx-drag-drop';
@NgModule({
  imports: [
    CommonModule,
    FormioModule,
    EncounterRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatDialogModule,
    MatMenuModule,
    MatIconModule,
    ClientsModule,
    // SignaturePad,
    MatDatepickerModule,
    ResizableModule,
    DragAndDropModule,
    //SocketIoModule.forRoot(config),
    ScrollbarModule,
    // DndModule,
    SharedModule,
    MatCardModule,
    AngularEditorModule,
  ],
  declarations: [
    SoapComponent,
    SignDialogComponent,
    NonBillableSoapComponent,
    VideoChatComponent,
    PublisherComponent,
    SubscriberComponent,
    VideoCallComponent,
    TemplateFormComponent,
    DiagnosisModalComponent,
    AddServiceCodeModalComponent,
    ThankYouComponent,
    VideoButtonComponent,
    //MeanVideoComponent,
    PatientEncounterNotesModalComponent,
    VideoCallInvitationComponent
  ],
  providers: [
    EncounterService,
    DiagnosisService,
    //ChatService,

    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        disableClose: true,
        minWidth: "55%",
        maxWidth: "90%"
      }
    }
  ],
  // entryComponents: [
  //   SignDialogComponent,
  //   TemplateFormComponent,
  //   DiagnosisModalComponent,
  //   AddServiceCodeModalComponent,
  //   PatientEncounterNotesModalComponent,
  //   VideoCallInvitationComponent
  // ],
  exports: [PublisherComponent, SubscriberComponent, SoapComponent,
    SignDialogComponent,
    NonBillableSoapComponent,VideoCallComponent,
    TemplateFormComponent,
    DiagnosisModalComponent,
    AddServiceCodeModalComponent,
    ThankYouComponent,
    VideoButtonComponent,
    //MeanVideoComponent,
    PatientEncounterNotesModalComponent]
})
export class EncounterModule {}
