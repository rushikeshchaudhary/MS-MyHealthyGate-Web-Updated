import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { format } from "date-fns";
import { AppService } from "src/app/app-service.service";
import {
  FilterModel,
  Metadata,
  ResponseModel,
} from "../core/modals/common-model";
import { SupeAdminDataService } from "../supe-admin-data.service";
import { ChartOptions } from "chart.js";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  dashboardTotalCountList: dashboardTotalCount[] = [];
  dashboardTotalCountListForAppointement:dashboardTotalCount[] = [];
  total!: number;
  //TotalAppointement:number;
  //TotalAppointementCancelled:number;
  userMeta: Metadata;
  allUsers: any = [];
  userFilterModel: FilterModel;
  searchText:any;
  selectedUsers:any;
  
  userColumns: Array<any> = [
    {
      displayName: "UserId",
      key: "id",
      isSort: true,
    },
    {
      displayName: "FirstName",
      key: "firstName",
      isSort: true,
    },
    {
      displayName: "LastName",
      key: "lastName",
      isSort: true,
    },
    {
      displayName: "Email",
      key: "email",
      isSort: true,
    },
    {
      displayName: "Role",
      key: "role",
    },
    {
      displayName: "Status",
      key: "status",
    },
    {
      displayName: "Created ON",
      key: "createdOn",
      isSort: true,
    },
    // {
    //   displayName: "Actions",
    //   key: "Actions",
    //   isSort: true,
    //   class: "",
    //   width: "15%",
    // },
  ];
  // actionButtons: Array<any> = [
  //   { displayName: "Delete", key: "action", class: "fa fa-flickr" },
  // ];

  userRoles: any = [
    { RoleId: 152, RoleName: "Patient" },
    { RoleId: 156, RoleName: "Provider" },
    { RoleId: 325, RoleName: "Lab" },
    { RoleId: 326, RoleName: "Pharmacy" },
    { RoleId: 329, RoleName: "Radiology" },
  ];

  roleId: any = [152, 155, 156, 325, 326, 329];
  // TotalOnlinepaymentRecieved: number;
  // TotalHomeVisitPaymentReceived: number;
  // TotalFaceToFacePaymentReceived: number;
  // TotalRefundReceivedForCancelledappointement: number;
  // TotalPaymentReceived: number;
  // TotalAppointementPending: number;
  // TotalOnlineAppointement: number;
  // TotalFaceToFaceAppointement: number;
  // TotalHomeVisitAppointement: number;
  // TotalAppointementApproved: number;
  // TotalAppointementCompleted: number;
  // backgroundColors : any[];
  // TotalPatient: number;
  // TotalProvider: number;
  // Totallab: number;
  // TotalPharmacy: number;
  // TotalRadiology: number;
  // TotalMedicalPractitioner: number;
  // TotalNursing: number;
 // paymentChartOptions:any =  {responsive: true };
 paymentChartOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    xAxes: [{
      ticks: {
        autoSkip: false,
        maxRotation: 90,
        minRotation: 45
      }
    }],
    yAxes: [{
      ticks: {
        beginAtZero: true
      }
    }]
  },
  plugins: {
    tooltip: {
      enabled: true
    },
    legend: {
      display: true,
      position: 'top'
    }
  }
};

  paymentChartColors = [
    {
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
    }
  ];
  appoiintmentChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        ticks: {
          autoSkip: false,
          maxRotation: 90,
          minRotation: 45
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    },
    plugins: {
      tooltip: {
        enabled: true
      },
      legend: {
        display: true,
        position: 'top'
      }
    }
  };
  appoiintmentChartColors = [
    {
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
    }
  ];
  
 registeredChartOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    xAxes: [{
      ticks: {
        autoSkip: false,
        maxRotation: 90,
        minRotation: 45
      }
    }],
    yAxes: [{
      ticks: {
        beginAtZero: true
      }
    }]
  },
  plugins: {
    tooltip: {
      enabled: true
    },
    legend: {
      display: true,
      position: 'top'
    }
  }
};
  registeredChartColors = [
    {
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
    }
  ];

  public appointmentChartData:any[] = [
  //  {data: [],label:["TotalAppointement"]},
    {data: [],label:["Cancelled"]},
    {data: [],label:["Approved"]},
    {data: [],label:["Completed"]},
    {data: [],label:["Pending"]},
    {data: [],label:["Online"]},
    {data: [],label:["FaceToFace"]},
    {data: [],label:["HomeVisit"]}
  ];

  public paymentChartData:any[] = [
    //{data: [],label:["TotalPaymentReceived"]},
    {data: [],label:["FaceToFace"]}, 
    {data: [],label:["HomeVisit"]},
    {data: [],label:["Online"]},
    {data: [],label:["RefundReceivedForCancelledappointement"]}];

  public registeredChartData: any[] = [
   // { data: [], label: "TotalUser" },
    { data: [], label: "Patient" },
    { data: [], label: "Provider" },
    { data: [], label: "lab" },
    { data: [], label: "Pharmacy" },
    { data: [], label: "Radiology" }
  ];
  public ChartLabels: string[] = ["Jan", "Feb", "Mar", "April", "May", "Jun", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
  
  private totalUsers: number[] = Array(12).fill(0);
  private totalPatients: number[] = Array(12).fill(0);
  private totalProviders: number[] = Array(12).fill(0);
  private totalLabs: number[] = Array(12).fill(0);
  private totalPharmacies: number[] = Array(12).fill(0);
  private totalRadiologies: number[] = Array(12).fill(0);

  private totalPaymentReceived: number[] = Array(12).fill(0);
  private totalFaceToFacePaymentReceived: number[] = Array(12).fill(0);
  private totalHomeVisitPaymentReceived: number[] = Array(12).fill(0);
  private totalOnlinepaymentRecieved: number[] = Array(12).fill(0);
  private totalRefundReceivedForCancelledappointement: number[] = Array(12).fill(0);

  private totalAppointement: number[] = Array(12).fill(0);
  private totalAppointementCancelled: number[] = Array(12).fill(0);
  private totalAppointementApproved: number[] = Array(12).fill(0);
  private totalAppointementCompleted: number[] = Array(12).fill(0);
  private totalAppointementPending: number[] = Array(12).fill(0);
  private totalOnlineAppointement: number[] = Array(12).fill(0);
  private totalFaceToFaceAppointement: number[] = Array(12).fill(0);
  private totalHomeVisitAppointement: number[] = Array(12).fill(0);


  constructor(
    private appService: AppService,
    private supeAdminDataService: SupeAdminDataService,
    private router: Router
  ) {
    this.userMeta = new Metadata();
    this.userFilterModel = new FilterModel();
    // this.userMeta.currentPage = 1;
    // this.userMeta.pageSize = 10;
    // this.userMeta.defaultPageSize = 10;
    // this.userMeta.totalRecords = 1212;
    // this.userMeta.pageSizeOptions = [5, 10, 15, 20];
  //   this.backgroundColors = [
  //     '#1C2E4A', '#65ABF3', '#CCA939', '#00897B', '#67CED5', '#FF6361', '#FFCE56', '#36A2EB', '#4BC0C0', '#FDB45C',
  //     '#990099', '#3B3EAC', '#0099C6', '#DD4477', '#66AA00', '#B82E2E', '#316395', '#994499', '#22AA99', '#AAAA11',
  //     '#6633CC', '#E67300', '#8B0707', '#329262', '#5574A6', '#3B3EAC', '#3366CC', '#DC3912', '#FF9900', '#109618'
  // ];
  }
  // lineChartData: Array<any> = [
  //   { data: [10, 15, 25, 30], label: "Jan" },
  //   { data: [25, 51, 52, 51], label: "Feb" },
  //   { data: [22, 88, 55, 22], label: "Mar" },
  //   { data: [33, 15, 25, 25], label: "Apr" },
  //   { data: [26, 84, 55, 12], label: 'May' },
  //   { data: [63, 17, 25, 45], label: 'Jun' },
    // { data: [], label: 'Jul' },
    // { data: [], label: 'Aug' },
    // { data: [], label: 'Sep' },
    // { data: [], label: 'Oct' },
    // { data: [], label: 'Nov' },
    // { data: [], label: 'Dec' }
  // ];

  // lineChartLabels: Array<any> = ["Jan", "Feb", "Mar", "Apr"];
  // lineChartType: string = "line";
  // isDoughtnut :boolean = false; 
  ngOnInit() {
    this.TotalCountForSuperAdmin();
    this.getAllUsers();
  }

  TotalCountForSuperAdmin(){
    debugger
    this.appService.GetTotalCountApi().subscribe((response: ResponseModel) => {
      if (response.statusCode == 200) {
       
        this.dashboardTotalCountList = response.data;
        this.dashboardTotalCountListForAppointement=response.data;
        this.total = 0;
        this.dashboardTotalCountList.forEach((res) => {

          const monthIndex = res.month - 1; 

          switch (res.roleName) {
            case "TotalUser":
              this.totalUsers[monthIndex] += res.totalCount;
              break;
            case "Patient":
              this.totalPatients[monthIndex] += res.totalCount;
              break;
            case "Provider":
              this.totalProviders[monthIndex] += res.totalCount;
              break;
            case "lab":
              this.totalLabs[monthIndex] += res.totalCount;
              break;
            case "Pharmacy":
              this.totalPharmacies[monthIndex] += res.totalCount;
              break;
            case "Radiology":
              this.totalRadiologies[monthIndex] += res.totalCount;
              break;
            case "Total payment received":
              this.totalPaymentReceived[monthIndex] += res.totalCount;
              break;
            case "Total Face to Face Payment Received":
              this.totalFaceToFacePaymentReceived[monthIndex] += res.totalCount;
              break;
            case "Total Home Visit Payment Received":
              this.totalHomeVisitPaymentReceived[monthIndex] += res.totalCount;
              break;
            case "Total Online Appointment Payment Received":
              this.totalOnlinepaymentRecieved[monthIndex] += res.totalCount;
               break;
            case "Total Refund Received for Cancelled Appointments":
              this.totalRefundReceivedForCancelledappointement[monthIndex] += res.totalCount;
              break;
            case "Appointment":
              this.totalAppointement[monthIndex] += res.totalCount;
              break;
            case "Cancelled Appointment":
              this.totalAppointementCancelled[monthIndex] += res.totalCount;
              break;
            case "Approved Appointment":
              this.totalAppointementApproved[monthIndex] += res.totalCount;
              break;
            case "Completed Appointment":
              this.totalAppointementCompleted[monthIndex] += res.totalCount;
              break;
            case "Pending Appointment":
              this.totalAppointementPending[monthIndex] += res.totalCount;
              break;
            case "Online Appointment":
              this.totalOnlineAppointement[monthIndex] += res.totalCount;
              break;
            case "Face to Face Appointment":
              this.totalFaceToFaceAppointement[monthIndex] += res.totalCount;
              break;
           case "Home Visit Appointment":
              this.totalHomeVisitAppointement[monthIndex] += res.totalCount;
               break;   



          }debugger
          this.registeredChartData = [
            { data: this.totalUsers, label: "TotalUser" },
            { data: this.totalPatients, label: "Patient" },
            { data: this.totalProviders, label: "Provider" },
            { data: this.totalLabs, label: "lab" },
            { data: this.totalPharmacies, label: "Pharmacy" },
            { data: this.totalRadiologies, label: "Radiology" }
          ];
          this.paymentChartData = [
            {data: this.totalPaymentReceived,label:["TotalPaymentReceived"]},
            {data: this.totalFaceToFacePaymentReceived,label:["FaceToFace"]}, 
            {data: this.totalHomeVisitPaymentReceived,label:["HomeVisit"]},
            {data: this.totalOnlinepaymentRecieved,label:["Online"]},
            {data: this.totalRefundReceivedForCancelledappointement,label:["RefundReceivedForCancelledappointement"]}
          ];
          this.appointmentChartData = [
            {data: this.totalAppointement,label:["TotalAppointement"]},
            {data: this.totalAppointementCancelled,label:["Cancelled"]},
            {data: this.totalAppointementApproved,label:["Approved"]},
            {data: this.totalAppointementCompleted,label:["Completed"]},
            {data: this.totalAppointementPending,label:["Pending"]},
            {data: this.totalOnlineAppointement,label:["Online"]},
            {data: this.totalFaceToFaceAppointement,label:["FaceToFace"]},
            {data: this.totalHomeVisitAppointement,label:["HomeVisit"]}
          ];


          // if (res.roleName =="TotalUser") {
           
          //   this.total = res.totalCount;
          // }
          // if (res.roleName =="Patient") {
          //   this.TotalPatient = res.totalCount;
          // } 
          // if (res.roleName =="Provider") {
          //   this.TotalProvider = res.totalCount;
          // } 
          // if (res.roleName =="Lab") {
          //   this.Totallab = res.totalCount;
          // }
          // if (res.roleName =="Pharmacy") {
          //   this.TotalPharmacy = res.totalCount;
          // }
          // if (res.roleName =="Radiology") {
          //   this.TotalRadiology= res.totalCount;
          // }
          // // if (res.roleName =="Medical Practitioner") {
          
          // //   this.TotalMedicalPractitioner = res.totalCount;
          // // }
          // // if (res.roleName =="Nursing") {
          // //   this.TotalNursing = res.totalCount;
          // // }
          // if(res.roleName=="Appointment"){
          //  this.TotalAppointement=res.totalCount;
          // }
          //  if(res.roleName=="AppointementCancelled"){
          //   this.TotalAppointementCancelled=res.totalCount;
          //  }
          //  if(res.roleName=="AppointementApproved"){
          //   this.TotalAppointementApproved=res.totalCount;
          //  }
          //  if(res.roleName=="AppointementCompleted"){
          //   this.TotalAppointementCompleted=res.totalCount;
          //  }
          // if(res.roleName=="AppointementCancelled"){
          //   this.TotalAppointementCancelled=res.totalCount;
          //  }
          //  if(res.roleName=="AppointementPending"){
          //   this.TotalAppointementPending=res.totalCount;
          //  }
          //  if(res.roleName=="AppointementCompleted"){
          //   this.TotalAppointementCancelled=res.totalCount;
          //  }
          //  if(res.roleName=="OnlineAppointement"){
          //   this.TotalOnlineAppointement=res.totalCount;
          //  }
          //  if(res.roleName=="Total payment received"){
          //   this.TotalPaymentReceived=res.totalCount;
          //  }
          //  if(res.roleName=="Total Online Appointment Payment Received"){
          //   this.TotalOnlinepaymentRecieved=res.totalCount;
          //  }
          //  if(res.roleName=="Total home visit payment received"){
          //   this.TotalHomeVisitPaymentReceived=res.totalCount;
          //  }
          //  if(res.roleName=="Total Face to Face Payment Received"){
          //   this.TotalFaceToFacePaymentReceived=res.totalCount;
          //  }
          //  if(res.roleName=="Total refund received for cancelled appointments"){
          //   this.TotalRefundReceivedForCancelledappointement=res.totalCount;
          //  }
          // //  if(res.roleName=="OnlineAppointement"){
          // //   this.TotalOnlineAppointement=res.totalCount;
          // //  }
          //  if(res.roleName=="FaceToFaceAppointement"){
          //   this.TotalFaceToFaceAppointement=res.totalCount;
          //  }
          //  else if(res.roleName=="HomeVisitAppointement"){
          //   this.TotalHomeVisitAppointement=res.totalCount;
          //  }
         
          // this.Paymentchart(this. TotalPaymentReceived,
          //                       this. TotalFaceToFacePaymentReceived,
          //                       this. TotalHomeVisitPaymentReceived,
          //                       this. TotalOnlinepaymentRecieved,
          //                       this. TotalRefundReceivedForCancelledappointement
          //                      );

          // this.appointmentchart(this.TotalAppointement,
          //                           this.TotalAppointementCancelled,
          //                           this.TotalAppointementApproved,
          //                           this.TotalAppointementCompleted,
          //                           this.TotalAppointementPending,
          //                           this.TotalOnlineAppointement,
          //                           this.TotalFaceToFaceAppointement,
          //                           this.TotalHomeVisitAppointement
          //                           );                    
          // this.registeredchart(this.total,
          //                          this.TotalPatient,
          //                          this.TotalProvider,
          //                          this.Totallab,
          //                          this.TotalPharmacy,
          //                          this.TotalRadiology,
          //                          )
        });
        

        // this.dashboardTotalCountListForAppointement=this.dashboardTotalCountListForAppointement.filter((ele)=>{
          //   return ele.roleId<=0 && ele.roleName
          // })

          this.dashboardTotalCountList = response.data.filter((ele: { roleId: number; }) => {
          return ele.roleId != 151 && ele.roleId != 0;
        });
      }
    });
  }
  



// Paymentchart(
//               TotalPaymentReceived:number,
//               TotalFaceToFacePaymentReceived: number,
//               TotalHomeVisitPaymentReceived: number,
//               TotalOnlinepaymentRecieved: number,
//               TotalRefundReceivedForCancelledappointement: number)
// {
//  debugger
//   this.paymentChartData = [

//     {data: [TotalPaymentReceived],label:["TotalPaymentReceived"]},
//     {data: [TotalFaceToFacePaymentReceived],label:["FaceToFacePaymentReceived"]}, 
//     {data: [TotalHomeVisitPaymentReceived],label:["HomeVisitPaymentReceived"]},
//     {data: [TotalOnlinepaymentRecieved],label:["OnlinepaymentRecieved"]},
//     {data: [TotalRefundReceivedForCancelledappointement],label:["RefundReceivedForCancelledappointement"]}

//   ];
//   this.paymentChartLabels =[];
// }



// appointmentchart(TotalAppointement:number,
//                      TotalAppointementCancelled:number,
//                      TotalAppointementApproved:number,
//                      TotalAppointementCompleted:number,
//                      TotalAppointementPending:number,
//                      TotalOnlineAppointement:number,
//                      TotalFaceToFaceAppointement:number,
//                      TotalHomeVisitAppointement:number)
// {
  
//   this.appointmentChartData = [
  
//     {data: [TotalAppointement],label:["TotalAppointement"]},
//     {data: [TotalAppointementCancelled],label:["AppointementCancelled"]},
//     {data: [TotalAppointementApproved],label:["AppointementApproved"]},
//     {data: [TotalAppointementCompleted],label:["AppointementCompleted"]},
//     {data: [TotalAppointementPending],label:["AppointementPending"]},
//     {data: [TotalOnlineAppointement],label:["OnlineAppointement"]},
//     {data: [TotalFaceToFaceAppointement],label:["FaceToFaceAppointement"]},
//     {data: [TotalHomeVisitAppointement],label:["HomeVisitAppointement"]}
  
//   ];
//   this.appointmentChartLabels = [];
// }



// registeredchart(total:number,
//                     TotalPatient:number,
//                     TotalProvider:number,
//                     Totallab:number,
//                     TotalPharmacy:number,
//                     TotalRadiology:number,
//                    ) 
//  {

 
//   this.registeredChartData = [
    
//       {data: [total],label:["TotalUser"]},
//       {data: [TotalPatient],label:["Patient"]},
//       {data: [TotalProvider],label:["Provider"]},
//       {data: [Totallab],label:["lab"]},
//       {data: [TotalPharmacy],label:["Pharmacy"]},
//       {data: [TotalRadiology],label:["Radiology"]}

    
    
//   ];
//   this.registeredChartLabels = ["jan","feb","mar","april","may","jun","july","aug","sept","oct","nov","dec"];
// }


  modelChanged = (e: any) => {
    this.userFilterModel.searchText = e;
    this.getAllUsers();
  };
  onChangeUsers = (e:any) => {
    this.roleId = e;
  };
  onSelectLeave = () => {
    this.getAllUsers();
  };

  goToDetailPage = (item: any) => {
    this.supeAdminDataService.saveUserType(item);
    this.router.navigate(["/webadmin/manage-user"]);

  };
  gotoPageDetalisOfAppointement = (item: any)=>{
    this.supeAdminDataService.saveUserType(item);
    this.router.navigate(["/webadmin/all-appointments"]);
  }
  gotoPageDetalisOfAppointementCancelled = (item: any)=>{
    this.supeAdminDataService.saveUserType(item);
    this.router.navigate(["/webadmin/all-appointments"]);
  }

  getAllUsers = () => {
    const data = {
      roleId: this.roleId.toString(),
      Status: "",
      pageNumber: this.userFilterModel.pageNumber,
      pageSize: this.userFilterModel.pageSize,
      searchText: this.userFilterModel.searchText,
      sortOrder: this.userFilterModel.sortOrder,
      sortColumn: this.userFilterModel.sortColumn,
    };
    this.appService.getAllUsersApi(data).subscribe((res) => {
      res.data.map((ele: { createdOn:any; isBlock: boolean; status: string; isDeleted: boolean; }) => {
        ele.createdOn = format(ele.createdOn, 'MM/dd/yyyy');
        if ((ele.isBlock == true)) {
          ele.status = "Blocked";
        } else if ((ele.isDeleted ==true)) {
          ele.status = "Deleted";
        } else {
          ele.status = "Active";
        }
      });
      this.allUsers = res.data;
      this.userMeta = res.meta;
      this.userMeta.pageSizeOptions = [5, 10, 25, 50];
    });
  };

  onPageOrSortChange = (e:any) => {
    console.log(e);
    this.userFilterModel.pageNumber = e.pageIndex + 1;
    this.userFilterModel.pageSize = e.pageSize;
    this.userFilterModel.sortOrder = e.order;
    this.userFilterModel.sortColumn = e.sort;
    this.getAllUsers();
  };

  onTableActionClick=()=>{
    this.router.navigate(["/webadmin/manage-user"]);
  }
}

interface dashboardTotalCount {
  month: number;
  roleId: number;
  roleName: string;
  totalCount: number;
}

