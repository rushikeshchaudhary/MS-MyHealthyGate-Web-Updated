import { Component, OnInit, EventEmitter, Output, Inject, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ReviewRatingModel } from "./availability-slot.model";
import { ClientsService } from "../../clients/clients.service";
import { ResponseModel } from "../../../core/modals/common-model";
import { SchedulerService } from "../../../scheduling/scheduler/scheduler.service";
import { ThemeService } from "ng2-charts";
import { Moment } from "moment";
import moment from "moment";
import { min } from "date-fns";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-availability-slot",
  templateUrl: "./availability-slot.component.html",
  styleUrls: ["./availability-slot.component.scss"]
})
export class AvailabilitySlotComponent implements OnInit {
  @ViewChild('chkSelectAll')
  chkSelectAll!: ElementRef;
  reviewRatingForm: FormGroup;
  reviewModel: ReviewRatingModel = new ReviewRatingModel;
  reviewRatingId!: number;
  appointmentId!: number;
  unAvailDateSlots: Array<any> = [];
  staffId!: number;
  headerText: string = "";

  submitted: boolean = false;
  @Output() handleTabChange: EventEmitter<any> = new EventEmitter<any>();
  isSlotShow: boolean = false;
  selected!: { start: Moment; end: Moment; };
  dayName: string;
  minDate = new Date();
  minTime: string = '00:00 am'
  slotType: any;
  providerAvailibilitySlots: any[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private schedulerService: SchedulerService,
    private activatedRoute: ActivatedRoute,
    private notifierService: NotifierService,
    private route: Router,
    private translate:TranslateService,
    private dialogModalRef: MatDialogRef<AvailabilitySlotComponent>
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    console.log("asdasdasd=>", data);
    var date = this.addDays(60, new Date());
    // this.reviewModel =
    //   this.data.reviewRatingModel == null
    //     ? new ReviewRatingModel()
    //     : this.data.reviewRatingModel;
    // if (this.reviewModel.id != null && this.reviewModel.id > 0)
    //   this.headerText = "Update Review/Rating";
    // else this.headerText = "Add Review/Rating";
    this.reviewRatingForm = this.formBuilder.group(
      {
        visitType: [1, [Validators.required]],
        startTime: ["", [Validators.required]],
        recurringType: ["", [Validators.required]],
        endTime: ["", [Validators.required]],
        slotType: ["", [Validators.required]],
        endDate: [this.addDays(30, new Date()), [Validators.required]],
      }
    );

    this.reviewRatingForm.controls['startTime'].valueChanges.subscribe(res => {
      console.log('res', res);
      this.minTime = res;
    });

    this.dayName = moment(this.data.date).format('dddd');
    if (this.data.id) {
      this.getAvailabilityById(this.data.id);
    }
  }
  addDays(numOfdaya: number, date = new Date()) {
    date.setDate(date.getDate() + numOfdaya);

    return date;
  }
  ngOnInit() {


    console.log(this.reviewModel);

  }

  applyStartDateFilter(event: MatDatepickerInputEvent<Date>) {
    this.formControls["startDate"].setValue(event.value ? new Date (event.value) : null);
  }

  get formControls() {
    return this.reviewRatingForm.controls;
  }
  validateForm(formGroup: FormGroup):any {
    return null;
  }


  onNextSubmit() {
    if (!this.reviewRatingForm.invalid) {
      var date = new Date(this.data.date);
      this.reviewModel = this.reviewRatingForm.value;
      this.reviewModel.slotDate = (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
      // this.reviewModel.startDate = this.reviewModel.dateRange.start.format('MM-DD-yyyy');
      // this.reviewModel.endDate = this.reviewModel.dateRange.end.format('MM-DD-yyyy');
      this.isSlotShow = true;

      let timeObj = this.getStartEndTime(this.reviewModel),
        startTime = timeObj.startTime,
        endTime = timeObj.endTime;
      this.unAvailDateSlots = [];
      // if (this.data.id && this.slotType && this.slotType == this.reviewModel.slotType) {
      //   this.unAvailDateSlots = this.providerAvailibilitySlots;
      // } else {
        this.calculateTimeSlotRange(
          startTime,
          endTime,
          this.reviewModel.slotType
        ).forEach(x => {
          x.isSelected = false;
          this.unAvailDateSlots.push(x);
        });
      // }
    }
  }

  onSubmit() {
    this.submitted = true;
    this.reviewModel.providerAvailibilitySlots = this.unAvailDateSlots;
    console.log(this.reviewModel);
    

    this.schedulerService
      .saveAvailibilitySlot(this.reviewModel)
      .subscribe((response: ResponseModel) => {
        this.submitted = false;
        if (response.statusCode == 200) {
          this.reviewRatingId = response.data.id;
          this.notifierService.notify("success", response.message);
          this.isSlotShow = true;
          this.dialogModalRef.close("save");
        } else {
          this.notifierService.notify("error", response.message);
        }
      });
  }

  getAvailabilityById(id:any) {
    this.schedulerService
      .GetAvailabilityById(id)
      .subscribe((response: ResponseModel) => {
        this.submitted = false;
        if (response.statusCode == 204) {
          this.minTime = moment(response.data.startTime).format("hh:mm a");
          console.log('graphics input time Start Time', moment(response.data.startTime).format("hh:mm a"))
          console.log('graphics input time End Time', moment(response.data.endTime).format("hh:mm a"))
          console.log('input type time Start Time',moment(this.data.startTime).format("HH:mm:ss"))
          console.log('input type time End Time',moment(this.data.endTime).format("HH:mm:ss"))
          this.reviewRatingForm = this.formBuilder.group(
            {
              id: [response.data.id],
              // visitType: [response.data.visitType, [Validators.required]],
              visitType: [this.data.visitType, [Validators.required]],
              //startTime: [moment(response.data.startTime).format("hh:mm a"), [Validators.required]],
              // startTime: [moment(this.data.startTime).format("hh:mm a"), [Validators.required]], //graphics input time 
              startTime: [moment(this.data.startTime).format("HH:mm:ss"), [Validators.required]], //input type time
              recurringType: [1, [Validators.required]],
              //endTime: [moment(response.data.endTime).format("hh:mm a"), [Validators.required]],
              // endTime: [moment(this.data.endTime).format("hh:mm a"), [Validators.required]], //graphics input time
              endTime: [moment(this.data.endTime).format("HH:mm:ss"), [Validators.required]], //input type time
              slotType: [response.data.slotType, [Validators.required]],
              endDate: [this.addDays(30, new Date()), [Validators.required]],
            }
          );

          this.slotType = response.data.slotType;
          this.providerAvailibilitySlots = [];

          response.data.providerAvailibilitySlots.forEach((x: { startTimeFtm: any; endTimeFtm: any; isSelected: any; }) => {
            var obj = { startTime: x.startTimeFtm, endTime: x.endTimeFtm, isSelected: x.isSelected }

            this.providerAvailibilitySlots.push(obj);

          })

        } else {
          this.notifierService.notify("error", response.message);
        }
      });
  }


  onSlotSelect(index: any) {
    this.unAvailDateSlots[index].isSelected = !this.unAvailDateSlots[index].isSelected;
    //Maintaining select all checkbox state based on all slot selection de selection  
    // if(this.unAvailDateSlots.length == this.unAvailDateSlots.filter(x=> x.isSelected).length){
    //   this.chkSelectAll['checked'] = true;
    // }else{
    //   this.chkSelectAll['checked'] = false;
    // }
    if (this.unAvailDateSlots.length === this.unAvailDateSlots.filter(x => x.isSelected).length) {
      this.chkSelectAll.nativeElement.checked = true;
  } else {
      this.chkSelectAll.nativeElement.checked = false;
  }
  }

  selectAllSlot(checked: any) {
    if (checked) {
      this.unAvailDateSlots.forEach(x => {
        x.isSelected = true;
      });
    } else {
      this.unAvailDateSlots.forEach(x => {
        x.isSelected = false;
      });
    }
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
        endTime: formattedEndtime
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

  pad(str:any, max:any) :any{
    str = str.toString();
    return str.length < max ? this.pad("0" + str, max) : str;
  }

  getStartEndTime(obj: any) {
    let startDate: Date = new Date("01-01-1990 " + obj.startTime),
      endDate: Date = new Date("01-01-1990 " + obj.endTime);

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

  closeDialog(action: string): void {
    this.dialogModalRef.close(action);
  }

  getRole=()=>{
    return localStorage.getItem('UserRole')
  }
}
