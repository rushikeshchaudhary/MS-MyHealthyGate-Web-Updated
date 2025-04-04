import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { NotifierService } from "angular-notifier";
import { format } from "date-fns";
import { HomeService } from "src/app/front/home/home.service";
import { LabAvailabilityModel } from "src/app/platform/modules/agency-portal/users/staff-availability.model";
import { UsersService } from "src/app/platform/modules/agency-portal/users/users.service";
import { ResponseModel } from "src/app/platform/modules/core/modals/common-model";
import { CommonService } from "src/app/platform/modules/core/services";
import { LabService } from "../../../lab.service";
import { TranslateService } from "@ngx-translate/core";
import { ActivatedRoute } from "@angular/router";


@Component({
  selector: "app-lab-avaibility",
  templateUrl: "./lab-avaibility.component.html",
  styleUrls: ["./lab-avaibility.component.css"],
})
export class LabAvaibilityComponent implements OnInit {
  locationId: number = 101;

  availabilityForm!: FormGroup;
  masterWeekDays!: Array<any>;
  timeinterval!: string;
  labId: any;
  labAvailabilityTypes!: Array<any>;
  maxDate = new Date(Date.now());
  disableAvailabilityDate = false;
  disableNonAvailabilityDate = false;
  submitted: boolean = false;
  sunday: Array<LabAvailabilityModel> = [];
  monday: Array<LabAvailabilityModel> = [];
  tuesday: Array<LabAvailabilityModel> = [];
  wednesday: Array<LabAvailabilityModel> = [];
  thursday: Array<LabAvailabilityModel> = [];
  friday: Array<LabAvailabilityModel> = [];
  saturday: Array<LabAvailabilityModel> = [];
  existingDayAvailabilities: Array<LabAvailabilityModel> = [];
  existingAvailabilities: Array<LabAvailabilityModel> = [];
  existingUnaAvailabilities: Array<LabAvailabilityModel> = [];
  days: Array<LabAvailabilityModel> = [];
  available: Array<LabAvailabilityModel> = [];
  unavailable: Array<LabAvailabilityModel> = [];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private notifier: NotifierService,
    private commonService: CommonService,
    private homeService: HomeService,
    private labService: LabService,
    private translate:TranslateService,
    private activatedRoute: ActivatedRoute
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
  }

  ngOnInit() {
    this.labId=this.activatedRoute.snapshot.paramMap.get('id');
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      console.log(user);
      this.labId = user.id;
    });
    const configContols = {
      daysAvailability: this.formBuilder.array([
        this.formBuilder.group({
          items: this.formBuilder.array([]),
        }),
      ]),
      availability: this.formBuilder.array([]),
      unavailability: this.formBuilder.array([]),
    };
    this.availabilityForm = this.formBuilder.group(configContols);
    this.getStaffAvailbilityTypes();
  }


  getDaysAvailabilityControls(controlname:string): FormGroup[] {
    const daysAvailability = this.availabilityForm.get(controlname) as FormArray;
    return daysAvailability ? (daysAvailability.controls as FormGroup[]) : [];
  }

  getItemsControls(formGroup: FormGroup): FormControl[] {
    const items = formGroup.get('items') as FormArray;
    return items ? (items.controls as FormControl[]) : [];
  }
  
  getStaffAvailbilityTypes() {
    let data = "staffavailability,MASTERWEEKDAYS";
    this.userService.getMasterData(data).subscribe((response: any) => {
      if (response != null) {
        this.labAvailabilityTypes = response.staffAvailability;
        this.masterWeekDays = response.masterWeekDays;
        console.log(response.masterWeekDays);
        this.GetStaffAvailabilityByLocation();
      }
    });
  }
  GetStaffAvailabilityByLocation = () => {
    let maxLength: number = 1;
    let emptyObject: LabAvailabilityModel;
    let avlType = this.labAvailabilityTypes.find(
      (x) => x.globalCodeName == "WeekDay"
    ).id;
    this.userService
      .getLabAvailabilityByLocation(this.labId, this.locationId)
      .subscribe((response: ResponseModel) => {
        this.existingDayAvailabilities = [];
        this.existingAvailabilities = [];
        this.existingUnaAvailabilities = [];
        if (response != null && response.data != null) {
          if (response.data.days != null) {
            this.existingDayAvailabilities = response.data.days; //.map(y => { y.startTime = format(y.startTime, 'HH:mm'), y.endTime = format(y.endTime, 'HH:mm'); return y });
            this.sunday = response.data.days
              .filter((x:any) => x.dayId == this.getDayId("Sunday"))
              .map((y:any) => {
                (y.startTime = format(y.startTime, "HH:mm")),
                  (y.endTime = format(y.endTime, "HH:mm"));
                return y;
              });
            maxLength =
              this.sunday.length > maxLength ? this.sunday.length : maxLength;
            this.monday = response.data.days
              .filter((x:any) => x.dayId == this.getDayId("Monday"))
              .map((y:any) => {
                (y.startTime = format(y.startTime, "HH:mm")),
                  (y.endTime = format(y.endTime, "HH:mm"));
                return y;
              });
            maxLength =
              this.monday.length > maxLength ? this.monday.length : maxLength;
            this.tuesday = response.data.days
              .filter((x:any) => x.dayId == this.getDayId("Tuesday"))
              .map((y:any) => {
                (y.startTime = format(y.startTime, "HH:mm")),
                  (y.endTime = format(y.endTime, "HH:mm"));
                return y;
              });
            maxLength =
              this.tuesday.length > maxLength ? this.tuesday.length : maxLength;
            this.wednesday = response.data.days
              .filter((x:any) => x.dayId == this.getDayId("Wednesday"))
              .map((y:any) => {
                (y.startTime = format(y.startTime, "HH:mm")),
                  (y.endTime = format(y.endTime, "HH:mm"));
                return y;
              });
            maxLength =
              this.wednesday.length > maxLength
                ? this.wednesday.length
                : maxLength;
            this.thursday = response.data.days
              .filter((x:any) => x.dayId == this.getDayId("Thursday"))
              .map((y:any) => {
                (y.startTime = format(y.startTime, "HH:mm")),
                  (y.endTime = format(y.endTime, "HH:mm"));
                return y;
              });
            maxLength =
              this.thursday.length > maxLength
                ? this.thursday.length
                : maxLength;
            this.friday = response.data.days
              .filter((x:any) => x.dayId == this.getDayId("Friday"))
              .map((y:any) => {
                (y.startTime = format(y.startTime, "HH:mm")),
                  (y.endTime = format(y.endTime, "HH:mm"));
                return y;
              });
            maxLength =
              this.friday.length > maxLength ? this.friday.length : maxLength;
            this.saturday = response.data.days
              .filter((x:any) => x.dayId == this.getDayId("Saturday"))
              .map((y:any) => {
                (y.startTime = format(y.startTime, "HH:mm")),
                  (y.endTime = format(y.endTime, "HH:mm"));
                return y;
              });
            maxLength =
              this.saturday.length > maxLength
                ? this.saturday.length
                : maxLength;

            for (let i = 0; i < maxLength; i++) {
              this.addItem(i, [
                this.sunday[i] ||
                  this.initializeStaffAvailabilityObject(
                    this.getDayId("Sunday"),
                    avlType
                  ),
                this.monday[i] ||
                  this.initializeStaffAvailabilityObject(
                    this.getDayId("Monday"),
                    avlType
                  ),
                this.tuesday[i] ||
                  this.initializeStaffAvailabilityObject(
                    this.getDayId("Tuesday"),
                    avlType
                  ),
                this.wednesday[i] ||
                  this.initializeStaffAvailabilityObject(
                    this.getDayId("Wednesday"),
                    avlType
                  ),
                this.thursday[i] ||
                  this.initializeStaffAvailabilityObject(
                    this.getDayId("Thursday"),
                    avlType
                  ),
                this.friday[i] ||
                  this.initializeStaffAvailabilityObject(
                    this.getDayId("Friday"),
                    avlType
                  ),
                this.saturday[i] ||
                  this.initializeStaffAvailabilityObject(
                    this.getDayId("Saturday"),
                    avlType
                  ),
              ]);
            }
          } else {
            this.addItem(0, [
              this.initializeStaffAvailabilityObject(
                this.getDayId("Sunday"),
                avlType
              ),
              this.initializeStaffAvailabilityObject(
                this.getDayId("Monday"),
                avlType
              ),
              this.initializeStaffAvailabilityObject(
                this.getDayId("Tuesday"),
                avlType
              ),
              this.initializeStaffAvailabilityObject(
                this.getDayId("Wednesday"),
                avlType
              ),
              this.initializeStaffAvailabilityObject(
                this.getDayId("Thursday"),
                avlType
              ),
              this.initializeStaffAvailabilityObject(
                this.getDayId("Friday"),
                avlType
              ),
              this.initializeStaffAvailabilityObject(
                this.getDayId("Saturday"),
                avlType
              ),
            ]);
          }

          if (
            response.data.available != null &&
            response.data.available.length > 0
          ) {
            this.existingAvailabilities = response.data.available;
            response.data.available.forEach((element:any) => {
              element.startTime = format(element.startTime, "HH:mm");
              element.endTime = format(element.endTime, "HH:mm");
              this.addAvlItem(element);
            });
          } else {
            this.addAvlItem(
              this.initializeStaffAvailabilityObject(
                0,
                this.labAvailabilityTypes.find(
                  (x) => x.globalCodeName == "Available"
                ).id
              )
            );
          }
          if (
            response.data.unavailable != null &&
            response.data.unavailable.length > 0
          ) {
            this.existingUnaAvailabilities = response.data.unavailable;
            response.data.unavailable.forEach((element:any) => {
              element.startTime = format(element.startTime, "HH:mm");
              element.endTime = format(element.endTime, "HH:mm");
              this.addUnAvlItem(element);
            });
          } else {
            this.addUnAvlItem(
              this.initializeStaffAvailabilityObject(
                0,
                this.labAvailabilityTypes.find(
                  (x) => x.globalCodeName == "Unavailable"
                ).id
              )
            );
          }
        }
      });
  };

  getDayId(dayName: string = ""): number {
    return this.masterWeekDays.find(
      (x) => x.day.toLowerCase() == dayName.toLowerCase()
    ).id;
  }

  getDayName(dayId: number): string {
    return this.masterWeekDays.find((x) => x.id == dayId).dayName;
  }
  get formControls() {
    return this.availabilityForm.value;
  }

  get daysAvailability() {
    return this.availabilityForm.get("daysAvailability") as FormArray;
  }

  get availability() {
    return this.availabilityForm.get("availability") as FormArray;
  }
  get unavailability() {
    return this.availabilityForm.get("unavailability") as FormArray;
  }
  timeintervalselect() {
    //console.log(this.timeinterval);
    let data={
      labId:this.labId,
      timeInterval:this.timeinterval
    }
    
    this.labService
      .UpdateTimeIntervalLab(data)
      .subscribe((response: ResponseModel) => {
        if (response != null) {
          if (response.statusCode == 200) {
            this.notifier.notify(
              "success",
              "Slot time interval has been updated"
            );
          } else {
            this.notifier.notify("error", response.message);
          }
        }
      });
  }

  removeDayItem(index: number) {
    this.daysAvailability.removeAt(index);
  }

  addDayItem() {
    let avlType = this.labAvailabilityTypes.find(
      (x) => x.globalCodeName == "WeekDay"
    ).id;
    this.addItem(this.daysAvailability.length, [
      this.initializeStaffAvailabilityObject(this.getDayId("Sunday"), avlType),
      this.initializeStaffAvailabilityObject(this.getDayId("Monday"), avlType),
      this.initializeStaffAvailabilityObject(this.getDayId("Tuesday"), avlType),
      this.initializeStaffAvailabilityObject(
        this.getDayId("Wednesday"),
        avlType
      ),
      this.initializeStaffAvailabilityObject(
        this.getDayId("Thursday"),
        avlType
      ),
      this.initializeStaffAvailabilityObject(this.getDayId("Friday"), avlType),
      this.initializeStaffAvailabilityObject(
        this.getDayId("Saturday"),
        avlType
      ),
    ]);
  }
  addItem(ix:any, array: Array<LabAvailabilityModel>) {
    this.daysAvailability.push(
      this.formBuilder.group({
        items: this.formBuilder.array([]),
      })
    );

    const control = (<FormArray>(
      this.availabilityForm.controls["daysAvailability"]
    ))
      .at(ix)
      .get("items") as FormArray;
    for (let i = 0; i < array.length; i++) {
      control.push(
        this.formBuilder.group({
          id: array[i].id,
          dayId: array[i].dayId,
          startTime: array[i].startTime,
          endTime: array[i].endTime,
          dayName: array[i].dayName,
          labId: array[i].labId,
        locationId:this.locationId,
          isActive: array[i].isActive,
          isDeleted: array[i].isDeleted,
          labAvailabilityTypeID: array[i].labAvailabilityTypeID,
        })
      );
    }
  }

  clearFormControls() {
    while (this.daysAvailability.length !== 0) {
      this.daysAvailability.removeAt(0);
    }
    while (this.availability.length !== 0) {
      this.availability.removeAt(0);
    }
    while (this.unavailability.length !== 0) {
      this.unavailability.removeAt(0);
    }
  }

  initializeStaffAvailabilityObject(
    dayId: number,
    availabilityTypeId: number
  ): LabAvailabilityModel {
    let dayName =
      dayId != undefined && dayId != null ? this.getDayName(dayId) : "";
    //  dayId == 1 ? "Sunday" : dayId == 2 ? "Monday" : dayId == 3 ? "Tuesday" : dayId == 4 ? "Wednesday" : dayId == 5 ? "Thursday" : dayId == 6 ? "Friday" : dayId == 7 ? "Saturday" : "";
    let staffAvailability = new LabAvailabilityModel();
    staffAvailability.dayId = dayId;
    staffAvailability.dayName = dayName;
    staffAvailability.date = "";
    staffAvailability.isActive = true;
    staffAvailability.isDeleted = false;
    staffAvailability.labId = this.labId;
    staffAvailability.labAvailabilityTypeID = availabilityTypeId;
    return staffAvailability;
  }
  addAvlItem(obj: LabAvailabilityModel) {
    const control = <FormArray>this.availabilityForm.controls["availability"];
    control.push(
      this.formBuilder.group({
        id: obj.id,
        dayId: obj.dayId,
        startTime: obj.startTime,
        endTime: obj.endTime,
        dayName: obj.dayName,
        labId: obj.labId,
        date: obj.date,
        locationId:this.locationId,

        isActive: obj.isActive,
        isDeleted: obj.isDeleted,
        labAvailabilityTypeID: obj.labAvailabilityTypeID,
      })
    );
  }

  removeUnAvailabilityItem(index: number) {
    this.unavailability.removeAt(index);
  }
  addUnAvlItem(obj: LabAvailabilityModel) {
    const control = <FormArray>this.availabilityForm.controls["unavailability"];
    control.push(
      this.formBuilder.group({
        id: obj.id,
        dayId: obj.dayId,
        startTime: obj.startTime,
        endTime: obj.endTime,
        dayName: obj.dayName,
        labId: obj.labId,
        date: obj.date,
        locationId:this.locationId,
        isActive: obj.isActive,
        isDeleted: obj.isDeleted,
        labAvailabilityTypeID: obj.labAvailabilityTypeID,
      })
    );
  }

  onDateChange(buttonSection: string) {
    if (buttonSection == "Availability") {
      this.disableNonAvailabilityDate = true;
      this.disableAvailabilityDate = false;
    }

    if (buttonSection == "NonAvailability") {
      this.disableNonAvailabilityDate = false;
      this.disableAvailabilityDate = true;
    }
  }
  addAvailabilityItem() {
    this.addAvlItem(
      this.initializeStaffAvailabilityObject(
        0,
        this.labAvailabilityTypes.find((x) => x.globalCodeName == "Available")
          .id
      )
    );
  }

  removeAvailabilityItem(index: number) {
    this.availability.removeAt(index);
  }
  addUnAvailabilityItem() {
    this.addUnAvlItem(
      this.initializeStaffAvailabilityObject(
        0,
        this.labAvailabilityTypes.find((x) => x.globalCodeName == "Unavailable")
          .id
      )
    );
  }

  onSubmit() {
    let nowDate = new Date();
    let currentDate =
      nowDate.getFullYear() +
      "-" +
      (nowDate.getMonth() + 1) +
      "-" +
      nowDate.getDate();
    let dayAvailability: Array<LabAvailabilityModel> = [];
    let avl: Array<LabAvailabilityModel> = [];
    let unAvl: Array<LabAvailabilityModel> = [];
    let tempAvailibilty = this.availabilityForm.value.daysAvailability;
    tempAvailibilty.forEach((element:any) => {
      element.items.forEach((x:any) => {
        if (x.startTime != null && x.endTime != null) dayAvailability.push(x);
      });
    });

    dayAvailability.forEach((a) => {
      a.startTime = currentDate + " " + a.startTime;
      a.endTime = currentDate + " " + a.endTime;
    });

    this.availabilityForm.value.availability
      .filter((x:any) => x.date != null && x.startTime != null && x.endTime != null)
      .forEach((element:any) => {
        if (
          element.date != null &&
          element.startTime != null &&
          element.endTime != null
        ) {
          let currentVal =
            new Date(element.date).getFullYear() +
            "-" +
            (new Date(element.date).getMonth() + 1) +
            "-" +
            new Date(element.date).getDate();
          element.startTime = currentVal + " " + element.startTime;
          element.endTime = currentVal + " " + element.endTime;
          avl.push(element);
        }
      });

    this.availabilityForm.value.unavailability
      .filter((x:any) => x.date != null && x.startTime != null && x.endTime != null)
      .forEach((element:any) => {
        if (
          element.date != null &&
          element.startTime != null &&
          element.endTime != null
        ) {
          let currentVal =
            new Date(element.date).getFullYear() +
            "-" +
            (new Date(element.date).getMonth() + 1) +
            "-" +
            new Date(element.date).getDate();
          element.startTime = currentVal + " " + element.startTime;
          element.endTime = currentVal + " " + element.endTime;
          unAvl.push(element);
        }
      });

    this.existingDayAvailabilities.filter((x: LabAvailabilityModel) => {
      if (dayAvailability.findIndex((y) => y.id == x.id) == -1) {
        x.isDeleted = true;
        dayAvailability.push(x);
      }
    });

    this.existingAvailabilities.filter((x: LabAvailabilityModel) => {
      if (avl.findIndex((y) => y.id == x.id) == -1) {
        x.isDeleted = true;
        avl.push(x);
      }
    });

    this.existingUnaAvailabilities.filter((x: LabAvailabilityModel) => {
      if (unAvl.findIndex((y) => y.id == x.id) == -1) {
        x.isDeleted = true;
        unAvl.push(x);
      }
    });
    let data = {
      labId: this.labId,
      //locationId: this.locationId,
      days: dayAvailability,
      available: avl,
      unavailable: unAvl,
    };

    console.log(data);
    this.submitted = true;
    this.labService
      .saveUpdateLabAvailability(data)
      .subscribe((response: ResponseModel) => {
        this.submitted = false;
        if (response != null) {
          if (response.statusCode == 200) {
            this.notifier.notify("success", response.message);
            this.clearFormControls();
            this.GetStaffAvailabilityByLocation();
          } else {
            this.notifier.notify("error", response.message);
          }
        }
      });
  }
}
