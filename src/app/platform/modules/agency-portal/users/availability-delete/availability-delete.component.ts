import { Component, OnInit, EventEmitter, Output, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ClientsService } from "../../clients/clients.service";
import { ResponseModel } from "../../../core/modals/common-model";
import { SchedulerService } from "../../../scheduling/scheduler/scheduler.service";
import { ThemeService } from "ng2-charts";
import { Moment } from "moment";
import moment from "moment";

@Component({
  selector: "app-availability-delete",
  templateUrl: "./availability-delete.component.html",
  styleUrls: ["./availability-delete.component.css"]
})
export class AvailabilityDeleteComponent implements OnInit {
  reviewRatingForm!: FormGroup;
  reviewRatingId!: number;
  appointmentId!: number;
  unAvailDateSlots: Array<any> = [];
  staffId!: number;
  headerText: string = "";

  submitted: boolean = false;
  @Output() handleTabChange: EventEmitter<any> = new EventEmitter<any>();
  isSlotShow: boolean = false;
  selected!: { start: Moment; end: Moment; };
  dayName:string;
  minDate = new Date();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private schedulerService: SchedulerService,
    private activatedRoute: ActivatedRoute,
    private notifierService: NotifierService,
    private route: Router,
    private dialogModalRef: MatDialogRef<AvailabilityDeleteComponent>
  ) {

    this.dayName = moment(this.data.start).format('dddd');
  }
 
  ngOnInit() {
    
  }
  closeDialog(action: string): void {
    this.dialogModalRef.close(action);
  }
  onSubmit(type:any) {
    this.submitted = true;
    var postData = {
      id:this.data.id,
      date:moment(this.data.start).format('MM-DD-yyyy HH:mm'),
      type:type,
      startTime:moment(this.data.start).format('hh:mm'),
      endTime:moment(this.data.end).format('hh:mm') 
    }

    this.schedulerService
      .DeleteAvailibilitySlot(postData)
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
}
