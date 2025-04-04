//import { TextChatService } from "./text-chat/text-chat.service";
//import { SubscriberComponent } from "./../platform/modules/agency-portal/encounter/video-chat/subscriber/subscriber.component";
//import { PublisherComponent } from "src/app/platform/modules/agency-portal/encounter/video-chat/publisher/publisher.component";
import { DataTableComponent } from "./data-table/data-table.component";

import { RegisterModelComponent } from "./register-model/register.component";
import { AgencyLoginModelComponent } from "src/app/shared/login-model/agency-login/agency-login.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent, FooterComponent, SidebarComponent } from "./layout";
import { SharedService } from "./shared.service";
import { StaffAppointmentComponent } from "./staff-appointment/staff-appointment.component";
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatNativeDateModule } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CancelAppointmentDialogComponent as cancelAppointmentComponent } from "./../platform/modules/scheduling/scheduler/cancel-appointment-dialog/cancel-appointment-dialog.component";
import { AppointmentViewComponent } from "./../platform/modules/scheduling/appointment-view/appointment-view.component";
import { ContextMenuModule } from "ngx-contextmenu";
//<!-- intentionally commented code for running the application -->
// import { MatDatetimepickerModule } from '@mat-datetimepicker/core';
// import { MatNativeDatetimeModule } from '@mat-datetimepicker/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

// import { TooltipModule } from 'ng2-tooltip-directive';
import { SymptomCheckerService } from "./symptom-checker/symptom-checker.service";
import { ViewReportService } from "./view-report/view-report.service";
import { MatVideoModule } from "mat-video";
import { CallNotificationComponent } from "./call-notification/call-notification.component";
import { MailboxService } from "./../platform/modules/mailing/mailbox.service";
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MenuListItemComponent } from "./layout/menu-list-item/menu-list-item.component";
import { DialogComponent } from "./layout/dialog/dialog.component";
import { NumbersOnlyDirective } from "./directives/numbers-only.directive";
import { DialogService } from "./layout/dialog/dialog.service";
import { StatusPipe } from "./pipes/status.pipe";
import { PhoneNumberDirective } from "./directives/phone-number.directive";
import { SsnDirective } from "./directives/ssn.directive";
import { ZipcodeDirective } from "./directives/zipcode.directive";
import { RateDirective } from "./directives/rate.directive";
import { MrnNumberDirective } from "./directives/mrn-number.directive";
import { SuperAdminHeaderComponent } from "./layout/super-admin-header.component";
import { ScrollbarModule } from 'ngx-scrollbar';
import { LineChartComponent } from "./line-chart/line-chart.component";
import { ChartsModule } from 'ng2-charts';
import { ClientHeaderLayoutComponent } from "./layout/client-header-layout/client-header-layout.component";
import { SpanPipe } from "./pipes/span.pipe";
import { ChatWidgetComponent } from "./chat-widget/chat-widget.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GoogleAddressInputComponent } from "./controls/google-address-input/google-address-input.component";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { InvitationStatusPipe } from "./pipes/invitation-status.pipe";
import { DatePickerComponent } from "./date-picker/date-picker.component";
import { ClientLoginModelComponent } from "./login-model/client-login/client-login.component";
import { RouterModule } from "@angular/router";
import { AuthenticationService } from "src/app/platform/modules/auth/auth.service";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { LoginModelComponent } from "./login-model/login-model.component";
import { SecurityQuestionModelComponent } from "./security-question-model/security-question-model.component";
//import { MeanVideoComponent } from "./mean-video/mean-video.component";
import { AppointmentGraphComponent } from "./appointment-graph/appointment-graph.component";
import { BarChartComponent } from "./bar-chart/bar-chart.component";
import { ApproveAppointmentDialogComponent } from "./approve-appointment-dialog/approve-appointment-dialog.component";
import { CancelAppointmentDialogComponent } from "./cancel-appointment-dialog/cancel-appointment-dialog.component";
import { UniquePipe } from "./pipes/unique.pipe";
import { TimeCheckPipe } from "./pipes/time-check.pipe";
import { EncounterPipe } from "./pipes/encounter.pipe";
import { AddNewCallerComponent } from "./add-new-caller/add-new-caller.component";
import { RatingPipe } from "./pipes/rating.pipe";
import { RatingModule } from "ng-starrating";
import { InvitedPendingComponent } from "./appointment-graph/invited-pending/invited-pending.component";
import { InvitedAcceptedComponent } from "./appointment-graph/invited-accepted/invited-accepted.component";
import { InvitedRejectedComponent } from "./appointment-graph/invited-rejected/invited-rejected.component";
import { AcceptRejectAppointmentInvitationComponent } from "./accept-reject-appointment-invitation/accept-reject-appointment-invitation.component";
import { TextChatComponent } from "./text-chat/text-chat.component";
import { TextChatUserNamePipe } from "./text-chat/text-chat-user-name.pipe";
import { TextChatUserImagePipe } from "./text-chat/text-chat-user-image.pipe";
import { CallButtonComponent } from "./call-button/call-button.component";
import { UploadFileComponent } from "./text-chat/uploadFile/upload-file.component";
import { ChatMessagePipe } from "./pipes/chat-message.pipe";
import { TextMessageFormatComponent } from "./text-chat/text-message-format/text-message-format.component";
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { SetReminderComponent } from "./set-reminder/set-reminder.component";
import { FrontMaterialModule } from "src/app/front/front.material.module";
import { SymptomCheckerComponent } from "./symptom-checker/symptom-checker.component";

import { TooltipModule } from "ng2-tooltip-directive";
import { DndModule } from "ngx-drag-drop";
import { DynamicFormControlService } from "./dynamic-form/dynamic-form-control-service";
import { DynamicFormControlComponent } from "./dynamic-form/dynamic-form-control-component/dynamic-form-control-component";
import { DynamicFormComponent } from "./dynamic-form/dynamic-form-component/dynamic-form.component";
import { UrgentCareProviderActionComponent } from "./urgentcare-provideraction/urgentcare-provideraction.component";
import { PatientUrgentCareStatusComponent } from "./patient-urgentcare-status/patient-urgentcare-status.component";
import { CountDownComponent } from "./count-down/count-down.component";
import { VideoConsultationTestModalComponent } from "./video-consultation-test-modal/video-consultation-test-modal.component";
import { AudioRecordingService } from "./video-consultation-test-modal/audio-recording.service";
import { AddPrescriptionComponent } from "../platform/modules/agency-portal/clients/prescription/prescription-addprescription/prescription-addprescription.component";
import { DocViewerComponent } from "./doc-viewer/doc-viewer.component";
import { NgxDocViewerModule } from "ngx-doc-viewer";
import { ViewReportComponent } from "./view-report/view-report.component";
import { FollowupAppointmentComponent } from "./followup-appointment/followup-appointment.component";
import { AppointmentReschedulingDialogComponent } from "./appointment-rescheduling-dialog/appointment-rescheduling-dialog.component";
import { PreponeAppointmentComponent } from "./prepone-appointment/prepone-appointment.component";
import { PostponeAppointmentComponent } from "./postpone-appointment/postpone-appointment.component";
import { UrgentCareListingdialogComponent } from "./urgentcarelisting-dialog/urgentcarelisting-dialog.component";
import { HubConnection } from "../hubconnection.service";
import { HyperPayComponent } from "./hyper-pay/hyper-pay.component";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { DirectionMapComponent } from "./direction-map/direction-map.component";
//import { NgxDocViewerModule } from "ngx-doc-viewer";
// const config: SocketIoConfig = {
//   url: "https://turn.stagingsdei.com:5187",
//   options: {}
// };
import { AgmCoreModule } from "@agm/core";
import { PhoneNumberComponent } from "./phone-number/phone-number.component";
import { TemplateListingComponent } from "../platform/modules/formio-template/template-listing/template-listing.component";
import { FormBuilderComponent } from "../platform/modules/formio-template/form-builder/form-builder.component";
import { FormioModule } from '@formio/angular';
import { SignaturePadModule } from 'angular-signaturepad';
import { RaiseTicketComponent } from "./raise-ticket/raise-ticket.component";
import { ImageViewerComponent } from "./raise-ticket/image-viewer/image-viewer.component";
import { TicketDialogComponent } from "./raise-ticket/ticket-dialog/ticket-dialog.component";
import { UpdateTicketComponent } from "./raise-ticket/update-ticket/update-ticket.component";

import { InviteCallJoinComponent } from './invite-call-join/invite-call-join.component';
import { ReferralQrCodePageComponent } from './QrCodeScanPage/referral-qr-code-page/referral-qr-code-page.component';
import { VideoCallInvitationSharedComponent } from './video-call-invitation-shared/video-call-invitation-shared.component';
import { QRCodeResultScanLandingPageComponent } from './qrcode-result-scan-landing-page/qrcode-result-scan-landing-page.component';
import { TestPaymentFlowComponent } from './test-payment-flow/test-payment-flow.component';
import { PaymentSuccessTestComponent } from './payment-success-test/payment-success-test.component';
import { DoughnutChartComponent } from './doughnut-chart/doughnut-chart.component';
import { RaisedTicketDetailsComponent } from "./raised-ticket-details/raised-ticket-details.component";
import { RadiologyReferralModalComponent } from './radiology-referral-modal/radiology-referral-modal.component';
import { QRImageInhanserComponent } from './QrCodeScanPage/qrimage-inhanser/qrimage-inhanser.component';
import { SharedSoapViewNoteModelComponent } from './shared-soap-view-note-model/shared-soap-view-note-model.component';
import { SharedSoapNoteComponent } from './shared-soap-note/shared-soap-note.component';
import { ManageFeesRefundsComponent } from "../platform/modules/agency-portal/Payments/manage-fees-refunds/manage-fees-refunds.component";
import { HttpClientModule } from "@angular/common/http";
import { HttpClient } from "@angular/common/http";
import { MatMenu } from '@angular/material/menu';
const maskConfig: Partial<IConfig> = {};

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ContextMenuModule.forRoot({
      useBootstrap4: true,
    }),
    MatChipsModule,
    MatAutocompleteModule,
    //      <!-- intentionally commented code for running the application -->
    // MatDatetimepickerModule,
    // MatNativeDatetimeModule,
    MatToolbarModule,
    MatNativeDateModule,
    MatStepperModule,
    MatInputModule,
    FrontMaterialModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatExpansionModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatTooltipModule,
    MatSelectModule,
    ScrollbarModule,
    ChartsModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    GooglePlaceModule,
    RouterModule,
    MatDatepickerModule,
    MatTabsModule,
    MatRadioModule,
    AngularEditorModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    //SocketIoModule.forRoot(config)
    RatingModule,
    NgxMaskModule.forRoot(maskConfig),
    TooltipModule,
    DndModule,
    NgxDocViewerModule,
    MatVideoModule,
    FormioModule,
    AgmCoreModule.forRoot({
      apiKey: "AlzaSyAhbSJVBp7xa5kRT3RZ_aVcGqxXta5kWMk",
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [
    HeaderComponent,
    SuperAdminHeaderComponent,
    FooterComponent,
    SidebarComponent,
    MenuListItemComponent,
    DataTableComponent,
    DialogComponent,
    NumbersOnlyDirective,
    StatusPipe,
    PhoneNumberDirective,
    SsnDirective,
    ZipcodeDirective,
    RateDirective,
    MrnNumberDirective,
    LineChartComponent,
    ClientHeaderLayoutComponent,
    SpanPipe,
    InvitationStatusPipe,
    ChatWidgetComponent,
    GoogleAddressInputComponent,
    DatePickerComponent,
    AgencyLoginModelComponent,
    ClientLoginModelComponent,
    RegisterModelComponent,
    LoginModelComponent,
    SecurityQuestionModelComponent,
    AppointmentGraphComponent,
    BarChartComponent,
    StaffAppointmentComponent,
    //MeanVideoComponent,
    ApproveAppointmentDialogComponent,
    CancelAppointmentDialogComponent,
    UniquePipe,
    TimeCheckPipe,
    EncounterPipe,
    AddNewCallerComponent,
    InvitedPendingComponent,
    InvitedAcceptedComponent,
    InvitedRejectedComponent,
    AcceptRejectAppointmentInvitationComponent,
    //PublisherComponent,
    //SubscriberComponent,
    RatingPipe,
    TextChatComponent,
    TextChatUserNamePipe,
    TextChatUserImagePipe,
    CallButtonComponent,
    UrgentCareProviderActionComponent,
    UploadFileComponent,
    ChatMessagePipe,
    TextMessageFormatComponent,
    SetReminderComponent,
    AppointmentViewComponent,
    cancelAppointmentComponent,
    SymptomCheckerComponent,
    DynamicFormControlComponent,
    DynamicFormComponent,
    UrgentCareProviderActionComponent,
    PatientUrgentCareStatusComponent,
    CountDownComponent,
    AddPrescriptionComponent,
    VideoConsultationTestModalComponent,
    DocViewerComponent,
    ViewReportComponent,
    FollowupAppointmentComponent,
    AppointmentReschedulingDialogComponent,
    PreponeAppointmentComponent,
    PostponeAppointmentComponent,
    UrgentCareListingdialogComponent,
    CallNotificationComponent,
    HyperPayComponent,
    DirectionMapComponent,
    PhoneNumberComponent,
    TemplateListingComponent,
    FormBuilderComponent,
    RaiseTicketComponent,
    ImageViewerComponent,
    TicketDialogComponent,
    UpdateTicketComponent,
    InviteCallJoinComponent,
    ReferralQrCodePageComponent,
    VideoCallInvitationSharedComponent,
    QRCodeResultScanLandingPageComponent,
    TestPaymentFlowComponent,
    PaymentSuccessTestComponent,
    DoughnutChartComponent,
    RaisedTicketDetailsComponent,
    RadiologyReferralModalComponent,
    QRImageInhanserComponent,
    SharedSoapViewNoteModelComponent,
    SharedSoapNoteComponent, 
    ManageFeesRefundsComponent
  ],
  providers: [
    SharedService,
    DialogService,
    MailboxService,
    SymptomCheckerService,
    ViewReportService,
    AuthenticationService,
    DynamicFormControlService,
    HubConnection,
    AudioRecordingService,
    {
      provide: MAT_DIALOG_DATA,

      useValue: {
        hasBackdrop: true,
        disableClose: true,
        minWidth: "55%",
        maxWidth: "90%",
      },
    },
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },

    //CommonService
  ],

  // entryComponents: [
  //   DialogComponent,
  //   ChatWidgetComponent,
  //   ApproveAppointmentDialogComponent,
  //   CancelAppointmentDialogComponent,
  //   AddNewCallerComponent,
  //   SetReminderComponent,
  //   AcceptRejectAppointmentInvitationComponent,
  //   UploadFileComponent,
  //   TextMessageFormatComponent,
  //   StaffAppointmentComponent,
  //   FollowupAppointmentComponent,
  //   AppointmentViewComponent,
  //   cancelAppointmentComponent,
  //   SymptomCheckerComponent,
  //   DynamicFormControlComponent,
  //   DynamicFormComponent,
  //   UrgentCareProviderActionComponent,
  //   PatientUrgentCareStatusComponent,
  //   AddPrescriptionComponent,
  //   VideoConsultationTestModalComponent,
  //   DocViewerComponent,
  //   ViewReportComponent,
  //   AppointmentReschedulingDialogComponent,
  //   PreponeAppointmentComponent,
  //   PostponeAppointmentComponent,
  //   UrgentCareListingdialogComponent,
  //   CallNotificationComponent,
  //   HyperPayComponent,
  //   RaiseTicketComponent,
  //   ImageViewerComponent,
  //   TicketDialogComponent,
  //   UpdateTicketComponent,
  //   RadiologyReferralModalComponent,
  //   QRImageInhanserComponent,
  //   SharedSoapViewNoteModelComponent
  // ],
  exports: [
    CommonModule,
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatDialogModule,
    HeaderComponent,
    SuperAdminHeaderComponent,
    FooterComponent,
    SidebarComponent,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatTooltipModule,
    DataTableComponent,
    DialogComponent,
    NumbersOnlyDirective,
    StatusPipe,
    PhoneNumberDirective,
    ZipcodeDirective,
    SsnDirective,
    MrnNumberDirective,
    MatSelectModule,
    ChartsModule,
    LineChartComponent,
    ClientHeaderLayoutComponent,
    ChatWidgetComponent,
    GoogleAddressInputComponent,
    RouterModule,
    MatDatepickerModule,
    MatTabsModule,
    AppointmentGraphComponent,
    ApproveAppointmentDialogComponent,
    CancelAppointmentDialogComponent,
    UniquePipe,
    TimeCheckPipe,
    EncounterPipe,
    MatRadioModule,
    TextChatComponent,
    CallButtonComponent,
    UploadFileComponent,
    ChatMessagePipe,
    TextMessageFormatComponent,
    //PublisherComponent,
    //SubscriberComponent,
    NgxMaskModule,
    TooltipModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    DynamicFormControlComponent,
    DynamicFormComponent,
    CountDownComponent,
    AddPrescriptionComponent,
    VideoConsultationTestModalComponent,
    DocViewerComponent,
    NgxDocViewerModule,
    ViewReportComponent,
    MatVideoModule,
    MatChipsModule,
    MatAutocompleteModule,
    AppointmentReschedulingDialogComponent,
    PreponeAppointmentComponent,
    PostponeAppointmentComponent,
    UrgentCareListingdialogComponent,
    TranslateModule,
    PhoneNumberComponent,
    DatePickerComponent,
    TemplateListingComponent,
    FormBuilderComponent,
    SignaturePadModule,
    RaiseTicketComponent,
    ImageViewerComponent,
    TicketDialogComponent,
    UpdateTicketComponent,
    DoughnutChartComponent,
    SharedSoapViewNoteModelComponent,
    SharedSoapNoteComponent,
    ManageFeesRefundsComponent,
    BarChartComponent,
    VideoCallInvitationSharedComponent
  ],
})
export class SharedModule {}
export function HttpLoaderFactory(http:HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
