import { AnimateTimings } from "@angular/animations";
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { format } from "date-fns";
import { ClientsService } from "../../../agency-portal/clients/clients.service";
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: "app-view-lab-appointment-patient",
  templateUrl: "./view-lab-appointment-patient.component.html",
  styleUrls: ["./view-lab-appointment-patient.component.css"],
})
export class ViewLabAppointmentPatientComponent implements OnInit {
  labAppointmentDetails: any;
  patientDetails: any;
  loading = false;
  isLoadingDocuments= true
  documentList!: Array<any>;


  //appointmentLabForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogPopup: MatDialogRef<ViewLabAppointmentPatientComponent>,
    private clientService: ClientsService,
    private formBuilder: FormBuilder,
    private translate:TranslateService,

  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.labAppointmentDetails = data;
  }

  ngOnInit() {
    debugger
    this.getPatientProfile();

    //this.initializeFormFields(this.patientDetails,this.labAppointmentDetails);
  }

  getPatientProfile = () => {
    this.loading = true;
    this.clientService
      .getClientProfileInfo(this.labAppointmentDetails.patientID)
      .subscribe((res) => {
        this.patientDetails = res.data.patientInfo[0];
        this.patientDetails.dob =
          format(this.patientDetails.dob, 'MM/dd/yyyy')
         
        this.loading = false;
        this.getUserDocuments()
      });
  };

  onNoClick(): void {
    this.dialogPopup.close();
  }
  onClose() {
    this.dialogPopup.close();
  }

  getUserDocuments() {
    this.isLoadingDocuments = true;
    this.clientService
      .getPateintApptDocuments(this.labAppointmentDetails.patientAppointmentId)
      .subscribe((response) => {
        this.isLoadingDocuments = false;
        if (response != null) {
          this.documentList =
            response.data != null && response.data.length > 0
              ? response.data
              : [];
        }
      });
  }

  // initializeFormFields(appointment:any,labAppointment:any) {

  //   const configControls = {
  //     'patientName': [this.labAppointmentDetails.patientName],
  //     'dob': [this.patientDetails.dob],
  //     'gender': [this.patientDetails.gender],
  //     'email': [this.patientDetails.email],
  //     'phone': [this.patientDetails.phone],
  //     'patientPhotoThumbnailPath': [this.patientDetails.photoThumbnailPath],
  //     'startDateTime': [this.labAppointmentDetails.startDateTime],
  //     //'endDateTime': [],
  //     //'notes': [],
  //     'mode': [this.labAppointmentDetails.bookingMode],
  //     'type': [this.labAppointmentDetails.bookingType],
  //     'provider': [this.labAppointmentDetails.appointmentLab[0].labName],

  //   }
  //   this.appointmentLabForm = this.formBuilder.group(configControls);
  //   this.appointmentLabForm.disable();
  // }

  // get f() {
  //   return this.appointmentLabForm.controls;
  // }
}
