import { Component, OnInit } from "@angular/core";
import { CommonService } from "../../core/services";
import { LabService } from "../lab.service";
import { DatePipe } from "@angular/common";
import { DashboardDetails } from "../lab.model";
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  showurgentcarebtn = false;
  labData: any;
  appointmentData: any = [];
  dashboardDetails!: DashboardDetails;

  constructor(
    private labService: LabService,
    private commonService: CommonService,
    private datePipe: DatePipe,
    private translate:TranslateService,

  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
  }

  ngOnInit() {
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      this.labData = user;
    });
    this.getLabAppointmentList();
    this.getlabDashboardData();
  }

  getLabAppointmentList = () => {
    this.labService
      .GetLabAppointmentByLabId(this.labData.id, null, null)
      .subscribe((res) => {
        this.appointmentData = res.data;
      });
  };

  getlabDashboardData(){

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let firstDateCurrentMonth = new Date(currentDate.getFullYear(), currentMonth, 1);
    let lastDateCurrentMonth = new Date(currentDate.getFullYear(), currentMonth + 1, 0);
    let lastMonth = currentMonth - 1;
    if (lastMonth < 0) {
      lastMonth = 11; 
      currentDate.setFullYear(currentDate.getFullYear() - 1);
    }
    let firstDateLastMonth = new Date(currentDate.getFullYear(), lastMonth, 1);
    let lastDateLastMonth = new Date(currentDate.getFullYear(), lastMonth + 1, 0);
    


    const data={
      staffId:this.labData.id,
      todaysDate:this.datePipe.transform(new Date(), 'MM/dd/yyyy') ,
      thismonthStartDate:this.datePipe.transform(new Date(firstDateCurrentMonth), 'MM/dd/yyyy'),
      thismonthLastDate:this.datePipe.transform(new Date(lastDateCurrentMonth), 'MM/dd/yyyy'),
      lastmonthStartDate:this.datePipe.transform(new Date(lastDateCurrentMonth), 'MM/dd/yyyy'),
      lastmonthLastDate:this.datePipe.transform(new Date(lastDateCurrentMonth), 'MM/dd/yyyy')
    };
    this.labService.GetLAB_DashboardDetails(data).subscribe(res=>{
      if(res){
       this.dashboardDetails=res.data;
      }
    });
  }
}
