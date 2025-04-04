import { DatePipe, DOCUMENT } from "@angular/common";
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {MatAutocomplete,MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';

import {MatChipInputEvent} from '@angular/material/chips';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { NotifierService } from "angular-notifier";
import { format } from "date-fns";
import { Observable } from "rxjs";
import { UsersService } from "src/app/platform/modules/agency-portal/users/users.service";
import { CommonService } from "src/app/platform/modules/core/services/common.service";
import { SchedulerService } from "src/app/platform/modules/scheduling/scheduler/scheduler.service";
import { FollowupAppointmentComponent } from "src/app/shared/followup-appointment/followup-appointment.component";
import { HyperPayComponent } from "src/app/shared/hyper-pay/hyper-pay.component";
import { ResponseModel } from "src/app/super-admin-portal/core/modals/common-model";
import { LoginUser } from "src/app/super-admin-portal/core/modals/loginUser.modal";
import { HomeService } from "../../home/home.service";
import { SaveDocumentComponent } from "../../save-document/save-document.component";
import { TermsConditionModalComponent } from "../../terms-conditions/terms-conditions.component";
import { TranslateService } from "@ngx-translate/core";

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
  selector: "app-lab-book-appointment-modal",
  templateUrl: "./lab-book-appointment-modal.component.html",
  styleUrls: ["./lab-book-appointment-modal.component.css"],
})
export class LabBookAppointmentModalComponent implements OnInit {
  isProfileLoaded: boolean = true;
  isNotBooked: boolean = false;
  isLinear = false;
  labData: any;
  showLoader: boolean = false;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  thirdFormGroup!: FormGroup;
  appointmenType: any = ["New"];
  confirmation: any = { type: "New", mode: "Face to Face" };
  IsPreviousFollowup: boolean = false;
  appointmentMode: any = ["Face to Face", "Home Visit"];
  providerAvailiabilitySlots: any = [];
  locationId: number;
  staffAvailability: any;
  patientAppointments: any;
  userData: any;
  providerAvailableDates: any = [];
  providerNotAvailableDates: any = [];
  uploadImageData:any;
  fileList: any = [];
  userControl = new FormControl();
  @ViewChild("userInput")
  userInput!: ElementRef<HTMLInputElement>;
  @ViewChild("auto")
  matAutocomplete!: MatAutocomplete;
  symptoms: any = [];
  filteredSymptoms$!: Observable<any[]>;
  istermsconditionchecked: boolean = false;
  showselecttermscondition: boolean = false;
  isNotify = false;
  lastFollowupData: any;
  submitted: boolean = false;
  newfollowupfees: boolean = false;
  Message: any;
  local_apptid!: number;
  Organization: any;
  appointmentModeId!: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogModalRef: MatDialogRef<LabBookAppointmentModalComponent>,
    private notifierService: NotifierService,
    private datePipe: DatePipe,
    private _formBuilder: FormBuilder,
    private usersService: UsersService,
    private dialogModal: MatDialog,
    private schedulerService: SchedulerService,
    private commonService: CommonService,
    private userService: UsersService,
    private homeService: HomeService,
    private renderer2: Renderer2,
    private translate:TranslateService,
    @Inject(DOCUMENT) private _document:any
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    console.log(this.data);
    if ((this.data.roleId == 329)) {
      this.appointmentMode = ["Face to Face"];
    }
    else if ((this.data.roleId == 325)) {
      this.appointmentMode = ["Face to Face", "Home Visit"];
    }

    this.labData = data;
    this.locationId = data.locationID;
  }

  ngOnInit() {
    this.Message = null;
    this.homeService.getOrganizationDetail().subscribe((response) => {
      if (response.statusCode == 200) {
        this.Organization = response.data;
      }
    });

    this.commonService.loginUser.subscribe((user) => {
      this.userData = user;
      console.log(user);
    });

    const s = this.renderer2.createElement("script");
    s.type = "text/javascript";
    s.src = "https://checkout.stripe.com/checkout.js";
    s.text = ``;
    this.renderer2.appendChild(this._document.body, s);

    this.isNotBooked = true;
    this.firstFormGroup = this._formBuilder.group({
      appointmentDate: ["", Validators.required],
      startTime: ["", Validators.required],
      endTime: ["", Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ["", Validators.required],
    });
    this.thirdFormGroup = this._formBuilder.group({
      Notes: ["", Validators.required],
      startTime: ["", Validators.required],
      endTime: ["", Validators.required],
    });
  }

  get formGroup1() {
    return this.firstFormGroup.controls;
  }
  get formGroup3() {
    return this.thirdFormGroup.controls;
  }

  termsandconditionchecked(event:any) {
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

  checkboxchecked(event:any) {
    this.isNotify = event.checked;
  }

  closeDialog(action: string): void {
    this.dialogModalRef.close(action);
    //location.reload();
  }
  onModeChange(mode: any) {
    this.confirmation.mode = mode;
    console.log(mode);
  }

  getStartEndTime(obj: any) {
    let startDate: Date = new Date(obj.startTime),
      endDate: Date = new Date(obj.endTime);

    let slotStartHr = startDate.getHours(),
      slotStartMin = startDate.getMinutes(),
      slotEndHr = endDate.getHours(),
      slotEndMin = endDate.getMinutes(),
      startTime = this.parseTime(slotStartHr + ":" + slotStartMin),
      endTime = this.parseTime(slotEndHr + ":" + slotEndMin);
    return { startTime: startTime, endTime: endTime };
  }
  parseTime(s:any) {
    let c = s.split(":");
    return parseInt(c[0]) * 60 + parseInt(c[1]);
  }

  calculateTimeSlotRange(
    start_time: number,
    end_time: number,
    interval: number = 30
  ) {
    let i, formattedStarttime, formattedEndtime;
    let time_slots: Array<any> = [];
    for (let i = start_time; i <= end_time - interval; i = i + interval) {
      formattedStarttime = this.convertHours(i);
      formattedEndtime = this.convertHours(i + interval);
      time_slots.push({
        startTime: formattedStarttime,
        endTime: formattedEndtime,
      });
    }
    return time_slots;
  }

  convertHours(mins: number) {
    let hour = Math.floor(mins / 60);
    mins = mins % 60;
    let time = "";
    if (this.pad(hour, 2) < 12) {
      time = this.pad(hour, 2) + ":" + this.pad(mins, 2) + " AM";
    } else {
      time =
        this.pad(hour, 2) == 12
          ? this.pad(hour, 2) + ":" + this.pad(mins, 2) + " PM"
          : this.pad(hour, 2) - 12 + ":" + this.pad(mins, 2) + " PM";
    }
    //let converted = this.pad(hour, 2)+':'+this.pad(mins, 2);
    return time;
  }

  pad(str:any, max:any) : any{
    str = str.toString();
    return str.length < max ? this.pad("0" + str, max) : str;
  }

  closeModal() {
    this.dialogModal.closeAll();
  }

  openLastFollowup() {
    let dbModal;
    dbModal = this.dialogModal.open(FollowupAppointmentComponent, {
      hasBackdrop: true,
      width: "70%",
      data: {
        id: this.lastFollowupData.id,
        lastAppointmentStartTime: this.lastFollowupData.startDateTime,
        lastAppointmentEndTime: this.lastFollowupData.endDateTime,
        notes: this.lastFollowupData.notes,
        bookingMode: this.lastFollowupData.bookingMode,
      },
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result != null && result != "close") {
      }
    });
  }

  add(event: any): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || "").trim()) {
        this.symptoms.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = "";
      }

      this.userControl.setValue(null);
    }
  }

  onDateChange(event:any):any {
    var curDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    var selDate = this.datePipe.transform(event, "yyyy-MM-dd");
    if (selDate! < curDate!) {
      this.notifierService.notify(
        "error",
        "Appointment cannot be set for past date"
      );
      return null;
    }
    this.confirmation.startTime = null;
    this.confirmation.endTime = null;
    this.showLoader = true;
    this.providerAvailiabilitySlots = [];
    this.firstFormGroup.get("appointmentDate")!.setValue(event);
    let interval = this.labData.timeInterval;
    const filterModal = {
      locationIds: this.locationId,
      // fromDate: format(event.value, "yyyy-MM-dd"),
      // toDate: format(event.value, "yyyy-MM-dd"),
      fromDate: format(event, "yyyy-MM-dd"),
      toDate: format(event, "yyyy-MM-dd"),
      staffIds: this.labData.labId,
      patientIds: ("" || []).join(","),
    };
    let clientAppointments: Array<any> = [];

    let currentAvailabilityDay: any;
    let currentAvailableDates: Array<any> = [];
    let currentUnAvailableDates: Array<any> = [];
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let dayName = days[new Date(event).getDay()];
    this.staffAvailability = [];
    switch (this.confirmation.mode.toLowerCase()) {
      case "online":
        this.appointmentModeId = 1;
        break;
      case "face to face":
        this.appointmentModeId = 2;
        break;
      case "home visit":
        this.appointmentModeId = 3;
        break;
    }
    this.usersService
      .getStaffAvailabilityByLocation(
        this.labData.labId,
        this.locationId,
        selDate,
        this.appointmentModeId
      )
      .subscribe((response: ResponseModel) => {
        console.log(response);
        let availibiltyResponse = response;
        if (response) {
          this.schedulerService
            .getListData(filterModal)
            .subscribe((res: any) => {
              this.showLoader = false;
              if (res) {
                this.patientAppointments = res.data;
                this.patientAppointments.forEach((app: { startDateTime: any; endDateTime: any; cancelTypeId: number | null; statusName: any; }) => {
                  let obj = {
                    startTime: app.startDateTime,
                    endTime: app.endDateTime,
                  };
                  let timeObj = this.getStartEndTime(obj),
                    startTime = timeObj.startTime,
                    endTime = timeObj.endTime;
                  if (
                    !app.cancelTypeId ||
                    (app.cancelTypeId == null && app.cancelTypeId == 0)
                  ) {
                    this.calculateTimeSlotRange(
                      startTime,
                      endTime,
                      interval
                    ).forEach((x) => {
                      clientAppointments.push({
                        startTime: x.startTime,
                        endTime: x.endTime,
                        statusName: app.statusName,
                      });
                    });
                  }
                });
              }

              if (
                availibiltyResponse &&
                availibiltyResponse.data &&
                availibiltyResponse.data.length > 0
              ) {
                availibiltyResponse.data.forEach((x: { startTime: string | number | Date; isSelected: any; }) => {
                  let timeObj = this.getStartEndTime(x);
                  let currentTime = new Date();
                  let _startTime = new Date(x.startTime);
                  //let currentTime = this.getCurrentTime(new Date());

                  this.providerAvailiabilitySlots.push({
                    startTime: timeObj.startTime, //.replace(":00","").replace("AM","").replace("PM",""),
                    endTime: timeObj.endTime, //.replace(":00",""),
                    // startTimeftm: this.convertHours(timeObj.startTime).replace(":00", "").replace("AM", "").replace("PM", "").trim(),
                    // endTimeftm: this.convertHours(timeObj.endTime).replace(":00", "").replace("AM", "").replace("PM", "").trim(),
                    startTimeftm: this.convertHours(timeObj.startTime)
                      .replace(":00", "")
                      .trim(),
                    endTimeftm: this.convertHours(timeObj.endTime)
                      .replace(":00", "")
                      .trim(),
                    location: "Max Hospital, Mohali",
                    isAvailable: x.isSelected,
                    isSelected: false,
                    isPassed: false,
                    isReserved: false,
                    isHide: this.getIsTimeAvailable(_startTime, currentTime),
                    // isHide:timeObj.startTime < currentTime ? true:false,
                  });
                });
                //sorted slots in ascending order
                this.providerAvailiabilitySlots.sort(
                  (a: { startTime: number; endTime: number; }, b: { startTime: number; endTime: number; }) => a.startTime - b.startTime || a.endTime - b.endTime
                );
              }

              let currentDate = new Date();
              if (
                this.datePipe.transform(new Date(currentDate), "yyyyMMdd") ===
                // this.datePipe.transform(new Date(event.value), "yyyyMMdd")
                this.datePipe.transform(new Date(event), "yyyyMMdd")
              ) {
                let currentStartHr = currentDate.getHours(),
                  currentStartMin = currentDate.getMinutes(),
                  currentTime = currentStartHr * 60 + currentStartMin;
                this.providerAvailiabilitySlots.forEach((slot: { isAvailable: boolean; startTime: string; endTime: string; isPassed: boolean; }) => {
                  if (slot.isAvailable == true) {
                    let selStart = slot.startTime.split(" ");
                    let selStartTime = selStart[0];
                    let selStartHr = +selStartTime.split(":")[0];
                    let selHrMin =
                      selStart[1] == "AM"
                        ? selStartHr * 60
                        : selStartHr == 12
                        ? selStartHr * 60
                        : (selStartHr + 12) * 60;
                    let selStartMin = +selHrMin + +selStartTime.split(":")[1];

                    let selEnd = slot.endTime.split(" ");
                    let selEndTime = selEnd[0];
                    let selEndHr = +selEndTime.split(":")[0];
                    let selEndHrMin =
                      selEnd[1] == "AM"
                        ? selEndHr * 60
                        : selEndHr == 12
                        ? selEndHr * 60
                        : (selEndHr + 12) * 60;
                    let selEndMin = +selEndHrMin + +selEndTime.split(":")[1];
                    if (
                      currentTime >= selStartMin &&
                      (currentTime >= selEndMin || currentTime < selEndMin)
                    ) {
                      slot.isPassed = true;
                      slot.isAvailable = false;
                      //slots = slots.filter((_, index) => index !== foundIndex);
                    }
                  }
                });
              }
            });
        }
      });
    this.confirmation.date = event;
    return
    //  this.getFollowUpDetail(selDate)
  }

  getIsTimeAvailable(slottime: any, currenttime: any) {
    ////debugger;
    if (slottime < currenttime) {
      if (this.getCurrentTime(slottime) < this.getCurrentTime(currenttime)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  getCurrentTime(obj: any) {
    let slotCurrentHr = obj.getHours(),
      slotCurrentMin = obj.getMinutes(),
      slotCurrentMinTime = this.parseCurrentTime(
        slotCurrentHr + ":" + slotCurrentMin
      );
    return slotCurrentMinTime;
  }
  parseCurrentTime(s:any) {
    let c = s.split(":");
    return parseInt(c[0]) * 60 + parseInt(c[1]);
  }

  // getFollowUpDetail(appointmentDate: any) {

  //   // var appointmentDate= this.datePipe.transform(this.firstFormGroup.get('appointmentDate').value, 'MM/dd/yyyy');
  //   this.schedulerService.GetLastPatientFollowupWithCurrentPovider(this.patient, this.staffId, appointmentDate, true).subscribe(res => {

  //     if (res.statusCode == 200) {
  //       this.lastFollowup = res.data;
  //       if (this.lastFollowup) {
  //         var futureDate = new Date(this.lastFollowup.startDateTime);
  //         futureDate.setDate(futureDate.getDate() + this.userInfo.followUpDays);
  //         //  futureDate.setDate(futureDate.getDate() + this.userInfo.followUpDays);
  //         if (futureDate >= new Date())
  //           this.notifierService.notify("warning", "You can book a followup appointment between dates " + this.datePipe.transform(this.lastFollowup.startDateTime, 'MM/dd/yyyy') + ' and ' + this.datePipe.transform(futureDate, 'MM/dd/yyyy') + ' with discounted price ' + this.userInfo.followUpPayRate);
  //       }
  //     }
  //   });
  // }

  onSlotSelect = (slot: any) => {
    this.confirmation.type = "New";
    var index = this.providerAvailiabilitySlots.findIndex(
      (x: { isSelected: boolean; }) => x.isSelected == true
    );
    if (index != -1) {
      this.providerAvailiabilitySlots[index].isSelected = false;
      this.providerAvailiabilitySlots[index].isAvailable = true;
    }
    // this.providerAvailiabilitySlots.forEach(slot => {
    //   slot.isSelected = false;

    // });
    this.confirmation.startTime = slot.startTime;
    this.confirmation.endTime = slot.endTime;
    slot.isSelected = true;
    slot.isAvailable = false;
  };

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

  onTypeChange(type: any) {
    this.confirmation.type = type;
    this.IsPreviousFollowup = true;
    if (type.toLowerCase() == "follow-up") {
      var appointmentDate = this.datePipe.transform(
        this.firstFormGroup.get("appointmentDate")!.value,
        'MM/dd/yyyy'
      );
      // this.schedulerService.GetLastPatientFollowupWithCurrentPovider(this.patient, this.staffId, appointmentDate, false).subscribe(res => {

      //   if (res.statusCode == 200) {
      //     this.lastFollowupData = res.data;
      //     if (this.lastFollowupData) {
      //       this.IsPreviousFollowup = true;
      //     }
      //     else {
      //       this.IsPreviousFollowup = false;
      //     }
      //   }
      // });

      this.IsPreviousFollowup = false;
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.symptoms.push({
      id: event.option.value.id,
      value: event.option.viewValue,
      choice_id: "present",
    });
    //this.optionChecked=true;
    this.userInput.nativeElement.value = event.option.viewValue;
    this.userControl.setValue(event.option.viewValue);
  }

  bookNewFreeAppointment(tokenId: string, paymentMode: string): any {
    this.submitted = true;

    const patientId:any = null;

    if (this.locationId == 0 && this.labData.staffLocationList) {
      this.locationId = this.labData.staffLocationList.find(
        (x: { isDefault: boolean; }) => x.isDefault === true
      ).id;
    }
    const appointmentData:any = [
      {
        PatientAppointmentId: null,
        AppointmentTypeID: null,
        AppointmentStaffs: [{ StaffId: this.labData.labId }],
        PatientID: null,
        locationId:
          this.labData.locationID == 0 || this.labData.locationID == null
            ? 101
            : this.labData.locationID,
        ServiceLocationID: this.locationId || null,
        StartDateTime: getDateTimeString(
          this.confirmation.date,
          this.convertHours(this.confirmation.startTime)
        ),
        EndDateTime: getDateTimeString(
          this.confirmation.date,
          this.convertHours(this.confirmation.endTime)
        ),
        // IsTelehealthAppointment: true,
        IsTelehealthAppointment:
          this.confirmation.mode == "Online" ? true : false,
        IsExcludedFromMileage: true,
        IsDirectService: true,
        Mileage: null,
        DriveTime: null,
        latitude: 0,
        longitude: 0,
        Notes: this.formGroup3["Notes"].value,
        IsRecurrence: false,
        RecurrenceRule: null,
        Mode: this.confirmation.mode,
        Type: this.confirmation.type,
        // PayRate: this.userInfo.payRate,
        // PayRate: this.confirmation.mode=="Online"?this.userInfo.payRate:this.userInfo.ftFpayRate ,
        PayRate: 0.0,
        PaymentToken: tokenId,
        PaymentMode: paymentMode,
        IsBillable: true,
        AppointmentBookingFor: "LAB",
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
        this.submitted = false;
        if (response.statusCode === 200) {
          this.isNotBooked = false;
          //this.notifierService.notify("success", response.message);
          this.Message = {
            title: "Success!",
            message:
              "Thank you, Your appointment has been successfully booked with us, please contact administation for further assistance.",
            imgSrc: "../assets/img/user-success-icon.png",
          };

          if (
            localStorage.getItem("reportObject") != null &&
            localStorage.getItem("reportObject") != undefined
          ) {
            var object = JSON.parse(localStorage.getItem("reportObject")!);
            localStorage.removeItem("reportObject");
            if (object != null && object != undefined) {
              object.patientId = response.data;
              this.schedulerService
                .SaveSymptomatePatientReport(JSON.stringify(object))
                .subscribe((result: any) => {});
            }
          }

          //this.dialogModalRef.close("SAVE");
          // this.saveDocuments(response.data);
        } else {
          this.notifierService.notify("error", response.message);
        }
      });
  }

  openCheckout() {
    if (this.istermsconditionchecked) {
      let _amount = 0;
      if (
        this.confirmation.type == "New" &&
        this.confirmation.mode == "Online"
      ) {
        _amount = this.labData.payRate;
      } else if (
        this.confirmation.type == "New" &&
        this.confirmation.mode == "Face to Face"
      ) {
        _amount = this.labData.ftFpayRate;
      } else if (
        this.confirmation.type == "New" &&
        this.confirmation.mode == "Home Visit"
      ) {
        _amount = this.labData.homeVisitPayRate;
      } else if (
        this.confirmation.type.toLowerCase() == "follow-up" &&
        this.newfollowupfees == false
      ) {
        if (!this.IsPreviousFollowup) {
          return;
        }
        _amount = this.labData.followUpPayRate;
      }

      if (!_amount || _amount === 0 || _amount == 0.0) {
        this.bookNewFreeAppointment("", "Free");
      } else {
        this.schedulerService
          .checkoutPaymentForAppointment(_amount + "")
          .subscribe((response: any) => {
            console.log("payment = > ", response);
            const script = document.createElement("script");

            script.src = `https://test.oppwa.com/v1/paymentWidgets.js?checkoutId=${response.id}`;
            script.async = true;

            document.body.appendChild(script);
            this.SaveBookNewAppointmentDatainLocalstorage("HyperPay");
            this.saveDocuments(response.apptId);

            this.openHyperPay(response.id);
          });
      }
    } else {
      this.showselecttermscondition = true;
    }
  }

  openHyperPay(id:any) {
    let dbModal;
    dbModal = this.dialogModal.open(HyperPayComponent, {
      hasBackdrop: true,
      width: "20%",
      data: {
        id: id,
        isUrgent: false,
      },
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result != null && result != "close") {
      }
    });
  }

  saveDocuments(apptId: number) {
    ///Please chnage this API to avoid loops
    this.local_apptid = apptId;
    if (this.fileList.length > 0) {
      let formValues = {
        base64: this.fileList,
        documentTitle: this.uploadImageData.documentTitle,
        documentTypeIdStaff: this.uploadImageData.documentTypeIdStaff,
        expiration: this.uploadImageData.expiration,
        key: this.uploadImageData.key,
        documentTypeId: this.uploadImageData.documentTypeId,
        otherDocumentType: this.uploadImageData.otherDocumentType,
        userId: 0,
        patientAppointmentId: apptId,
      };
      let dic: any[] = [];
      formValues.base64.forEach((element: { data: string; ext: any; }, index: any) => {
        dic.push(
          `"${element.data.replace(
            /^data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,/,
            ""
          )}": "${element.ext}"`
        );
      });
      let newObj = dic.reduce((acc, cur, index) => {
        acc[index] = cur;
        return acc;
      }, {});
      formValues.base64 = newObj;
      this.submitted = true;
      this.userService
        .uploadUserDocuments(formValues)
        .subscribe((response: ResponseModel) => {
          this.submitted = false;
          if (response != null && response.statusCode == 200) {
            localStorage.setItem(
              "preAppointmentDataDocs",
              JSON.stringify(response.data)
            );

            //this.notifier.notify('success', response.message);
            //this.closeDialog("save");
          } else this.notifierService.notify("error", response.message);
        });
    } else {
      //this.notifier.notify('error', "Please add atleast one file");
    }
  }

  SaveBookNewAppointmentDatainLocalstorage(paymentMode: string): any {
    //////debugger;
    this.submitted = true;

    const patientId:any = null;

    let _amount = 0;
    if (this.confirmation.type == "New" && this.confirmation.mode == "Online") {
      _amount = this.labData.payRate;
    } else if (
      this.confirmation.type == "New" &&
      this.confirmation.mode == "Face to Face"
    ) {
      _amount = this.labData.ftFpayRate;
    } else if (
      this.confirmation.type == "New" &&
      this.confirmation.mode == "Home Visit"
    ) {
      _amount = this.labData.homeVisitPayRate;
    } else if (this.confirmation.type.toLowerCase() == "follow-up") {
      if (!this.IsPreviousFollowup) {
        return;
      }
      _amount = this.labData.followUpPayRate;
    }

    this.locationId = this.labData.locationID;

    const appointmentData:any = [
      {
        PatientAppointmentId: null,
        AppointmentTypeID: null,
        AppointmentStaffs: [{ StaffId: this.labData.labId }],
        PatientID: null,
        ServiceLocationID: this.locationId || null,
        StartDateTime: getDateTimeString(
          this.confirmation.date,
          this.confirmation.startTime
        ),
        EndDateTime: getDateTimeString(
          this.confirmation.date,
          this.confirmation.endTime
        ),
        //IsTelehealthAppointment: true,
        IsTelehealthAppointment:
          this.confirmation.mode == "Online" ? true : false,
        IsExcludedFromMileage: true,
        IsDirectService: true,
        Mileage: null,
        DriveTime: null,
        latitude: 0,
        longitude: 0,
        //Notes: this.formGroup3.Notes.value,
        Notes: this.userControl.value,
        IsRecurrence: false,
        RecurrenceRule: null,
        Mode: this.confirmation.mode,
        Type: this.confirmation.type,
        //PayRate: this.userInfo.payRate,
        PayRate: _amount,
        PaymentToken: "",
        PaymentMode: paymentMode,
        IsBillable: true,
        IsNotify: this.isNotify,
        AppointmentBookingFor: "LAB",
      },
    ];
    const queryParams = {
      IsFinish: !appointmentData[0].RecurrenceRule,
      isAdmin: false,
    };
    localStorage.setItem(
      "preAppointmentData",
      JSON.stringify(appointmentData[0])
    );
  }
}
