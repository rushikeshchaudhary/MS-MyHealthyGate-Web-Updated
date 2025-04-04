import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { LabSerachFilterModel } from "src/app/platform/modules/core/modals/common-model";
import { CommonService } from "src/app/platform/modules/core/services";
import { HomeService } from "../home/home.service";
import { LabBookAppointmentModalComponent } from "./lab-book-appointment-modal/lab-book-appointment-modal.component";

@Component({
  selector: "app-lab-booking-list",
  templateUrl: "./lab-booking-list.component.html",
  styleUrls: ["./lab-booking-list.component.css"],
})
export class LabBookingListComponent implements OnInit {
  showLoader = false;
  filterLabModel: LabSerachFilterModel;
  labList: any = [];
  doctorWidgetClass: string = "col-sm-6 grid-profile";
  masterGender: any = [];
  location: any[] = [];
  searchedLocation: string = "";
  selectedLocation: any;
  selectedDate: any;

  constructor(private dialogModal: MatDialog, private commonService: CommonService,private route: ActivatedRoute,private homeService: HomeService) {
    this.filterLabModel = new LabSerachFilterModel();
  }

  ngOnInit() {
    window.scroll(0,0)
    //this.getMasterData();
    this.getLabList();
    this.getMasterData();
  }

  getLabList() {
    this.filterLabModel.pageSize = 2000;
    this.homeService
      .getLabList(this.filterLabModel)
      .subscribe((response: any) => {
        this.filterLabModel.LabId = "";
        if (response != null && response.statusCode == 200) {
          console.log(response);
          this.labList = response.data;
        } else {
        }
        this.showLoader = false;
      });
  }
  getMasterData(globalCodeId:any[]=[],requestType:any=0) {
    
    this.route.queryParams.subscribe(params => {
      
      var prvSelectedValue=this.commonService.encryptValue(params["sp"], false)
      var prvSelectedService=this.commonService.encryptValue(params["srvc"], false)
      });
      
      
    this.homeService
      .getMasterData("masterLocation,MASTERTAXONOMY,MASTERSTAFFSERVICE,MASTERSPECIALITY,MASTERGENDER",true )
      .subscribe((response: any) => {
        console.log(response)
        if (response != null) {
          this.masterGender =
            response.masterGender != null ? response.masterGender : [];
          this.location =
            response.masterLocation != null ? response.masterLocation : [];
          this.route.queryParams.subscribe(params => {
            if (
              params["loc"] != "" &&
              params["loc"] != null &&
              params["loc"] != undefined
            ) {
              this.selectedLocation = +this.commonService.encryptValue(
                params["loc"],
                false
              ); //

              this.searchedLocation = this.location.find(
                x => (x.id = this.selectedLocation)
              ).locationName;
            }
            this.selectedDate = params["d"]; // this.datePipe.transform(params['d'], 'yyyy-MM-dd');
          });
        }
      });
  }
  bookAppointment=(lab:any)=>{
    let dbModal;
    dbModal = this.dialogModal.open(LabBookAppointmentModalComponent, {
      hasBackdrop: true,
      data: lab,
      width:"80%"
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result != null && result != "close") {
        // if (result == "booked") {
        // }
        //location.reload();
      }
    });
  }
}
