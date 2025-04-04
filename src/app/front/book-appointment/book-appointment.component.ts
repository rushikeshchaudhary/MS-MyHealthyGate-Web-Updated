import { SchedulerService } from "./../../platform/modules/scheduling/scheduler/scheduler.service";
import { FollowupAppointmentComponent } from "./../../shared/followup-appointment/followup-appointment.component";
//import { ClientsService } from "src/app/platform/modules/agency-portal/clients/clients.service";
import { UsersService } from "src/app/platform/modules/agency-portal/users/users.service";
import { Router } from "@angular/router";
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatChipInputEvent } from '@angular/material/chips';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  Inject,
  Renderer2,
  ViewChild,
  ElementRef,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { HomeService } from "src/app/front/home/home.service";
import { CommonService } from "src/app/platform/modules/core/services";
import {
  StaffAward,
  StaffQualification,
  StaffExperience,
} from "src/app/front/doctor-profile/doctor-profile.model";
import { NotifierService } from "angular-notifier";
import { format } from "date-fns";
import { map, startWith, switchMap } from "rxjs/operators";
import { ResponseModel } from "src/app/platform/modules/core/modals/common-model";
import { DatePipe, DOCUMENT } from "@angular/common";
import { LoginUser } from "src/app/platform/modules/core/modals/loginUser.modal";
import { TermsConditionModalComponent } from "../terms-conditions/terms-conditions.component";
import { SaveDocumentComponent } from "../save-document/save-document.component";
import { Observable, of } from "rxjs";
import { SymptomCheckerService } from "src/app/shared/symptom-checker/symptom-checker.service";
import { HyperPayComponent } from "src/app/shared/hyper-pay/hyper-pay.component";
//import { StripeToken, StripeSource } from "stripe-angular";
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
  selector: "app-book-appointment",
  templateUrl: "./book-appointment.component.html",
  styleUrls: ["./book-appointment.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class BookAppointmentComponent implements OnInit {
  submitted: boolean = false;
  uploadImageData:any;
  todayDate: Date = new Date();
  isLinear = false;
  patient: any;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  lastSelectedEvent: any;
  thirdFormGroup!: FormGroup;
  userInfo: any;
  fullname!: string;
  staffAwards: Array<StaffAward> = [];
  staffQualifications: Array<StaffQualification> = [];
  staffExperiences: Array<StaffExperience> = [];
  staffTaxonomy: any[] = [];
  tabs: any = [];
  staffSpecialities: any[] = [];
  staffServices: any[] = [];
  staffId: number;
  providerId: string;
  lastFollowupData: any;
  lastFollowup: any;
  IsPreviousFollowup: boolean = false;
  // appointmenType: any = ["New", "Followup", "Free"];
  //appointmenType: any = ["New", "Free"];
  appointmenType: any = ["New", "Follow-up"];
  appointmentMode: any = ["Online", "Face to Face", "Home Visit"];
  confirmation: any = { type: "New", mode: "Online" };
  providerAvailiabilitySlots: any = [];
  patientAppointments: any;
  staffAvailability: any;
  locationId: number;
  showLoader: boolean = false;
  providerAvailableDates: any = [];
  providerNotAvailableDates: any = [];

  masterPatientLocation: Array<any>;
  masterStaffs: Array<any>;
  masterAddressTypes: Array<any>;
  officeAndPatientLocations: Array<any>;
  masterAppointmentTypes: Array<any>;
  Organization: any;
  patientEmail!: string;
  paymentToken: string = "";
  Message: any;
  isNotBooked!: boolean;
  isProfileLoaded: boolean = false;
  //Notes: string = "";
  fileList: any = [];
  dataURL: any;
  // feeSettings: ManageFeesRefundsModel;
  hasPreviousNewMeeting = false;
  isNotify = false;
  showselecttermscondition: boolean = false;
  istermsconditionchecked: boolean = false;
  local_apptid!: number;
  userControl = new FormControl();
  filteredSymptoms$!: Observable<any[]>;
  symptoms: any = [];
  age: any;
  startTime:any;
  endTime:any;
  //Variable for  check which followup fees apply
  newfollowupfees: boolean = false;
  @ViewChild("userInput")
  userInput!: ElementRef<HTMLInputElement>;
  @ViewChild("auto")
  matAutocomplete!: MatAutocomplete;
  appointmentModeId!: number;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private route: Router,
    private dialogModalRef: MatDialogRef<BookAppointmentComponent>,
    private _formBuilder: FormBuilder,
    private homeService: HomeService,
    private commonService: CommonService,
    private notifierService: NotifierService,
    private usersService: UsersService,
    private schedulerService: SchedulerService,
    private datePipe: DatePipe,
    private renderer2: Renderer2,
    private dialogModal: MatDialog,
    private userService: UsersService,
    private notifier: NotifierService,
    private symptomCheckerService: SymptomCheckerService,
    private translate: TranslateService,
    @Inject(DOCUMENT) private _document:any
  ) {
    translate.setDefaultLang(localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.staffId = data.staffId;
    this.userInfo = data.userInfo;
    this.locationId = data.locationId;
    this.providerId = data.providerId;
    this.age = data.age;

    dialogModalRef.disableClose = true;
    this.masterStaffs = [];
    this.masterPatientLocation = [];
    this.masterAppointmentTypes = [];
    this.masterAddressTypes = [];
    this.officeAndPatientLocations = [];
    // this.filteredSymptoms$ = this.userControl.valueChanges.pipe(
    //   startWith(""),
    //   // use switch map so as to cancel previous subscribed events, before creating new once
    //   switchMap((value) => {
    //     if (value != null && typeof value == "string") {
    //       if (value.length > 2) {
    //         return this.getPatientSymptoms(value).pipe();
    //       } else {
    //         // if no value is present, return null
    //         return of(null);
    //       }
    //     } else return of(null);
    //   })
    // );
  }

  ngOnInit() {
    this.Message = null;
    this.isNotBooked = true;
    this.homeService.getOrganizationDetail().subscribe((response) => {
      if (response.statusCode == 200) {
        this.Organization = response.data;
      }
    });

    this.commonService.loginUser.subscribe((user: LoginUser) => {
      if (user.data) {
        this.patient = user.data.id;

        const userRoleName =
          user.data.users3 && user.data.users3.userRoles.userType;
        if ((userRoleName || "").toUpperCase() === "CLIENT") {
          this.patientEmail = user.patientData.email;
        }
      }
    });
    const s = this.renderer2.createElement("script");
    s.type = "text/javascript";
    s.src = "https://checkout.stripe.com/checkout.js";
    s.text = ``;
    this.renderer2.appendChild(this._document.body, s);
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

    if (this.providerId != "") {
      this.getStaffDetail();
      this.getLastNewAppointment(this.providerId);
    } else {
      this.bindStaffProfile();
    }
    if (this.locationId > 0) {
      if (this.data.selectedDate) {
        this.onDateChange(this.data.selectedDate);
        this.firstFormGroup
          .get("appointmentDate")!
          .setValue(this.data.selectedDate);
      } else {
        this.onDateChange(Date());
        this.firstFormGroup.get("appointmentDate")!.setValue(Date());
      }
      // this.getProvidersFollowUpDaysAllowed(this.providerId);
    }
  }

  /*Stripe Start */
  openCheckout() {
    if (this.istermsconditionchecked) {
      let _amount = 0;
      if (
        this.confirmation.type == "New" &&
        this.confirmation.mode == "Online"
      ) {
        _amount = this.userInfo.payRate;
      } else if (
        this.confirmation.type == "New" &&
        this.confirmation.mode == "Face to Face"
      ) {
        _amount = this.userInfo.ftFpayRate;
      } else if (
        this.confirmation.type == "New" &&
        this.confirmation.mode == "Home Visit"
      ) {
        _amount = this.userInfo.homeVisitPayRate;
      }
      // newfollowupfees is not set in anywhere in the code
      // else if (this.confirmation.type.toLowerCase() == 'follow-up' && this.newfollowupfees) {
      //   if (!this.IsPreviousFollowup) {
      //     return;
      //   }
      //   _amount = this.userInfo.followUpPayRate;
      // }
      else if (
        this.confirmation.type.toLowerCase() == "follow-up" &&
        this.newfollowupfees == false
      ) {
        if (!this.IsPreviousFollowup) {
          return;
        }
        _amount = this.userInfo.followUpPayRate;
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
        // if(this.confirmation.type!="Free")
        // {
        // var handler = (<any>window).StripeCheckout.configure({
        //   key: this.Organization.stripeKey,
        //   locale: "auto",
        //   token: function (token: any) {
        //     //console.log(token);
        //     if (token.id != "") {
        //       localStorage.setItem("payment_token", token.id);
        //       //this.book(token.id);
        //     }
        //     // You can access the token ID with `token.id`.
        //     // Get the token ID to your server-side code for use.
        //   }
        // });

        // handler.open({
        //   name: this.Organization.organizationName,
        //   description: this.Organization.description,
        //   image: this.Organization.logo,
        //   //amount: this.userInfo.payRate * 100,
        //   amount: _amount * 100,
        //   currency: "inr",
        //   email: this.patientEmail,
        //   closed: () => {
        //     this.paymentToken = localStorage.getItem("payment_token");
        //     localStorage.setItem("payment_token", "");
        //     if (this.paymentToken != "")
        //       this.bookNewAppointment(this.paymentToken, "Stripe");
        //   }
        // });
      }
      // }
      // else{
      //   this.bookNewFreeAppointment("", "Free");
      // }
    } else {
      this.showselecttermscondition = true;
    }
  }
  openHyperPay(id: any) {
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
  /*Stripe End */
  get formGroup1() {
    return this.firstFormGroup.controls;
  }
  get formGroup3() {
    return this.thirdFormGroup.controls;
  }

  onSlotSelect(slot: any) {
    console.log(slot);
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

    // this.startTime=slot.startTimeftm;
    // this.endTime=slot.endTimeftm;
    this.startTime = slot.startTimeftm
      .replace(":00", "")
      .replace("AM", "")
      .replace("PM", "")
      .trim();
    this.endTime = slot.endTimeftm
      .replace(":00", "")
      .replace("AM", "")
      .replace("PM", "")
      .trim();
    this.confirmation.startTime = slot.startTime;
    this.confirmation.endTime = slot.endTime;
    slot.isSelected = true;
    slot.isAvailable = false;

    console.log(this.confirmation);
  }

  onDateChange(event: any):any {
    this.lastSelectedEvent = event;
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
    //let interval = 30;
    // let interval = this.userInfo.timeInterval;
    const filterModal = {
      locationIds: this.locationId,
      // fromDate: format(event.value, "yyyy-MM-dd"),
      // toDate: format(event.value, "yyyy-MM-dd"),
      fromDate: format(event, "yyyy-MM-dd"),
      toDate: format(event, "yyyy-MM-dd"),
      staffIds: this.staffId,
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
    // let dayName = days[new Date(event.value).getDay()];
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
        this.staffId,
        this.locationId,
        selDate,
        this.appointmentModeId
      )
      .subscribe((response: ResponseModel) => {
        let availibiltyResponse = response;
        if (response.statusCode == 200) {
          this.schedulerService
            .getListData(filterModal)
            .subscribe((response: any) => {
              this.showLoader = false;
              if (response.statusCode == 200) {
                this.patientAppointments = response.data;
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
                    clientAppointments.push({
                      startTime: startTime,
                      endTime: endTime,
                      statusName: app.statusName,
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
              if (clientAppointments.length > 0) {
                clientAppointments.forEach((slot) => {
                  let status = (slot.statusName as string).toLowerCase();
                  if ((slot.statusName as string).toLowerCase() != "cancel") {
                    const foundIndex =
                      this.providerAvailiabilitySlots.findIndex(
                        (x: { startTime: any; endTime: any; }) =>
                          x.startTime == slot.startTime &&
                          x.endTime == slot.endTime
                      );
                    if (foundIndex != -1) {
                      this.providerAvailiabilitySlots[foundIndex].isAvailable =
                        false;
                      this.providerAvailiabilitySlots[foundIndex].isReserved =
                        true;
                      //slots = slots.filter((_, index) => index !== foundIndex);
                    }
                  }
                });
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
    // this.confirmation.date = event.value;
    this.confirmation.date = event;
    this.getFollowUpDetail(selDate);
    return
  }
  getIsTimeAvailable(slottime: any, currenttime: any) {
    //////debugger
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

  pad(str:any, max:any) :any{
    str = str.toString();
    return str.length < max ? this.pad("0" + str, max) : str;
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

  onTypeChange(type: any) {
    this.confirmation.type = type;
    this.IsPreviousFollowup = true;
    if (type.toLowerCase() == "follow-up") {
      var appointmentDate = this.datePipe.transform(
        this.firstFormGroup.get("appointmentDate")!.value,
        'MM/dd/yyyy'
      );
      this.schedulerService
        .GetLastPatientFollowupWithCurrentPovider(
          this.patient,
          this.staffId,
          appointmentDate,
          false
        )
        .subscribe((res) => {
          if (res.statusCode == 200) {
            this.lastFollowupData = res.data;
            if (this.lastFollowupData) {
              this.IsPreviousFollowup = true;
            } else {
              this.IsPreviousFollowup = false;
            }
          }
        });
    }
    if (this.lastSelectedEvent) {
      this.onDateChange(this.lastSelectedEvent);
    }
  }
  getFollowUpDetail(appointmentDate: any) {
    // var appointmentDate= this.datePipe.transform(this.firstFormGroup.get('appointmentDate').value, 'MM/dd/yyyy');
    this.schedulerService
      .GetLastPatientFollowupWithCurrentPovider(
        this.patient,
        this.staffId,
        appointmentDate,
        true
      )
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.lastFollowup = res.data;
          if (this.lastFollowup) {
            var futureDate = new Date(this.lastFollowup.startDateTime);
            futureDate.setDate(
              futureDate.getDate() + this.userInfo.followUpDays
            );
            //  futureDate.setDate(futureDate.getDate() + this.userInfo.followUpDays);
            if (futureDate >= new Date())
              this.notifierService.notify(
                "warning",
                "You can book a followup appointment between dates " +
                  this.datePipe.transform(
                    this.lastFollowup.startDateTime,
                    'MM/dd/yyyy'
                  ) +
                  " and " +
                  this.datePipe.transform(futureDate, 'MM/dd/yyyy') +
                  " with discounted price " +
                  this.userInfo.followUpPayRate
              );
          }
        }
      });
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
  onModeChange(mode: any) {
    this.confirmation.mode = mode;
    switch (mode.toLowerCase()) {
      case "online":
        break;
    }
    if (this.lastSelectedEvent) {
      this.onDateChange(this.lastSelectedEvent);
    }
  }
  bindStaffProfile() {
    this.staffAwards = this.userInfo.staffAwardModels;
    this.staffExperiences = this.userInfo.staffExperienceModels;
    this.staffQualifications = this.userInfo.staffQualificationModels;
    this.staffTaxonomy = this.userInfo.staffTaxonomyModel;
    this.staffSpecialities = this.userInfo.staffSpecialityModel;
    this.staffTaxonomy = this.userInfo.staffTaxonomyModel;
    this.staffServices = this.userInfo.staffServicesModels;
    this.fullname = this.commonService.getFullName(
      this.userInfo.firstName,
      this.userInfo.middleName,
      this.userInfo.lastName
    );
    if (this.locationId == 0 && this.userInfo.staffLocationList) {
      this.locationId = this.userInfo.staffLocationList.find(
        (x: { isDefault: boolean; }) => x.isDefault === true
      ).id;
    }
    this.isProfileLoaded = true;
  }
  getStaffDetail() {
    if (this.providerId != "") {
      this.homeService.getProviderDetail(this.providerId).subscribe((res) => {
        if (res.statusCode == 200) {
          this.userInfo = res.data;
          //providerCancellationRules
          this.bindStaffProfile();
        }
      });
    }
  }
  closeDialog(action: string): void {
    this.dialogModalRef.close(action);
    //location.reload();
  }

  jumpwaitingroom() {
    this.dialogModalRef.close("close");
    this.route.navigate(["/web/waiting-room/reshedule/" + this.local_apptid]);
  }

  SaveBookNewAppointmentDatainLocalstorage(paymentMode: string): any {
    this.submitted = true;

    const patientId:any = null;

    let _amount = 0;
    if (this.confirmation.type == "New" && this.confirmation.mode == "Online") {
      _amount = this.userInfo.payRate;
    } else if (
      this.confirmation.type == "New" &&
      this.confirmation.mode == "Face to Face"
    ) {
      _amount = this.userInfo.ftFpayRate;
    } else if (
      this.confirmation.type == "New" &&
      this.confirmation.mode == "Home Visit"
    ) {
      _amount = this.userInfo.homeVisitPayRate;
    } else if (
      this.confirmation.type.toLowerCase() == "follow-up" &&
      this.confirmation.mode == "Online"
    ) {
      if (!this.IsPreviousFollowup) {
        return;
      }
      _amount = this.userInfo.followUpPayRate;
    } else if (
      this.confirmation.type.toLowerCase() == "follow-up" &&
      this.confirmation.mode == "Face to Face"
    ) {
      if (!this.IsPreviousFollowup) {
        return;
      }
      _amount = this.userInfo.ftfFollowUpPayRate;
    } else if (
      this.confirmation.type.toLowerCase() == "follow-up" &&
      this.confirmation.mode == "Home Visit"
    ) {
      if (!this.IsPreviousFollowup) {
        return;
      }
      _amount = this.userInfo.homeVisitFollowUpPayRate;
    }

    if (this.locationId == 0 && this.userInfo.staffLocationList) {
      this.locationId = this.userInfo.staffLocationList.find(
        (x: { isDefault: boolean; }) => x.isDefault === true
      ).id;
    }
    const appointmentData:any = [
      {
        PatientAppointmentId: null,
        AppointmentTypeID: null,
        AppointmentStaffs: [{ StaffId: this.staffId }],
        PatientID: null,
        ServiceLocationID: this.locationId || null,
        StartDateTime: getDateTimeString(
          this.confirmation.date,
          this.convertHours(this.confirmation.startTime)
        ),
        EndDateTime: getDateTimeString(
          this.confirmation.date,
          this.convertHours(this.confirmation.endTime)
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
        providerId: this.providerId,
        AppointmentBookingFor: "DOCTOR",
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

  bookNewAppointment(tokenId: string, paymentMode: string): any {
    ////////debugger;
    this.submitted = true;

    const patientId:any = null;

    let _amount = 0;
    if (this.confirmation.type == "New" && this.confirmation.mode == "Online") {
      _amount = this.userInfo.payRate;
    } else if (
      this.confirmation.type == "New" &&
      this.confirmation.mode == "Face to Face"
    ) {
      _amount = this.userInfo.ftFpayRate;
    } else if (
      this.confirmation.type == "New" &&
      this.confirmation.mode == "Home Visit"
    ) {
      _amount = this.userInfo.homeVisitPayRate;
    } else if (this.confirmation.type.toLowerCase() == "follow-up") {
      if (!this.IsPreviousFollowup) {
        return;
      }
      _amount = this.userInfo.followUpPayRate;
    }

    if (this.locationId == 0 && this.userInfo.staffLocationList) {
      this.locationId = this.userInfo.staffLocationList.find(
        (x: { isDefault: boolean; }) => x.isDefault === true
      ).id;
    }
    const appointmentData:any = [
      {
        PatientAppointmentId: null,
        AppointmentTypeID: null,
        AppointmentStaffs: [{ StaffId: this.staffId }],
        PatientID: null,
        ServiceLocationID: this.locationId || null,
        StartDateTime: getDateTimeString(
          this.confirmation.date,
          this.convertHours(this.confirmation.startTime)
        ),
        EndDateTime: getDateTimeString(
          this.confirmation.date,
          this.convertHours(this.confirmation.endTime)
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
        PaymentToken: tokenId,
        PaymentMode: paymentMode,
        IsBillable: true,
        IsNotify: this.isNotify,
      },
    ];
    const queryParams = {
      IsFinish: !appointmentData[0].RecurrenceRule,
      isAdmin: false,
    };

    this.createAppointmentFromPatientPortal(appointmentData[0]);
  }

  createAppointmentFromPatientPortal(appointmentData: any) {
    debugger
    console.log(appointmentData,"appointmentData")
    this.schedulerService
      .bookNewAppointmentFromPatientPortal(appointmentData)
      .subscribe((response) => {
        this.submitted = false;
        if (response.statusCode === 200) {
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
          this.isNotBooked = false;
          //this.notifierService.notify("success", response.message);
          this.Message = {
            title: "Success!",
            message:
              "Thank you, Your request has been successfully received, please contact administation for further assistance.",
            imgSrc: "../assets/img/user-success-icon.png",
          };
          //this.dialogModalRef.close("SAVE");
          this.saveDocuments(response.data);
        } else {
          this.notifierService.notify("error", response.message);
        }
      });
  }

  bookNewFreeAppointment(tokenId: string, paymentMode: string): any {
    this.submitted = true;
    // if (this.appointmentForm.invalid) {
    //   this.submitted = false;
    //   return;
    // }

    // submit form
    // const selectedStaffs = this.appointmentForm.get("StaffIDs").value,
    //   selectedAppointmentTypeId = this.appointmentForm.get("AppointmentTypeID")
    //     .value,
    //   selectedPatientId = this.appointmentForm.get("PatientID").value,
    //   startDate = this.appointmentForm.get("startDate").value,
    //   startTime = this.appointmentStartTime, // this.appointmentForm.get('startTime').value,
    //   endTime = this.appointmentEndTime; // this.appointmentForm.get('endTime').value;

    // let appointmentStaffs = null;
    // let staffIds = Array.isArray(selectedStaffs)
    //   ? selectedStaffs
    //   : [selectedStaffs];
    // appointmentStaffs = (this.appointmentModal.appointmentStaffs || []
    // ).map(Obj => {
    //   return { StaffId: Obj.staffId, IsDeleted: true };
    // });
    // staffIds.forEach(staffId => {
    //   // update case for appointment staffs ------
    //   let staff = appointmentStaffs.find(
    //     Obj => Obj.StaffId === staffId && Obj.IsDeleted
    //   );
    //   if (staff) {
    //     let index = appointmentStaffs.indexOf(staff);
    //     appointmentStaffs[index] = { StaffId: staff.StaffId, IsDeleted: false };
    //   } else {
    //     appointmentStaffs.push({ StaffId: staffId, IsDeleted: false });
    //   }
    // });

    // let addressesObj = {
    //   CustomAddressID: null,
    //   CustomAddress: null,
    //   PatientAddressID: null,
    //   OfficeAddressID: null
    // };
    // if (
    //   this.selectedServiceLocation &&
    //   (this.selectedServiceLocation.key || "").toUpperCase() === "OTHER"
    // ) {
    //   addressesObj.CustomAddress = this.appointmentForm.get(
    //     "CustomAddress"
    //   ).value;
    //   addressesObj.CustomAddressID = this.appointmentForm.get(
    //     "CustomAddressID"
    //   ).value;
    // } else if (
    //   this.selectedServiceLocation &&
    //   (this.selectedServiceLocation.key || "").toUpperCase() === "PATIENT"
    // ) {
    //   addressesObj.PatientAddressID = this.selectedServiceLocation.id;
    // } else if (
    //   this.selectedServiceLocation &&
    //   (this.selectedServiceLocation.key || "").toUpperCase() === "OFFICE"
    // ) {
    //   addressesObj.OfficeAddressID = this.selectedServiceLocation.id;
    // }

    const patientId :any= null;
    // selectedPatientId && typeof selectedPatientId === "object"
    //   ? selectedPatientId.id
    //   : null;
    //this.recurrenceRule = this.appointmentId ? "" : this.recurrenceRule;

    if (this.locationId == 0 && this.userInfo.staffLocationList) {
      this.locationId = this.userInfo.staffLocationList.find(
        (x: { isDefault: boolean; }) => x.isDefault === true
      ).id;
    }
    const appointmentData:any = [
      {
        PatientAppointmentId: null,
        AppointmentTypeID: null,
        AppointmentStaffs: [{ StaffId: this.staffId }],
        PatientID: null,
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
        AppointmentBookingFor: "DOCTOR",
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

  openfreeapptCheckout() {
    this.bookNewFreeAppointment("", "Free");
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
  //show:boolean=false;

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

  checkboxchecked(event: { checked: boolean; }) {
    this.isNotify = event.checked;
  }

  handleImageChange() {
    let files: any[] = [];
    this.uploadImageData.base64.map((ele: any) => this.fileList.push(ele));
  }
  removeFile(index: number) {
    this.fileList.splice(index, 1);
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
          } else this.notifier.notify("error", response.message);
        });
    } else {
      //this.notifier.notify('error', "Please add atleast one file");
    }
  }

  // getProvidersFollowUpDaysAllowed(staffId){
  //     this.schedulerService.getStaffFeeSettings(staffId).subscribe(response => {
  //       if (response.statusCode === 200) {
  //         this.feeSettings = response.data as ManageFeesRefundsModel;
  //       }
  //     })
  // }

  // get checkIfAllowed() {
  //   if (this.confirmation.type == 'Followup') {
  //     if (this.userInfo && this.userInfo.followUpDays &&
  //       this.firstFormGroup.controls.appointmentDate.value) {

  //       return this.hasPreviousNewMeeting;
  // const startDate = new Date(this.firstFormGroup.controls.appointmentDate.value);
  // const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  // const diffDates: any = (<any>this.lastAppointmentDateTime - <any>startDate);
  // const diffDays = Math.round(Math.abs((diffDates) / oneDay))
  // if (diffDays > -1 && diffDays <= this.userInfo.followUpDays) {
  //     return true;
  // } else {
  //     return false;
  // }

  //   } else { return false; }
  // } else { return true; }
  // }

  getLastNewAppointment(staffId: any) {
    //////////////debugger
    this.schedulerService
      .getGetLastNewAppointment(staffId)
      .subscribe((response) => {
        if (response.statusCode === 200) {
          this.hasPreviousNewMeeting = response.data ? true : false;
          // if (lastAppointment) {
          //     this.lastAppointmentDateTime = new Date(lastAppointment.startDateTime);
          //     this.hasPreviousNewMeeting = true;
          // }
        }
      });
  }

  closeModal() {
    this.dialogModal.closeAll();
  }

  // getPatientSymptoms(searchText: string = "headache"): any {
  //   return this.symptomCheckerService
  //     .getPatientSymptoms(searchText, this.age)
  //     .pipe(
  //       map((x) => {
  //         return x;
  //       })
  //     );
  // }
  add(event: MatChipInputEvent | any): void {
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
}
