import { UserQualificationComponent } from "./user-qualification/user-qualification.component";
import { UserAwardComponent } from "./user-award/user-award.component";
import { UserExperienceComponent } from "./user-experience/user-experience.component";
import { NgModule } from "@angular/core";
import { CommonModule, FormatWidth } from "@angular/common";
import { UsersRoutingModule } from "./users.module.routing";
import { UsersService } from "./users.service";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SharedModule } from "../../../../shared/shared.module";
import { PlatformMaterialModule } from "../../../platform.material.module";
import { UserListingComponent } from "./user-listing/user-listing.component";
import { UserComponent } from "./user/user.component";
import { AddUserComponent } from "./add-user/add-user.component";
import { CustomFieldsComponent } from "./custom-fields/custom-fields.component";
import { UserLeavesComponent } from "./user-leaves/user-leaves.component";
import { PayrollRateComponent } from "./payroll-rate/payroll-rate.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { UserDocumentsComponent } from "./user-documents/user-documents.component";
import { AddUserDocumentComponent } from "./user-documents/add-user-document/add-user-document.component";
import { ManageLeavesComponent } from "./manage-leaves/manage-leaves.component";
import { ApplyLeaveComponent } from "./manage-leaves/apply-leave/apply-leave.component";
import { ApplyLeaveModalComponent } from "./user-leaves/apply-leave-modal/apply-leave-modal.component";
import { UserTimeSheetTabularViewService } from "./user-time-sheet-tabular-view/user-time-sheet-tablular.service";
import { UserTimeSheetViewService } from "./user-time-sheet-sheet-view/user-time-sheet-sheet.service";
import { UserTimeSheetTabularViewComponent } from "./user-time-sheet-tabular-view/user-time-sheet-tabular-view.component";
import { UserTimeSheetSheetViewComponent } from "./user-time-sheet-sheet-view/user-time-sheet-sheet-view.component";
import { UserTimeSheetComponent } from "./user-time-sheet/user-time-sheet.component";
import { ScrollbarModule } from 'ngx-scrollbar';
import { MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material/dialog";
import { UserInvitationComponent } from "./user-invitation/user-invitation.component";
import { SendUserInvitationComponent } from "./user-invitation/send-user-invitation/send-user-invitation.component";
import { UserInvitationService } from "../users/user-invitation/user-invitation.service";
//      <!-- intentionally commented code for running the application -->
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { AngularEditorModule } from '@kolkov/angular-editor';
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
//import { AvailabilitySlotComponent } from "./availability-slot/availability-slot.component";
import { AvailabilityComponent } from "./availability/availability.component";
//import { AvailabilityComponent } from "./availability copy/availability.component";
import { NgxMaskModule } from "ngx-mask";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { AvailabilityDeleteComponent } from "./availability-delete/availability-delete.component";
import { AddEditUserExperienceComponent } from "./user-experience/add-edit-user-experience/add-edit-user-experience.component";
import { AddEditQualificationComponent } from "./user-qualification/add-edit-qualification/add-edit-qualification.component";
import { AvailabilitySlotComponent } from "./availability-slot/availability-slot.component";
import { AddEditUserAwardComponent } from "./user-award/add-edit-user-award/add-edit-user-award.component";
import { AddVideoComponent } from './add-video/add-video.component';
import { ContextMenuModule } from "ngx-contextmenu";
import { RatingModule } from 'ng-starrating';
import { ReviewModalComponent } from './user-profile/review-modal/review-modal.component';
import { BookAppointmentByDoctorComponent } from './book-appointment-by-doctor/book-appointment-by-doctor.component';
import { AddOtherItemsOncalenderComponent } from './add-other-items-oncalender/add-other-items-oncalender.component';
import { AgencyadduserComponent } from './agencyadduser/agencyadduser.component';
import { AgencyadduserparentComponent } from './agencyadduserparent/agencyadduserparent.component';
import { MatMenuModule } from "@angular/material/menu";

//import { AddEditUserExperienceComponent } from './user-experience/add-edit-user-experience/add-edit-user-experience.component';
//import { AddEditUserAwardComponent } from './user-award/add-edit-user-award/add-edit-user-award.component';

@NgModule({
  imports: [
    CommonModule,
    UsersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PlatformMaterialModule,
    ScrollbarModule,
    //      <!-- intentionally commented code for running the application -->
    NgxMatSelectSearchModule,
    AngularEditorModule,
    RatingModule,
    [NgxMaskModule.forRoot()],
    NgxMaterialTimepickerModule,
    //[NgxMaterialTimepickerModule.forRoot()],
    ReactiveFormsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    ContextMenuModule.forRoot({
      useBootstrap4: true,
    }),
    MatMenuModule,
  ],
  declarations: [
    UserListingComponent,
    UserComponent,
    AddUserComponent,
    CustomFieldsComponent,
    UserLeavesComponent,
    PayrollRateComponent,
    UserProfileComponent,
    UserDocumentsComponent,
    AddUserDocumentComponent,
    ManageLeavesComponent,
    ApplyLeaveComponent,
    ApplyLeaveModalComponent,
    UserTimeSheetComponent,
    UserTimeSheetTabularViewComponent,
    UserTimeSheetSheetViewComponent,
    UserInvitationComponent,
    SendUserInvitationComponent,
    UserExperienceComponent,
    UserAwardComponent,
    UserQualificationComponent,
    AvailabilitySlotComponent,
    AvailabilityComponent,
    AvailabilityDeleteComponent,
    AddEditQualificationComponent,
    AddEditUserExperienceComponent,
    AddEditUserAwardComponent,
    AddVideoComponent,
    ReviewModalComponent,
    BookAppointmentByDoctorComponent,
    AddOtherItemsOncalenderComponent,
    AgencyadduserComponent,
    AgencyadduserparentComponent,
 
  ],
  providers: [
    UsersService,
    UserTimeSheetViewService,
    UserTimeSheetTabularViewService,
    UserInvitationService,
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
  //   AddUserComponent,
  //   CustomFieldsComponent,
  //   AddUserDocumentComponent,
  //   ApplyLeaveModalComponent,
  //   UserTimeSheetComponent,
  //   UserTimeSheetTabularViewComponent,
  //   UserTimeSheetSheetViewComponent,
  //   SendUserInvitationComponent,
  //   UserExperienceComponent,
  //   UserAwardComponent,
  //   UserQualificationComponent,
  //   AvailabilitySlotComponent,
  //   AvailabilityDeleteComponent,
  //   AddEditQualificationComponent,
  //   AddEditUserExperienceComponent,
  //   AddEditUserAwardComponent,
  //   AddVideoComponent,
  //   ReviewModalComponent,
  //   BookAppointmentByDoctorComponent,
  //   AddOtherItemsOncalenderComponent,
  //   AgencyadduserComponent
  // ]
})
export class UsersModule {}
