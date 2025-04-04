import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  Renderer2,
} from "@angular/core";
import { CommonService } from "../../../core/services";
import { ResponseModel } from "../../../core/modals/common-model";
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { NotifierService } from "angular-notifier";
import {
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from "angular-calendar";
import { Subject } from "rxjs";
import { DatePipe } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
//import { AvailabilitySlotComponent } from "../availability-slot/availability-slot.component";
import { SchedulerService } from "../../../scheduling/scheduler/scheduler.service";
//import { CalendarEvent } from "../availability-slot/availability-slot.model";
import { AvailabilityDeleteComponent } from "../availability-delete/availability-delete.component";
import { CalendarEvent } from "../availability-slot/availability-slot.model";
import { AvailabilitySlotComponent } from "../availability-slot/availability-slot.component";
// import { ContextMenuComponent, ContextMenuService } from "ngx-contextmenu";
import { ReviewRatingModel } from "../../../client-portal/review-rating/review-rating.model";
import { AppointmentReschedulingDialogComponent } from "src/app/shared/appointment-rescheduling-dialog/appointment-rescheduling-dialog.component";
import { CancelAppointmentDialogComponent } from "../../../scheduling/scheduler/cancel-appointment-dialog/cancel-appointment-dialog.component";
import { AppointmentViewComponent } from "../../../scheduling/appointment-view/appointment-view.component";
import { AppointmentModel } from "../../../scheduling/scheduler/scheduler.model";
import { DialogService } from "src/app/shared/layout/dialog/dialog.service";
import { ActivatedRoute, ParamMap, Params, Router } from "@angular/router";
import { AddNewCallerService } from "src/app/shared/add-new-caller/add-new-caller.service";
import { EncounterService } from "../../encounter/encounter.service";
import { AppService } from "src/app/app-service.service";
import { TextChatService } from "src/app/shared/text-chat/text-chat.service";
import { ClientsService } from "../../clients/clients.service";
import { ChatInitModel } from "src/app/shared/models/chatModel";
import { Location } from "@angular/common";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SetReminderComponent } from "src/app/shared/set-reminder/set-reminder.component";
import { AddNewCallerComponent } from "src/app/shared/add-new-caller/add-new-caller.component";
import { ApproveAppointmentDialogComponent } from "src/app/shared/approve-appointment-dialog/approve-appointment-dialog.component";
import { BookAppointmentByDoctorComponent } from "../book-appointment-by-doctor/book-appointment-by-doctor.component";
import { AddOtherItemsOncalenderComponent } from "../add-other-items-oncalender/add-other-items-oncalender.component";
import { TranslateService } from "@ngx-translate/core";
import { MatMenuTrigger } from "@angular/material/menu";
import { log } from "console";
interface Appointment {
  patientAppointmentId: number;
  patientName?: string;
  color?: string;
  fontColor?: string;
  startDateTime?: string;
  endDateTime?: string;
  cancelTypeId?: number;
  claimId?: number;
  canEdit?: boolean;
  patientEncounterId: number;
  statusName?: string;
  appointmentStaffs?: any;
  isBillable?: boolean;
  isTelehealthAppointment?: boolean;
  patientID: number;
  invitationAppointentId: number;
  invitedStaffs?: any;

  // patientAppointmentId: 4094,
  // "startDateTime":"2018-09-19T12:00:50",
  // "endDateTime":"2018-09-19T13:00:50",
  // "appointmentTypeName":"Appointment Type Test1",
  // "appointmentTypeID":122,
  // "color":"#3e89cf",
  // "fontColor":"#575757",
  // "defaultDuration":0.0,
  // "isBillable":true,
  // "patientName":"Rose Warren",
  // "patientID":733,
  // "patientEncounterId":899,
  // "claimId":555,
  // "canEdit":false,
  // "patientAddressID":764,
  // "serviceLocationID":1,
  // "appointmentStaffs":[{"staffId":170,"staffName":"Stephen Baker","isDeleted":false}],
  // "isClientRequired":true,
  // "isRecurrence":false,
  // "offSet":0,
  // "allowMultipleStaff":false,
  // "cancelTypeId":0,
  // "isExcludedFromMileage":false,
  // "isDirectService":true,
  // "patientPhotoThumbnailPath":"",
  // "statusId":358372,
  // "statusName":"Approved",
  // "address":"4468 Broadway  #55 New York NY US 10040",
  // "latitude":40.857074,
  // "longitude":-73.932058999999981,
  // "isTelehealthAppointment":false
}
const colors: any = {
  red: {
    primary: "#3BC7FB",
    secondary: "#3bc7fbd6",
  },
  blue: {
    primary: "#1e90ff",
    secondary: "#D1E8FF",
  },
  yellow: {
    primary: "#EF8B00",
    secondary: "#fa9f55de",
  },
  green: {
    primary: "#00e900",
    secondary: "#00e900",
  },
  gray: {
    primary: "#000000",
    secondary: "	#c7e5f3",
  },
};

@Component({
  selector: "app-availability",
  templateUrl: "./availability.component.html",
  styleUrls: ["./availability.component.scss"],
})
export class AvailabilityComponent implements OnInit {
  private yesterday!: Date;
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  filterString!: string;
  EVENT_LIMIT = 3;
  patientList: any[] = [];
  selected = "All";
  selectedPatientId: number = 0;
  // contextMenu!: ContextMenuComponent;
  // @ViewChild(ContextMenuComponent) contextMenu!: ContextMenuComponent;
  contextMenuPosition: any = { x: "0", y: "0" };
  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;
  @ViewChild('menuTriggerElement') menuTriggerElement!: ElementRef;
  //openContextMenu: boolean = true;
  modalData!: {
    action: string;
    event: CalendarEvent;
  };
  nextPreviosStatus!: string;
  refresh: Subject<any> = new Subject();
  events!: CalendarEvent[];
  activeDayIsOpen: boolean = true;
  actions: CalendarEventAction[] = [
    {
      label:
        '<i class="fa fa-fw fa-plus " value="bookappointment" style="font-size: medium;"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        // this.events = this.events.filter(iEvent => iEvent !== event);
        this.addAppointment(event);
      },
    },
    {
      label:
        '<i class="fa fa-fw fa-pencil" value="editAvailablity" style="font-size: medium;"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.editAvailabilitySlot(
          event.start,
          event.id,
          event.start,
          event.end,
          event.visitType
        );
      },
    },
    {
      label:
        '<i class="fa fa-fw fa-times" value="deleteAvailablity" style="font-size: medium;"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        // this.events = this.events.filter(iEvent => iEvent !== event);
        this.deleteEvent(event);
      },
    },
  ];
  isRequestFromPatientPortal: any;
  statusColors: any[];
  isWaitingRoomScreen: any;
  schedulerPermissions: any;
  isAdminLogin: any;
  currentLoginUserId: any;
  isvalidDate!: boolean;
  appointId!: number;
  currentAppointmentId: any;
  currentStaff: any;
  currentNotes: any;
  isPending!: boolean;
  reviewRatingModel!: ReviewRatingModel;
  locationId: any;
  currentPatientId: any;
  clientModel: any;

  filteredPatient: any;
  searchPatientForm!: FormGroup;
  filterMasterSearchPatients: any = [];
  prevTodayNext: string = "Today";
  isDashboardFilter: boolean = false;
  dashBookingType: string = "";
  dashBookingMode: string = "";
  selectedAvailibilityDate: any = null;
  isCalendarIconFilter: boolean = false;
  patientId: any = null;
  public menuPosition = { x: '0px', y: '0px' };
  constructor(
    private appointmentDailog: MatDialog,
    private notifierService: NotifierService,
    private dialogService: DialogService,
    public dialogModal: MatDialog,
    private notifier: NotifierService,
    private schedulerService: SchedulerService,
    // private contextMenuService: ContextMenuService,
    private commonService: CommonService,
    private router: Router,
    private addNewCallerService: AddNewCallerService,
    private encounterService: EncounterService,
    private appService: AppService,
    private textChatService: TextChatService,
    private date: DatePipe,
    private cdr: ChangeDetectorRef,
    private clientService: ClientsService,
    private _location: Location,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private renderer: Renderer2
    // private datePipe: DatePipe
  ) {
    translate.setDefaultLang(localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.statusColors = [
      { name: "pending", color: "#74d9ff" },
      { name: "approved", color: "#93ee93" },
      { name: "cancelled", color: "#ff8484" },
      { name: "Accepted", color: "rgb(179, 236, 203)" },
      { name: "Tentative", color: "rgb(253, 209, 100)" },
    ];
  }

  ngOnInit() {
    this.searchPatientForm = this.formBuilder.group({
      searchPatient: [],
    });

    this.events = [];

    this.yesterday = this.addDays(30, new Date());
    var postData = {
      startDate: new Date(),
      endTime: this.addDays(30, new Date()),
    };
    this.commonService.currentLoginUserInfo.subscribe(async (user: any) => {
      if (user) {
        console.log(user);

        if (user.isApprove == false) {
          this.notifier.notify(
            "error",
            "you will be able to add availability once your profile is approved by administrator."
          );
          this._location.back();
        }
        this.route.queryParams.subscribe((params: Params) => {
          if (params["appttype"]) {
            this.isDashboardFilter = true;
            this.dashBookingType = params["appttype"];
            this.dashBookingMode = params["apptmode"];
          }
          if (params["cId"]) {
            this.isCalendarIconFilter = true;
            this.patientId = this.commonService.encryptValue(
              params["cId"],
              false
            );
          }
        });

        this.locationId = user.currentLocationId;
        this.currentLoginUserId = user.id;
        let patientList = await this.getPatientList();
        this.patientList = patientList.data;

        //Calendar Icon Filter in calendar
        if (this.isCalendarIconFilter) {
          this.filteredPatient = { patientId: this.patientId };
          this.filterMasterSearchPatients = this.patientList.filter(
            (x) => x.patientId == this.patientId
          );
          this.searchPatientForm.patchValue({
            searchPatient: this.filterMasterSearchPatients[0].nameWithMRN,
          });
        }
        this.initializeEvents();
      }
    });
  }

  ngAfterViewInit() {
    document.getElementsByClassName("cal-time-events")[0].scrollTop = 800;
  }

  statusChangeHandler = (e: any) => {
    this.filteredPatient = e;
    this.initializeEvents();
    // console.log('selected patient: ', e);
    // //this.selectedPatientId = e.;
    // const getStart: any = {
    //   month: startOfMonth,
    //   week: startOfWeek,
    //   day: startOfDay,
    // }[this.view];

    // const getEnd: any = {
    //   month: endOfMonth,
    //   week: endOfWeek,
    //   day: endOfDay,
    // }[this.view];
    // const filterModal = {
    //   locationIds: "101",
    //   fromDate: format(getStart(this.viewDate), "yyyy-MM-dd"),
    //   toDate: format(getEnd(this.viewDate), "yyyy-MM-dd"),
    //   staffIds: this.currentLoginUserId,
    //   patientIds: e.patientId,
    // };
    // this.fetchAppointments(filterModal);
  };

  getPatientList(): Promise<any> {
    return this.clientService.getAllPatients().toPromise();
    // this.clientService.getAllPatients()
    //   .subscribe((response: any) => {
    //     if (response != null && response.statusCode == 200) {
    //       this.patientList = response.data;
    //     }
    //   });
  }

  getBgClass(index: number, a: any): string {
    if (a.meta.type == "event") {
      return a.meta.visitType == 1
        ? "yellowCellColor"
        : a.meta.visitType == 2
          ? "redCellColor"
          : a.meta.visitType == 3
            ? "blueCellColor"
            : a.meta.visitType == 0
              ? "grayCellColor"
              : "greenCellColor";
    } else if (a.meta.type == "block") {
      return "grayCellColor";
    } else {
      return a.meta.statusName == "Invited"
        ? "pending-appointment-color"
        : a.meta.statusName == "Cancelled"
          ? "cancelled-appointment-color"
          : "";
    }
    // return index % 2 == 0 ? "evenCellColor" : "oddCellColor";
  }

  private initializeEvents() {
    this.showAllEventDaysArray = [];
    var events = <any>[]
    this.events = [];
    const getStart: any = {
      month: startOfMonth,
      week: startOfWeek,
      day: startOfDay,
    }[this.view];

    const getEnd: any = {
      month: endOfMonth,
      week: endOfWeek,
      day: endOfDay,
    }[this.view];

    const filterModal = {
      locationIds: "101",
      fromDate: format(getStart(this.viewDate), "yyyy-MM-dd"),
      toDate: format(getEnd(this.viewDate), "yyyy-MM-dd"),
      staffIds: this.currentLoginUserId,
      patientIds:
        this.filteredPatient != null ? this.filteredPatient.patientId : "",
    };
    this.schedulerService
      .GetProviderAvailability(
        format(getStart(this.viewDate), "yyyy-MM-dd"),
        format(getEnd(this.viewDate), "yyyy-MM-dd")
      )
      .subscribe((response: ResponseModel) => {
        if (response.data.length) {
          response.data.forEach((val: any) => {
            val.providerAvailibilitySlots.forEach((element: any) => {
              var datee = element.date.split("T");
              var startDate = datee[0] + "T" + element.startTimeFtm + ":00";
              var endDate = datee[0] + "T" + element.endTimeFtm + ":00";
              val["type"] = "event";
              element["type"] = "event";

              var index = this.events.findIndex(
                (x) => x.start == new Date(startDate)
              );
              if (index == -1) {
                events.push({
                  id: val.id,
                  title: element.startTimeFtm + "-" + element.endTimeFtm,
                  //color: val.visitType == 1 ? colors.yellow : val.visitType == 2 ? colors.red : val.visitType == 3 ? colors.blue : colors.green,
                  color:
                    element.visitType == 1
                      ? colors.yellow
                      : element.visitType == 2
                        ? colors.red
                        : element.visitType == 3
                          ? colors.blue
                          : colors.green,
                  start: new Date(startDate),
                  end: new Date(endDate),
                  // visitType: val.visitType,
                  actions: this.actions,
                  // meta: val,
                  meta: element,
                  visitType: element.visitType,
                });
              }
            });
            // }
          });
          //sorted slots in ascending order
          //events.sort((a, b) => (a.id - b.id || a.title.localeCompare(b.title)));
          events.sort((a: { start: number; }, b: { start: number; }) => a.start - b.start);
          this.events = events;
          console.log(this.events);
          this.getProviderBlockedTime();
          this.fetchAppointments(filterModal);
        }
      });

    console.log(this.yesterday);
    console.log(this.addHours(0, new Date()));
    console.log(this.addHours(3, new Date()));
  }

  getProviderBlockedTime = () => {
    const getStart: any = {
      month: startOfMonth,
      week: startOfWeek,
      day: startOfDay,
    }[this.view];

    const getEnd: any = {
      month: endOfMonth,
      week: endOfWeek,
      day: endOfDay,
    }[this.view];

    this.schedulerService
      .getProviderBlockCalenderTime(
        format(getStart(this.viewDate), "yyyy-MM-dd"),
        format(getEnd(this.viewDate), "yyyy-MM-dd")
      )
      .subscribe((res: any) => {
        console.log(res);
        if (res.data != null) {
          let eventData: any = [];
          res.data.map((ele: any) => {
            let addEventData = {
              actions: [
                {
                  label:
                    '<i class="fa fa-fw fa-eye" value="viewBlockDetail" style="font-size: medium;"></i>',
                  onClick: ({ event }: { event: CalendarEvent }): void => {
                    this.viewBlockDetail(event);
                  },
                },
                {
                  label:
                    '<i class="fa fa-fw fa-times" value="deleteBlockItem" style="font-size: medium;"></i>',
                  onClick: ({ event }: { event: CalendarEvent }): void => {
                    this.deleteBlockItem(event);
                  },
                },
              ],
              color: {
                primary: "#ff0000",
                secondary: "#ffcccc",
              },
              end: new Date(ele.endDateTime),
              id: ele.id,
              start: new Date(ele.startDateTime),
              title: ele.reserveType,
              visitType: 0,
              details: ele.pageContent,
              meta: {
                id: ele.id,
                startTime: "0001-01-01T00:00:00",
                endTime: "0001-01-01T00:00:00",
                date: new Date(ele.startDateTime),
                isSelected: false,
                startTimeFtm: format(ele.startDateTime, "HH:mm"),
                endTimeFtm: format(ele.endDateTime, "HH:mm"),
                visitType: 0,
                providerAvailabilitySlotMappingId: 0,
                type: "block",
                userName: ele.userName ? ele.userName : "",
              },
            };
            this.events.push(addEventData);

            // eventData.push(addEventData);

            // console.log(this.events);
            this.refresh.next("");
          });

          // console.log(eventData);
        }
      });
  };

  deleteBlockItem = (event: any) => {
    this.dialogService
      .confirm("Are you sure you want to delete this record?")
      .subscribe((result) => {
        if (result == true) {
          this.schedulerService
            .DeleteProviderBlockCalendarApi(event.id)
            .subscribe((res: any) => {
              if (res.statusCode == 200) {
                this.notifier.notify("success", res.message);
                this.initializeEvents();
              } else {
                this.notifier.notify("error", res.message);
              }
            });
        }
      });
    console.log(event);
  };

  viewBlockDetail = (event: any) => {
    console.log(event);
    const modalPopup = this.appointmentDailog.open(
      AddOtherItemsOncalenderComponent,
      {
        hasBackdrop: true,
        data: event,
      }
    );
    modalPopup.afterClosed().subscribe((result) => {
      if (result == "save") {
        this.initializeEvents();
      }
    });
  };
  showAllEventDaysArray: number[] = [];

  openShowAllEvents(day: number) {
    if (!this.showAllEventDaysArray.includes(day))
      this.showAllEventDaysArray.push(day);
  }

  closeShowAllEvents(day: number) {
    const index: number = this.showAllEventDaysArray.indexOf(day);
    if (index !== -1) {
      this.showAllEventDaysArray.splice(index, 1);
    }
  }

  isDayOpened(day: number): boolean {
    return this.showAllEventDaysArray.includes(day) ? true : false;
  }

  addHours(numOfHours: number, date = new Date()) {
    date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);

    return date;
  }

  addDays(numOfdaya: number, date = new Date()) {
    date.setDate(date.getDate() + numOfdaya);

    return date;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    this.selectedAvailibilityDate = date;
    // if (events.length == 0) {
    //   this.selectedAvailibilityDate = date;
    //   //this.handleClickEventOfDay(date);
    // }else{
    //   this.selectedAvailibilityDate = null;
    // }
  }

  weekClicked(event: any) {
    this.selectedAvailibilityDate = event.date;
    //this.handleClickEventOfDay(event.date);
  }

  handleClickEventOfDay(date: any) {
    var currentDate = new Date();

    //set current timing in case of add slot in month view section
    if (this.view === CalendarView.Month) {
      let selectedDate = new Date(date);
      selectedDate.setHours(currentDate.getHours());
      selectedDate.setMinutes(currentDate.getMinutes());
      selectedDate.setSeconds(currentDate.getSeconds());
      selectedDate.setMilliseconds(currentDate.getMilliseconds());
      date = selectedDate;
    }

    if (this.filteredPatient != null) {
      this.notifierService.notify("error", "Please clear patient filter first");
    } else if (this.isDashboardFilter) {
      this.notifierService.notify("error", "Please clear all filters first");
    } else if (this.isCalendarIconFilter) {
      this.notifierService.notify("error", "Please clear all filters first");
    } else if (currentDate <= new Date(date)) {
      this.addAvailabilitySlot(date);
    } else {
      this.notifierService.notify(
        "error",
        "Please select future date or time than current date time"
      );
    }
  }

  toDateString(date: any) {
    return this.date.transform(new Date(date), "dd");
  }
  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    // this.handleEvent('Dropped or resized', event);
  }

  fetchAppointments(filterModal: any):any {
    this.getUserPermissions();
    this.schedulerService
      .getListData(filterModal)
      .subscribe((response: any) => {
        if (response.statusCode !== 200) return [];
        else {
          var data = response.data;
          data = data.filter((s: any) => s.cancelTypeId == 0);
          if (data && data.length == 0) {
            // this.events.splice(0);
            // this.refresh.next();
            if (this.filteredPatient != null) {
              this.refresh.next("");
            }
            if (this.isDashboardFilter) {
              this.refresh.next("");
            }
          } else {
            (data || []).map((appointmentObj: any) => {
              const timeRange = `${format(
                appointmentObj.startDateTime,
                'h:mm a'
              )} `;
              const actions = this.getCalendarActions(appointmentObj);
              const bgColor = (this.statusColors || []).find(
                (x) =>
                  (x.name || "").toUpperCase() ==
                  (appointmentObj.statusName || "").toUpperCase()
              );

              let bookingMode = "";
              if (this.view === CalendarView.Day) {
                bookingMode =
                  appointmentObj.bookingMode != ""
                    ? "(" + appointmentObj.bookingMode + ") "
                    : "";
              } else {
                bookingMode =
                  appointmentObj.bookingMode == "Online"
                    ? "(OL) "
                    : appointmentObj.bookingMode == "Face to Face"
                      ? "(FF) "
                      : appointmentObj.bookingMode == "Home Visit"
                        ? "(HV) "
                        : appointmentObj.bookingMode == "In Person"
                          ? "(IP) "
                          : appointmentObj.bookingMode == "Online and Face To Face"
                            ? "(OLFF) "
                            : "";
              }

              let logo =
                appointmentObj.bookingMode == "Online"
                  ? '<img src="../../../../../../assets/img/online.png" class="img-white" alt=""> '
                  : appointmentObj.bookingMode == "Face to Face"
                    ? '<img src="../../../../../../assets/img/stethoscope.png" class="img-white" alt=""> '
                    : appointmentObj.bookingMode == "Home Visit"
                      ? '<img src="../../../../../../assets/img/home.png" class="img-white" alt=""> '
                      : appointmentObj.bookingMode == "In Person"
                        ? ""
                        : appointmentObj.bookingMode == "Online and Face To Face"
                          ? '<img src="../../../../../../assets/img/online-blue.png" class="img-white" alt=""> '
                          : "";

              // let appointmentTitle = bookingMode + timeRange + (appointmentObj.patientName || "");
              let appointmentTitle =
                bookingMode + (appointmentObj.patientName || "");
              //let setCssClass = appointmentObj.statusName != "Approved" ? "CustomEventAptNotApproved" : "CustomEvent";
              let setCssClass =
                appointmentObj.statusName == "Approved"
                  ? "CustomEvent"
                  : appointmentObj.statusName !== "Cancelled"
                    ? "CustomEventAptNotApproved"
                    : "CustomEventAptCancelled";
              appointmentObj["type"] = "appointment";

              const eventObj: CalendarEvent<any> = {
                logo: logo,
                title: appointmentTitle, //timeRange + appointmentObj.patientName,
                start: new Date(appointmentObj.startDateTime),
                end: new Date(appointmentObj.endDateTime),
                color: {
                  primary: appointmentObj.fontColor,
                  secondary: appointmentObj.color, // (bgColor && bgColor.color) || "#93ee93" //appointmentObj.color
                },
                // cssClass: "CustomEvent",
                cssClass: setCssClass,
                resizable: {
                  beforeStart: true,
                  afterEnd: true,
                },
                draggable: true,
                actions: actions,
                meta: {
                  ...appointmentObj,
                },
                bookingType: appointmentObj.bookingType,
                bookingMode: appointmentObj.bookingMode,
                id: 0,
              };
              var index = this.events.findIndex(
                (x) =>
                  format(x.start, "yyyyMMdd HH:mm a") ==
                  format(eventObj.start, "yyyyMMdd HH:mm a")
              );
              if (index > -1) {
                this.events.splice(index, 1);
              }
              this.events.push(eventObj);
              this.events = this.events.sort(
                (a: any, b: any) => a.start - b.start
              );
              this.refresh.next("");
            });

            //Hide all other appointments and booking slot if search a patient
            if (this.filteredPatient != null) {
              this.events = this.events.filter((x) => !!x.logo);
              this.events = this.events.sort(
                (a: any, b: any) => a.start - b.start
              );
              this.refresh.next("");
            }

            //Dashboard Filters for Calendar
            if (this.isDashboardFilter) {
              this.events = this.events.filter(
                (x) =>
                  !!x.logo &&
                  x.bookingType == this.dashBookingType &&
                  x.bookingMode == this.dashBookingMode
              );
              this.events = this.events.sort(
                (a: any, b: any) => a.start - b.start
              );
              this.refresh.next("");
            }

            //Filter all appointments to top in month view
            if (this.view === CalendarView.Month) {
              this.events = this.events.sort(
                (a: any, b: any) => a.id - b.id || a.start - b.start
              );
              this.refresh.next("");
            }
          }
        }
        return '';
      });

  }

  getUserPermissions() {
    const actionPermissions =
      this.schedulerService.getUserScreenActionPermissions(
        "SCHEDULING",
        "SCHEDULING_LIST"
      );

    const {
      SCHEDULING_LIST_ADD,
      SCHEDULING_LIST_UPDATE,
      SCHEDULING_LIST_DELETE,
      SCHEDULING_LIST_CREATESOAP,
      SCHEDULING_LIST_VIEWSOAP,
      SCHEDULING_LIST_VIEW_CLIENT_SCHEDULES,
      SCHEDULING_LIST_VIEW_TEAM_SCHEDULES,
      SCHEDULING_LIST_VIEW_OTHERSTAFF_SCHEDULES,
      SCHEDULING_LIST_CANCEL_APPOINTMENT,
      SCHEDULING_LIST_MODIFYAPPOINTMENT_AFTER_RENDERING,
      SCHEDULING_EDIT_APPOINTMENT_TIME_ONLY,
      SCHEDULING_LIST_CREATEOWNSOAP_ONLY,
      SCHEDULING_LIST_VIEWOWNSOAP_ONLY,
    } = actionPermissions;

    this.schedulerPermissions = {
      SCHEDULING_LIST_ADD,
      SCHEDULING_LIST_UPDATE,
      SCHEDULING_LIST_DELETE,
      SCHEDULING_LIST_CREATESOAP,
      SCHEDULING_LIST_VIEWSOAP,
      SCHEDULING_LIST_VIEW_CLIENT_SCHEDULES,
      SCHEDULING_LIST_VIEW_TEAM_SCHEDULES,
      SCHEDULING_LIST_VIEW_OTHERSTAFF_SCHEDULES,
      SCHEDULING_LIST_CANCEL_APPOINTMENT,
      SCHEDULING_LIST_MODIFYAPPOINTMENT_AFTER_RENDERING,
      SCHEDULING_EDIT_APPOINTMENT_TIME_ONLY,
      SCHEDULING_LIST_CREATEOWNSOAP_ONLY,
      SCHEDULING_LIST_VIEWOWNSOAP_ONLY,
    };
  }

  getCalendarActions(appointmentObj: Appointment): Array<CalendarEventAction> {
    let actions = <any>[];
    var todayDateTime = new Date();
    var year = todayDateTime.getFullYear();
    var month = todayDateTime.getMonth();
    var date = todayDateTime.getDate();
    var todayDate = new Date(year, month, date);

    var apptStartDateTime = appointmentObj.startDateTime ? new Date(appointmentObj.startDateTime) : new Date();
    var yearAppt = apptStartDateTime.getFullYear();
    var monthAppt = apptStartDateTime.getMonth();
    var dateAppt = apptStartDateTime.getDate();
    var apptStartDate = new Date(yearAppt, monthAppt, dateAppt);

    var curDate = this.date.transform(new Date(), "yyyy-MM-dd HH:mm:ss a");
    var selDate = this.date.transform(
      appointmentObj.endDateTime,
      "yyyy-MM-dd HH:mm:ss a"
    );

    if (this.isWaitingRoomScreen) {
      return actions;
    }
    if (
      (appointmentObj.statusName || "").toUpperCase() == "APPROVED" ||
      appointmentObj.cancelTypeId as number > 0
    ) {
      if (selDate! < curDate!) {
      } else {
        actions.push({
          // icon: '<div class="appt-blk"><span class="cal-event" title="appt" style="color:#513671"></span></div>',
          // icon: '<span class="cal-event ml-1" title="appt" style="color:#513671"><i class="fa fa-calendar-check-o"></i></span>',
          icon: '<span class="material-icons material-symbols-outlined" title="Go to waiting room" style="color:#513671">local_hospital</span>',
          name: "APPT",
        });
      }

      // if (todayDate <= apptStartDate) {
      //   actions.push({
      //     // icon: '<div class="appt-blk"><span class="cal-event" title="appt" style="color:#513671"></span></div>',
      //     // icon: '<span class="cal-event ml-1" title="appt" style="color:#513671"><i class="fa fa-calendar-check-o"></i></span>',
      //     icon: '<span class="material-icons material-symbols-outlined" title="Go to waiting room" style="color:#513671">local_hospital</span>',
      //     name: "APPT",
      //   });
      // }
    }

    if (
      (appointmentObj.statusName || "").toUpperCase() == "PENDING" ||
      appointmentObj.cancelTypeId as number > 0
    ) {
      actions = [
        {
          icon: '<span class="material-icons material-icons-delete" title="Delete" style="color:#d00;">delete_forever</span>', // '<i class="fa fa-fw fa-trash" title="Delete"></i>',
          name: "Deleted",
        },
      ];
    }
    if (appointmentObj.patientEncounterId) {
      actions.push({
        icon: '<span class="material-icons material-icons-view-soap" title="View Soap Note" style="color:#3b4da5">pageview</span>',
        //'<i class="fa fa-fw fa-pencil-square" title="View Soap Note"></i>',
        name: "ViewSoapNote",
      });
    } else if (
      // appointmentObj.cancelTypeId > 0 &&
      // new Date(appointmentObj.startDateTime) < new Date()
      appointmentObj.patientID > 0 &&
      !(appointmentObj.cancelTypeId as number > 0) &&
      (appointmentObj.statusName || "").toUpperCase() != "PENDING"
    ) {
      actions.push({
        icon: '<span class="material-icons material-icons-outlined"  title="go to waiting-room" style="color:#90962f">fact_check</span>',
        name: "CreateSoapNote",
      });

      if (
        (appointmentObj.statusName || "").toUpperCase() != "PENDING" &&
        (appointmentObj.statusName || "").toUpperCase() != "CANCELLED" &&
        appointmentObj.isTelehealthAppointment
      ) {
        let invitedBadge = "";
        if (
          appointmentObj.invitedStaffs &&
          appointmentObj.invitedStaffs.length > 0
        ) {
          invitedBadge =
            '<span class="invited-badge invited-badge-' +
            appointmentObj.patientAppointmentId +
            '">' +
            appointmentObj.invitedStaffs.length +
            "</span>";
        }

        actions.push({
          icon: '<span class="material-icons material-icons-chat" title="Chat" style="color:#513671">chat</span>', //<i class="fa fa-video-camera" title="Join Video Call"></i>',
          name: "Chat",
        });
      }
      if (
        appointmentObj.invitedStaffs &&
        appointmentObj.invitedStaffs.length > 0
      ) {
        actions.push({
          icon: '<span class="material-icons material-icons-users" title="Chat" >supervisor_account</span>',
          name: "invitees",
        });
      }
    }

    // check wheater claim is generated or not
    if (appointmentObj.claimId as number > 0) {
      actions = actions.filter((obj: any) => obj.name !== "Cancel");
      actions = appointmentObj.canEdit
        ? actions
        : actions.filter(
          (obj: any) => obj.name !== "Edited" && obj.name !== "Deleted"
        );
    }
    if (this.schedulerPermissions) {
      !this.schedulerPermissions.SCHEDULING_LIST_CREATESOAP &&
        (actions = actions.filter((obj: any) => obj.name !== "CreateSoapNote"));
      !this.schedulerPermissions.SCHEDULING_LIST_VIEWSOAP &&
        (actions = actions.filter((obj: any) => obj.name !== "ViewSoapNote"));
      !this.schedulerPermissions.SCHEDULING_LIST_UPDATE &&
        (actions = actions.filter((obj: any) => obj.name !== "Edited"));
      !this.schedulerPermissions.SCHEDULING_LIST_DELETE &&
        (actions = actions.filter((obj: any) => obj.name !== "Deleted"));
      !this.schedulerPermissions.SCHEDULING_LIST_CANCEL_APPOINTMENT &&
        (actions = actions.filter((obj: any) => obj.name !== "Cancel"));
      // this.schedulerPermissions.SCHEDULING_LIST_CREATESOAP && actions.filter(obj => obj.name !== 'SoapNote')

      if (
        (!this.isAdminLogin &&
          (appointmentObj.statusName || "").toUpperCase() != "PENDING") ||
        (appointmentObj.statusName || "").toUpperCase() != "INVITED"
      ) {
        const staffId =
          appointmentObj.appointmentStaffs &&
            appointmentObj.appointmentStaffs.length
            ? appointmentObj.appointmentStaffs[0].staffId
            : null;
        if (this.schedulerPermissions.SCHEDULING_LIST_CREATEOWNSOAP_ONLY) {
          if (staffId != this.currentLoginUserId)
            actions = actions.filter((obj: any) => obj.name !== "CreateSoapNote");
        }
        if (this.schedulerPermissions.SCHEDULING_LIST_VIEWOWNSOAP_ONLY) {
          if (staffId != this.currentLoginUserId)
            actions = actions.filter((obj: any) => obj.name !== "ViewSoapNote");
        }
      }

      if (
        (appointmentObj.statusName || "").toUpperCase() == "PENDING" ||
        ((appointmentObj.statusName || "").toUpperCase() == "INVITED" &&
          todayDate <= apptStartDate)
      ) {
        actions = actions.filter(
          (obj: any) => obj.name !== "CreateSoapNote" && obj.name !== "ViewSoapNote"
          //(obj) => obj.name !== "CreateSoapNote" && obj.name !== "ViewSoapNote" && obj.name !== "Edited",
          //todayss
        );
        actions.push({
          icon: '<span class="material-icons material-icons-approv" title="Approve" style="color:#50ce30">check_circle_outline</span>', //'<i class="fa fa-check" title="Approve"></i>',
          name: "Approve",
        });
      }
    }
    if (appointmentObj.invitationAppointentId) {
      actions = [];
      actions.push({
        icon: '<span class="material-icons material-icons-video" title="Join Invited Video Call" style="color:#90962f">voice_chat</span>', //<i class="fa fa-video-camera" title="Join Video Call"></i>',
        name: "OnlyVideoCall",
      });
    }
    return actions.map((obj: any) => {
      const icn = obj.icon as string;
      const [s1, ...s2Array] = icn.split(" ");
      const iconStr = [s1, 'value="' + obj.name + '"', s2Array].join(" ");
      obj.icon = iconStr.split(",").join(" ");

      return {
        label: obj.icon,
        onClick: ({ event }: { event: CalendarEvent }): void => {
          this.handleEvent(obj.name, event.meta);
        },
      };
    });
  }

  getClientInfo(patientId: number): Promise<any> {
    return this.clientService.getClientById(patientId).toPromise();
  }

  async handleEvent(type: string, event: AppointmentModel | any) {
    let appointmentObj = {
      appointmentId: event.patientAppointmentId,
      isRecurrence: event.isRecurrence,
      parentAppointmentId: event.parentAppointmentId,
      deleteSeries: false,
      claimId: event.claimId,
      patientEncounterId: event.patientEncounterId || 0,
      isBillable: event.isBillable,
      patientId: event.patientID,
      currentStaffid: 0,
    };
    // localStorage.setItem('apptId',appointmentObj.appointmentId.toString());
    this.currentAppointmentId = appointmentObj.appointmentId;
    this.currentPatientId = appointmentObj.patientId;

    // localStorage.removeItem('apptId');
    if (appointmentObj.patientId && appointmentObj.patientId != 0) {
      this.clientModel = await this.getClientInfo(appointmentObj.patientId);
    }

    switch (type.toUpperCase()) {
      case "DELETED":
        this.handleDeleteAppoitnment(appointmentObj);
        break;

      case "CANCEL":
        this.createCancelAppointmentModel(appointmentObj.appointmentId);
        break;
      case "UNDOCANCEL":
        this.schedulerService
          .unCancelAppointment(appointmentObj.appointmentId)
          .subscribe((response: any) => {
            if (response.statusCode === 200) {
              this.notifierService.notify("success", response.message);
              this.initializeEvents();
            } else {
              this.notifierService.notify("error", response.message);
            }
          });
        break;
      case "CREATESOAPNOTE":
        this.router.navigate([
          "/web/waiting-room/" + appointmentObj.appointmentId,
        ]);
        break;
      case "VIEWSOAPNOTE":
        this.createViewAppointmentModel(appointmentObj.appointmentId);
        break;
      case "APPROVE":
        const appointmentData = {
          id: appointmentObj.appointmentId,
          status: "APPROVED",
        };
        this.createApproveAppointmentModel(appointmentData);
        // this.schedulerService
        //   .updateAppointmentStatus(appointmentData)
        //   .subscribe((response: any) => {
        //     if (response.statusCode === 200) {
        //       this.notifierService.notify("success", response.message);
        //       this.initializeEvents();
        //     } else {
        //       this.notifierService.notify("error", response.message);
        //     }
        //   });
        break;
      case "VIDEOCALL":
        this.router.navigate([
          "/web/waiting-room/" + appointmentObj.appointmentId,
        ]);
        // this.router.navigate(["/web/encounter/video-call"], {
        //   queryParams: {
        //     apptId: appointmentObj.appointmentId,
        //   },
        // });
        break;
      case "ONLYVIDEOCALL":
        this.encounterService
          .getTelehealthSessionForInvitedAppointmentId(
            appointmentObj.appointmentId
          )
          .subscribe((response) => {
            if (response.statusCode == 200) {
              var otSession = this.commonService.encryptValue(
                JSON.stringify(response.data)
              );
              localStorage.setItem("otSession", otSession);
              this.commonService.videoSession(true);
            }
          });
        break;
      case "CHAT":
        this.commonService.loginUser.subscribe((response: any) => {
          if (response.access_token) {
            var chatInitModel = new ChatInitModel();
            chatInitModel.isActive = true;
            chatInitModel.AppointmentId = appointmentObj.appointmentId;
            chatInitModel.UserId = response.data.userID;

            chatInitModel.UserRole = response.data.userRoles.userType;
            //chatInitModel.UserRole = response.data.userRoles.userType;
            this.appService.CheckChatActivated(chatInitModel);
            // this.getAppointmentInfo(
            //   chatInitModel.AppointmentId,
            //   chatInitModel.UserRole
            // );
            this.textChatService.setAppointmentDetail(
              chatInitModel.AppointmentId,
              chatInitModel.UserRole
            );
            this.textChatService.setRoomDetail(
              chatInitModel.UserId,
              chatInitModel.AppointmentId
            );
          }
        });
        break;
      case "Clicked":
        break;
      case "APPT":
        this.router.navigate([
          "/web/waiting-room/assessment/" + appointmentObj.appointmentId,
        ]);
        break;
    }
  }

  handleDeleteAppoitnment(appointmentObj: any) {
    if (appointmentObj.isRecurrence) {
      this.dialogService
        .confirm("Do you want to delete whole series or this one?", [
          {
            name: "Delete Series",
            value: true,
          },
          {
            name: "Delete One",
            value: false,
          },
        ])
        .subscribe((result: any) => {
          if (result == true) {
            appointmentObj.deleteSeries = true;
            this.schedulerService
              .deleteAppointmentDetails(
                appointmentObj.appointmentId,
                appointmentObj.parentAppointmentId,
                appointmentObj.deleteSeries,
                false
              )
              .subscribe((response: any) => {
                if (response.statusCode === 200) {
                  this.notifierService.notify("success", response.message);
                  this.initializeEvents();
                } else {
                  this.notifierService.notify("error", response.message);
                }
              });
          } else if (result == false) {
            this.schedulerService
              .deleteAppointmentDetails(
                appointmentObj.appointmentId,
                appointmentObj.parentAppointmentId,
                appointmentObj.deleteSeries,
                false
              )
              .subscribe((response: any) => {
                if (response.statusCode === 200) {
                  this.notifierService.notify("success", response.message);
                  this.initializeEvents();
                } else {
                  this.notifierService.notify("error", response.message);
                }
              });
          }
        });
    } else {
      this.dialogService
        .confirm("Are you sure you want to delete appointment?")
        .subscribe((result: any) => {
          if (result == true) {
            this.schedulerService
              .deleteAppointmentDetails(
                appointmentObj.appointmentId,
                appointmentObj.parentAppointmentId,
                appointmentObj.deleteSeries,
                false
              )
              .subscribe((response: any) => {
                if (response.statusCode === 200) {
                  this.notifierService.notify("success", response.message);
                  this.initializeEvents();
                } else {
                  this.notifierService.notify("error", response.message);
                }
              });
          }
        });
    }
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    // this.events = this.events.filter(event => event !== eventToDelete);
    this.deleteAvailabilitySlot(eventToDelete);
  }

  addAppointment(event: any) {
    const sendData = {
      providerId: this.currentLoginUserId,
      event: event,
    };

    var dbModal = this.dialogModal.open(BookAppointmentByDoctorComponent, {
      data: sendData,
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result == "save") {
        this.initializeEvents();
      }
    });
  }

  setView(view: CalendarView) {
    this.view = view;
    this.initializeEvents();

    //Set scrollbar to specific time in week and day view first time rendering views
    if (view != CalendarView.Month) {
      setTimeout(function () {
        if (view == CalendarView.Week) {
          var element = document.getElementsByClassName("cal-time-events")[0];
          if (typeof element != "undefined" && element != null) {
            document.getElementsByClassName(
              "cal-time-events"
            )[0].scrollTop = 800;
          }
        } else {
          var element = document.getElementsByClassName("cal-hour-rows")[0];
          if (typeof element != "undefined" && element != null) {
            document.getElementsByClassName("cal-hour-rows")[0].scrollTop = 800;
          }
        }
      }, 1000);
    }
  }

  closeOpenMonthViewDay(sttus: string) {
    this.prevTodayNext = sttus;
    this.nextPreviosStatus = sttus;
    // this.yesterday = new Date(event);
    var days = 30;
    switch (this.view) {
      case CalendarView.Month:
        days = 30;
        break;
      case CalendarView.Week:
        days = 7;
        break;
      case CalendarView.Day:
        days = 2;
        break;
    }

    var postData = {
      startDate: this.yesterday,
      endTime: this.addDays(days, new Date(this.yesterday)),
    };
    this.initializeEvents();
    this.activeDayIsOpen = false;
    this.yesterday = this.addDays(days, new Date(this.yesterday));
  }

  addAvailabilitySlot(date: any) {
    var dbModal = this.dialogModal.open(AvailabilitySlotComponent, {
      data: { date: date },
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result == "save") {
        var postData = {
          startDate: this.yesterday,
          endTime: this.addDays(30, this.yesterday),
        };
        this.initializeEvents();
      }
    });
  }
  editAvailabilitySlot(
    date: any,
    id: any,
    startTime: any,
    endTime: any,
    visitType: any
  ) {
    var dbModal = this.dialogModal.open(AvailabilitySlotComponent, {
      data: {
        date: date,
        id: id,
        startTime: startTime,
        endTime: endTime,
        visitType: visitType,
      },
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result == "save") {
        var postData = {
          startDate: this.yesterday,
          endTime: this.addDays(30, this.yesterday),
        };
        this.initializeEvents();
      }
    });
  }
  deleteAvailabilitySlot(eventToDelete: CalendarEvent) {
    var dbModal = this.dialogModal.open(AvailabilityDeleteComponent, {
      hasBackdrop: true,
      width: "50%",
      data: eventToDelete,
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result == "save") {
        var postData = {
          startDate: this.yesterday,
          endTime: this.addDays(30, this.yesterday),
        };
        this.initializeEvents();
      }
    });
  }



  public onContextMenu($event: any, selectedEvent: CalendarEvent | any = null): void {

    this.appointId = 0;
    $event.preventDefault();
    if (selectedEvent) {
      this.appointId =
        $event.target.className.toLowerCase().indexOf('cal-event') !== -1 ||
          $event.target.className.toLowerCase().indexOf('appt-blk') !== -1 ||
          $event.target.className.toLowerCase().indexOf('month-event-txt-s') !== -1
          ? 1
          : 0;

      if (
        $event.target.className.indexOf('material-icons') === -1 &&
        $event.target.className.indexOf('cal-event-title') === -1
      ) {
        this.menuPosition.x = $event.clientX + 'px';
        this.menuPosition.y = $event.clientY + 'px';

        // debugger
        
        // setTimeout(() => {

        //   var elelmet = this.menuTriggerElement.nativeElement.querySelector('span');
        //   elelmet.click();
        //   // (this.menuTriggerElement.nativeElement as HTMLElement).querySelector('span')!.click();
        // }, 200);

        this.contextMenu.menuData = { item: selectedEvent };
        this.contextMenu.openMenu();

        if (selectedEvent && selectedEvent.meta) {
          localStorage.setItem('apptId', selectedEvent.meta.patientAppointmentId);
          this.currentAppointmentId = selectedEvent.meta.patientAppointmentId;
          this.currentStaff =
            selectedEvent.meta.appointmentStaffs != null
              ? selectedEvent.meta.appointmentStaffs[0].staffId
              : 0;
          this.currentNotes = selectedEvent.meta.notes;
          if (selectedEvent?.meta?.statusName?.toLowerCase() === "pending") {
            this.isPending = true;
        } else {
            this.isPending = false;
        }
        

          this.reviewRatingModel = new ReviewRatingModel();
          this.reviewRatingModel.id = selectedEvent.meta.reviewRatingId;
          this.reviewRatingModel.patientAppointmentId = this.currentAppointmentId;
          this.reviewRatingModel.rating = selectedEvent.meta.rating;
          this.reviewRatingModel.review = selectedEvent.meta.review;
          this.reviewRatingModel.staffId = selectedEvent?.meta?.appointmentStaffs[0]?.staffId;
        }

        if (selectedEvent && selectedEvent.end) {
          var curDate = this.date.transform(
            new Date(),
            "yyyy-MM-dd HH:mm:ss a"
          );
          var selDate = this.date.transform(
            selectedEvent.meta.appointmentDateTime,
            "yyyy-MM-dd HH:mm:ss a"
          );
          if (selDate! < curDate!) {
            this.isvalidDate = false;
          } else {
            this.isvalidDate = true;
          }
        }

        $event.preventDefault();
        $event.stopPropagation();
      }
    } else {
      const ind1 = $event.target.className.indexOf('month-view-day-box');
      const ind2 = $event.target.className.indexOf('cal-cell cal-day-cell cal-past');
      const ind3 = $event.target.className.indexOf('cal-cell cal-day-cell cal-today');
      const ind4 = $event.target.className.indexOf('cal-cell cal-day-cell cal-future');

      // Show context menu only on events and blank slots in week and day view
      if (
        $event.target.className.indexOf('cal-hour-segment') === 0 &&
        this.view !== this.CalendarView.Month
      ) {
        this.menuPosition.x = $event.clientX + 'px';
        this.menuPosition.y = $event.clientY + 'px';
        // setTimeout(() => {
        //   (this.menuTriggerElement.nativeElement as HTMLElement).querySelector('span')!.click();
        // });
        this.contextMenu.menuData = { item: selectedEvent };
        this.contextMenu.openMenu();

        $event.preventDefault();
        $event.stopPropagation();
      }
      // Show context menu only on events and blank slots in month view
      else if (
        (ind1 !== -1 || ind2 !== -1 || ind3 !== -1 || ind4 !== -1) &&
        this.view === this.CalendarView.Month
      ) {
        this.menuPosition.x = $event.clientX + 'px';
        this.menuPosition.y = $event.clientY + 'px';
        // setTimeout(() => {
        //   (this.menuTriggerElement.nativeElement as HTMLElement).querySelector('span')!.click();
        // });
        
        this.contextMenu.menuData = { item: selectedEvent };
        this.contextMenu.openMenu();
        
        $event.preventDefault();
        $event.stopPropagation();
      }
    }
  }


  monthViewActionCliked(action: any, event: CalendarEvent) {
    const actionEl = this.commonService.parseStringToHTML(
      action.label
    ) as HTMLElement;
    const actionName = actionEl.getAttribute("value") as string;
    switch (actionName) {
      case "editAvailablity":
        this.editAvailabilitySlot(
          event.start,
          event.id,
          event.start,
          event.end,
          event.visitType
        );
        break;
      case "deleteAvailablity":
        this.deleteEvent(event);
        break;
      case "bookappointment":
        this.addAppointment(event);
        break;
      case "deleteBlockItem":
        this.deleteBlockItem(event);
        break;
      case "viewBlockDetail":
        this.viewBlockDetail(event);
    }
    this.handleEvent(actionName, event.meta);
  }

  addEvent(event: any, type: any): void {
    let id = this.currentAppointmentId;
    var appStaff = parseInt(this.currentLoginUserId);

    switch (type) {
      case "2":
        this.createViewAppointmentModel(id);
        break;
      case "3":
        this.openDialogRecheduleAppointment(
          appStaff,
          appStaff.toString(),
          false
        );
        break;
      case "4":
        this.schedulerService
          .checkfollowupAppointment(id)
          .subscribe((response: any) => {
            if (response.statusCode === 200) {
              this.createCancelAppointmentModel(id);
            } else {
              this.notifierService.notify("error", response.message);
            }
          });
        break;
      case "5":
        const modalPopup = this.dialogModal.open(SetReminderComponent, {
          hasBackdrop: true,
          data: { appointmentId: this.currentAppointmentId },
        });

        modalPopup.afterClosed().subscribe((result) => {
          if (result === "save") {
          }
        });
        break;
      case "7":
        this.addNewCallerService
          .getOTSessionByAppointmentId(this.currentAppointmentId)
          .subscribe((response) => {
            if (response.statusCode == 200) {
              this.createAddPersonModel(
                this.currentAppointmentId,
                response.data.id
              );
            }
          });
        break;
      case "8":
        if (this.selectedAvailibilityDate) {
          this.handleClickEventOfDay(this.selectedAvailibilityDate);
        }
        break;
      case "9":
        if (this.selectedAvailibilityDate) {
          this.createOtherItemsOnCalender(this.selectedAvailibilityDate);
        }
        break;
    }
  }

  createOtherItemsOnCalender = (date: any) => {
    // console.log(date);
    let firstData: any = null;
    console.log(this.events);
    firstData = this.events
      .filter(
        (a) =>
          format(a.start, "yyyy-MM-dd") == format(date, "yyyy-MM-dd") &&
          format(a.start, "HH") > format(date, "HH")
      )
      .sort((x, y) => {
        return (
          parseInt(format(x.start, "HH")) - parseInt(format(y.start, "HH"))
        );
      })[0];

    console.log(firstData);
    firstData == undefined || firstData == null
      ? (firstData = new Date(new Date().setHours(23, 59, 59)))
      : (firstData = firstData.start);

    var currentDate = new Date();

    //set current timing in case of add slot in month view section
    if (this.view === CalendarView.Month) {
      let selectedDate = new Date(date);
      selectedDate.setHours(currentDate.getHours());
      selectedDate.setMinutes(currentDate.getMinutes());
      selectedDate.setSeconds(currentDate.getSeconds());
      selectedDate.setMilliseconds(currentDate.getMilliseconds());
      date = selectedDate;
    }
    if (currentDate <= new Date(date)) {
      const sendData = {
        providerId: this.currentLoginUserId,
        eventDate: date,
        firstLimitItem: firstData,
      };
      const modalPopup = this.appointmentDailog.open(
        AddOtherItemsOncalenderComponent,
        {
          hasBackdrop: true,
          data: sendData,
        }
      );
      modalPopup.afterClosed().subscribe((result) => {
        if (result === "save") this.initializeEvents();
      });
    } else {
      this.notifierService.notify(
        "error",
        "Please select future date or time than current date time"
      );
    }
  };

  createAddPersonModel(appointmentId: number, sessionId: number) {
    const modalPopup = this.dialogModal.open(AddNewCallerComponent, {
      hasBackdrop: true,
      data: { appointmentId: appointmentId, sessionId: sessionId },
    });
  }

  createCancelAppointmentModel(appointmentId: number) {
    const modalPopup = this.appointmentDailog.open(
      CancelAppointmentDialogComponent,
      {
        hasBackdrop: true,
        data: appointmentId,
      }
    );

    modalPopup.afterClosed().subscribe((result) => {
      if (result === "SAVE") this.initializeEvents();
    });
  }

  openDialogRecheduleAppointment(
    staffId: number,
    providerId: string,
    type: boolean
  ) {
    let dbModal;
    dbModal = this.appointmentDailog.open(
      AppointmentReschedulingDialogComponent,
      {
        hasBackdrop: true,
        minWidth: "50%",
        maxWidth: "50%",
        data: {
          staffId: staffId,
          userInfo: null,
          providerId: providerId,
          locationId: 101,
          isNewAppointment: type,
          appointmentId: type ? 0 : this.currentAppointmentId,
          patientId: type ? 0 : this.currentPatientId,
          currentNotes: type ? "" : this.currentNotes,
        },
      }
    );
    dbModal.afterClosed().subscribe((result: string) => {
      if (result != null && result != "close") {
        if (result == "booked") {
        }
      } else {
        this.initializeEvents();
      }
    });
  }
  createViewAppointmentModel(appointmentId: number) {
    const modalPopup = this.appointmentDailog.open(AppointmentViewComponent, {
      hasBackdrop: true,
      data: appointmentId,
      width: "80%",
    });

    modalPopup.afterClosed().subscribe((result) => {
      // if (result === "SAVE") this.fetchEvents();
    });
  }

  getBackgroundColour = (event: any) => {
    if (event.meta.type == "block") {
      return "grayCellColor";
    }
    return "";
  };

  //setting slot color based on visit type
  getColor(mycolor: number): any {
    switch (mycolor) {
      case 1:
        return colors.yellow.primary;
      case 2:
        return colors.red.primary;
      case 3:
        return colors.blue.primary;
      case 4:
        return colors.green.primary;
      case 5:
        return colors.green.primary;
      case 0:
        return colors.gray.primary;
    }
  }
  getBackground = (type: any) => {
    if (type == 0) {
      return "#c7e5f3";
    }
    return "";
  };

  documentTypeHandler = (e: any) => {
    if (e !== "") {
      this.filterMasterSearchPatients = this.patientList.filter(
        (doc) => doc.nameWithMRN.toLowerCase().indexOf(e) != -1
      );
    } else {
      this.filterMasterSearchPatients = [];
      this.filteredPatient = null;
      this.initializeEvents();
    }
  };

  createApproveAppointmentModel(appointmentData: any) {
    let dbModal;
    dbModal = this.dialogModal.open(ApproveAppointmentDialogComponent, {
      hasBackdrop: true,
      data: appointmentData,
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result == "SAVE") {
        this.initializeEvents();
      }
    });
  }

  //Clear all filters such as dashboard filter and patient search filter
  clearFilter() {
    this.router.navigate(["/web/manage-users/availability"]);
    this.searchPatientForm.reset();
    this.filterMasterSearchPatients = [];
    this.filteredPatient = null;
    this.isDashboardFilter = false;
    this.dashBookingType = "";
    this.dashBookingMode = "";
    this.isCalendarIconFilter = false;
    this.patientId = null;
    this.initializeEvents();
  }

  getRole = () => {
    return localStorage.getItem("UserRole");
  };
}
