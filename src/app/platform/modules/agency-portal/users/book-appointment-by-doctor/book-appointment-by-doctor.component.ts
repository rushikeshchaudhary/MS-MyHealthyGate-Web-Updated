import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NotifierService } from "angular-notifier";
import { format } from "date-fns";
import { HomeService } from "src/app/front/home/home.service";
import { SaveDocumentComponent } from "src/app/front/save-document/save-document.component";
import { TermsConditionModalComponent } from "src/app/front/terms-conditions/terms-conditions.component";
import { ResponseModel } from "../../../core/modals/common-model";
import { CommonService } from "../../../core/services";
import { SchedulerService } from "../../../scheduling/scheduler/scheduler.service";
import { ClientListService } from "../../client-list/client-list.service";
import { ClientsService } from "../../clients/clients.service";

const getDateTimeString = (date: string, time: string): string => {
  const y = new Date(date).getFullYear(),
    m = new Date(date).getMonth(),
    d = new Date(date).getDate(),
    splitTime = time.split(":"),
    hours = parseInt(splitTime[0] || "0", 10),
    minutes = parseInt(splitTime[1].substring(0, 2) || "0", 10),
    meridiem = splitTime[1].substring(3, 5) || "",
    updatedHours =
      (meridiem || "").toUpperCase() === "PM" && hours != 12
        ? hours + 12
        : hours;

  const startDateTime = new Date(y, m, d, updatedHours, minutes);

  return format(startDateTime, "yyyy-MM-ddTHH:mm:ss");
};

@Component({
  selector: "app-book-appointment-by-doctor",
  templateUrl: "./book-appointment-by-doctor.component.html",
  styleUrls: ["./book-appointment-by-doctor.component.css"],
})
export class BookAppointmentByDoctorComponent implements OnInit {
  staffId: any;
  patientDetails: any;
  loading = false;
  searchKey: string = "";
  clientList: any;
  metaData: any;
  selectedPatient: any;
  appointmentForm: FormGroup;
  bookingDate: any;
  bookingStartTime: any;
  bookingEndTime: any;
  uploadImageData: any;
  fileList: any = [];
  showselecttermscondition: boolean = false;
  istermsconditionchecked: boolean = false;
  visitType: any;
  locationId: number = 0;
  providerInfo: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogModalRef: MatDialogRef<BookAppointmentByDoctorComponent>,
    private clientListingService: ClientListService,
    private clientService: ClientsService,
    private formBuilder: FormBuilder,
    private dialogModal: MatDialog,
    private schedulerService: SchedulerService,
    private notifierService: NotifierService,
    private homeService: HomeService,
    private commonService: CommonService
  ) {
    this.staffId = data.providerId;

    this.appointmentForm = this.formBuilder.group({
      patientId: [],
      staffId: [],
      patientName: [],
      dob: [],
      gender: [],
      email: [],
      phone: [],
      patientPhotoThumbnailPath: [],
      startDateTime: [],
      endDateTime: [],
      notes: [""],
      isTelehealthAppointment: [],
      statusName: [],
      isClientRequired: [],
      mode: [],
      type: [],
    });
  }

  ngOnInit() {
    // this.data.event.end = format(this.data.event.end, 'dd/MM/yyyy');
    // this.data.event.start = format(this.data.event.start, 'dd/MM/yyyy');
    this.bookingDate = format(this.data.event.start, 'dd/MM/yyyy');
    this.bookingStartTime = format(this.data.event.start, 'h:mm a');
    this.bookingEndTime = format(this.data.event.end, 'h:mm a');
    switch (this.data.event.visitType) {
      case 1:
        this.visitType = { visitId: this.data.event.visitType, name: "Online" };
        break;
      case 2:
        this.visitType = {
          visitId: this.data.event.visitType,
          name: "Face To Face",
        };
        break;
      case 3:
        this.visitType = {
          visitId: this.data.event.visitType,
          name: "Home Visit",
        };
        break;
      case 4:
        this.visitType = {
          visitId: this.data.event.visitType,
          name: "Online and Face To Face",
        };
        break;
    }

    this.getStaffDetail();
  }

  searchChanged = (event: any) => {
    this.getStaffClients();
  };

  getStaffClients = () => {
    const tempData = {
      pageNumber: 1,
      pageSize: 10,
      sortColumn: "",
      sortOrder: "",
      searchText: this.searchKey,
      staffId: this.staffId,
    };

    console.log(tempData);

    // console.log(this.staffClientRequestModel);
    this.clientListingService.getStaffClient(tempData).subscribe((res) => {
      this.loading = false;

      if (res != null && res.data != null && res.statusCode == 200) {
        this.clientList = res.data.map((x:any) => {
          x.dob = format(x.dob, 'dd/MM/yyyy');
          return x;
        });
        this.clientList = this.clientList.reverse();
        console.log(this.clientList);

        this.metaData = res.meta;
      } else {
        this.clientList = [];
        this.metaData = null;
      }
      this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];
    });
  };

  onNoClick(): void {
    this.dialogModalRef.close();
  }

  get f() {
    return this.appointmentForm.controls;
  }

  getPatientData = (option: any) => {
    this.selectedPatient = option;
    this.searchKey = option.patientFirstName + " " + option.patientLastName;
    console.log(option);
    this.getClientProfileInfo(option.patientId);
  };

  getStaffDetail() {
    if (this.staffId != "") {
      // const providerId = this.commonService.encryptValue(this.staffId);
      this.homeService.getProviderDetail(this.staffId).subscribe((res) => {
        if (res.statusCode == 200) {
          this.providerInfo = res.data;
        }
      });
    }
  }

  getClientProfileInfo(patientId: any) {
    this.clientService
      .getClientProfileInfo(patientId)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          console.log(response);
          this.patientDetails = response.data.patientInfo[0];

          this.patientDetails.dob = format(
            this.patientDetails.dob,
            'dd/MM/yyyy'
          );
          this.appointmentForm.patchValue({
            patientId: this.patientDetails.patientID,
            patientName: this.patientDetails.name,
            staffId: this.data.providerId,
            dob: this.patientDetails.dob,
            gender: this.patientDetails.gender,
            email: this.patientDetails.email,
            phone: this.patientDetails.phone,
            patientPhotoThumbnailPath:
              this.patientDetails.patientPhotoThumbnailPath,
          });
        }
      });
  }

  createModal() {
    let documentModal;
    documentModal = this.dialogModal.open(SaveDocumentComponent, { data: 0 });
    documentModal.afterClosed().subscribe((result: string) => {
      if (result !== "close") {
        this.uploadImageData = result;
        this.handleImageChange();
      }
    });
  }

  handleImageChange() {
    let files: any[] = [];
    this.uploadImageData.base64.map((ele: any) => this.fileList.push(ele));
  }
  removeFile(index: number) {
    this.fileList.splice(index, 1);
  }

  termsandconditionchecked(event: { checked: any; }) {
    if (event.checked) {
      this.istermsconditionchecked = true;
      this.opentermconditionmodal();
      this.showselecttermscondition = false;
    } else {
      this.istermsconditionchecked = false;
    }
  }

  opentermconditionmodal() {
    let dbModal;
    dbModal = this.dialogModal.open(TermsConditionModalComponent, {
      hasBackdrop: true,
      width: "70%",
    });
    dbModal.afterClosed().subscribe((result: string) => {
      //
      if (result != null && result != "close") {
      }
      //this.show=true;
    });
  }

  openfreeapptCheckout() {
    this.bookNewFreeAppointment("", "Free");
  }

  bookNewFreeAppointment(tokenId: string, paymentMode: string): any {
    // this.loading = true;

    if (this.locationId == 0) {
      this.locationId = this.providerInfo.staffLocationList.find(
        (x: { isDefault: boolean; }) => x.isDefault === true
      ).id;
    }
    const appointmentData:any = [
      {
        PatientAppointmentId: null,
        AppointmentTypeID: null,
        AppointmentStaffs: [{ StaffId: this.staffId }],
        PatientID: this.patientDetails.patientID,
        ServiceLocationID: this.locationId || null,
        StartDateTime: getDateTimeString(
          format(this.data.event.start, "yyyy-MM-dd"),
          this.bookingStartTime
        ),
        EndDateTime: getDateTimeString(
          format(this.data.event.start, "yyyy-MM-dd"),
          this.bookingEndTime
        ),
        IsTelehealthAppointment: true,
        IsExcludedFromMileage: true,
        IsDirectService: true,
        Mileage: null,
        DriveTime: null,
        latitude: 0,
        longitude: 0,
        locationId:this.locationId,
        Notes: this.f["notes"].value,
        IsRecurrence: false,
        RecurrenceRule: null,
        Mode: this.visitType.name,
        Type: "new",
        PayRate: 0,
        PaymentToken: tokenId,
        PaymentMode: paymentMode,
        IsBillable: true,
      },
    ];
    const queryParams = {
      IsFinish: !appointmentData[0].RecurrenceRule,
      isAdmin: false,
    };
    this.createFreeAppointmentFromPatientPortal(appointmentData[0]);
  }
  createFreeAppointmentFromPatientPortal(appointmentData: any) {
    this.schedulerService
      .bookNewFreeAppointmentFromPatientPortal(appointmentData)
      .subscribe((response) => {
        // this.loading = false;
        if (response.statusCode === 200) {
          //this.notifierService.notify("success", response.message);
          let Message = {
            title: "Success!",
            message:
              "Thank you, Your appointment has been successfully booked, please contact administation for further assistance.",
            imgSrc: "../assets/img/user-success-icon.png",
          };

          this.notifierService.notify("success", response.message);
          this.dialogModalRef.close("save");
        } else {
          this.notifierService.notify("error", response.message);
        }
      });
  }
}
