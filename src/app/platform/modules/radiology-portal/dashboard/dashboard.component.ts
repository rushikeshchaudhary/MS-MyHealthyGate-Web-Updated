import { Component, OnInit } from "@angular/core";
import { DashboardModel } from "../../agency-portal/dashboard/dashboard.model";
import { DashboardService } from "../../agency-portal/dashboard/dashboard.service";
import { ResponseModel } from "../../core/modals/common-model";
import { CommonService } from "../../core/services";
import { LabService } from "../../lab/lab.service";
import { DatePipe } from "@angular/common";
import { DashboardDetails } from "../../lab/lab.model";
import { TranslateService } from "@ngx-translate/core";



@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  showurgentcarebtn = false;
  radiologyData: any;
  appointmentData: any = [];
  tabSelection = 0;
  dashboardData!: DashboardModel;
  dashboardDetails!: DashboardDetails;

  constructor(
    private labService: LabService,
    private commonService: CommonService,
    private dashoboardService: DashboardService,
    private datePipe: DatePipe,
    private translate:TranslateService,

  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en"|| "en");
    translate.use(localStorage.getItem("language") || "en"|| "en");
  }

  ngOnInit() {
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      this.radiologyData = user;
    });

    this.getDashboardBasicInfo();
    // this.getLabAppointmentList();
    this.getlabDashboardData();
  }

  getLabAppointmentList = () => {
    // this.labService
    //   .GetLabAppointmentByLabId(this.labData.id, null, null)
    //   .subscribe((res) => {
    //     this.appointmentData = res.data;
    //   });
  };

  onTabChanged = (event:any) => {
    console.log(event);
    this.tabSelection = event.index;
  };

  getDashboardBasicInfo() {
    this.dashoboardService
      .getDashboardBasicInfo()
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {

          console.log(response);
          
          this.dashboardData =
            response.data != null ? response.data : new DashboardModel();
        }
      });
  }

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
      staffId:this.radiologyData.id,
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
