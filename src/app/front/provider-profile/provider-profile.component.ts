import { CommonService } from "src/app/platform/modules/core/services";
import { DataTableComponent } from "./../../shared/data-table/data-table.component";
import { ActivatedRoute, Router } from "@angular/router";
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
  Inject,
} from "@angular/core";

import { HomeService } from "src/app/front/home/home.service";
import { MouseEvent } from "@agm/core";
import { BookAppointmentComponent } from "src/app/front/book-appointment/book-appointment.component";
import { HomeHeaderComponent } from "src/app/front/home-header/home-header.component";
import { LoginModelComponent } from "src/app/shared/login-model/login-model.component";
import {
  FilterModel,
  Metadata,
} from "src/app/platform/modules/core/modals/common-model";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import {
  StaffAward,
  StaffExperience,
  StaffQualification,
} from "../doctor-profile/doctor-profile.model";
import { VideoPopupComponent } from "../video-popup/video-popup.component";
import { ClientsService } from "src/app/platform/modules/agency-portal/clients/clients.service";
import { ConsultationFeesComponent } from "../consultation-fees/consultation-fees.component";
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from "@kolkov/ngx-gallery";

@Component({
  providers: [HomeHeaderComponent],
  selector: "app-provider-profile",
  templateUrl: "./provider-profile.component.html",
  styleUrls: ["./provider-profile.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ProviderProfileModalComponent implements OnInit {
  // staffId: string = "";
  // constructor(private dialogModalRef: MatDialogRef<ProviderProfileModalComponent>,
  //     @Inject(MAT_DIALOG_DATA) public data: any){
  //         this.staffId = this.data.id;
  // }
  // ngOnInit() {}

  // closeDialog(action: any): void {
  //     this.dialogModalRef.close(action);
  //   }



    isProfileLoaded: boolean = false;
    staffId: string = "";
  locationId: number = 0;
  userInfo: any;
  fullname: string='';
  staffAwards: Array<StaffAward> = [];
  staffQualifications: Array<StaffQualification> = [];
  staffExperiences: Array<StaffExperience> = [];
  staffTaxonomy: any[] = [];
  tabs: any = [];
  staffSpecialities: any[] = [];
  staffServices: any[] = [];
  reviewRatingDisplayedColumns: Array<any>;
  reviewRatingMeta!: Metadata;
  reviewRatingfilterModel: FilterModel;
  averageRating: any;
  providerVideo: any;

  constructor(
    private homeService: HomeService,
    private clientService: ClientsService,

    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private dialogModal: MatDialog,
    private headerComp: HomeHeaderComponent,
    private router: Router,
    private dialogModalRef: MatDialogRef<ProviderProfileModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.reviewRatingDisplayedColumns = [
      {
        displayName: "Rating",
        key: "rating",
        class: "",
        width: "240px",
        sticky: true,
        type: "rating",
      },
      {
        displayName: "Review",
        key: "review",
        width: "140px",
      },
      { displayName: "Date", key: "createdDate", width: "250px", type: "date" }, //,
      //{
      //  displayName: "Reviewed By",
      //  key: "patientName",
      //  width: "250px",
      //  type: "50",
      //  isInfo: true
      //}
    ];
    this.reviewRatingfilterModel = new FilterModel();
    this.staffId = this.data.id;
  }

  galleryOptions!: NgxGalleryOptions[];
  galleryImages!: NgxGalleryImage[];

  ngOnInit(): void {
    // this.activatedRoute.queryParams.subscribe(param => {
    //   this.staffId = param["id"];
    //   if (
    //     param["loc"] != "" &&
    //     param["loc"] != null &&
    //     param["loc"] != undefined
    //   )
    //     this.locationId = this.commonService.encryptValue(param["loc"], false);
    // });

    this.getStaffDetail();
    this.getAverageRating();
    this.galleryOptions = [
      {
        width: "100px",
        height: "50px",
        thumbnailsColumns: 2,
        image: false,
        thumbnailsRemainingCount: true,
        imageAnimation: NgxGalleryAnimation.Slide,
      },
      // max-width 800
      {
        breakpoint: 800,
        width: "100%",
        height: "600px",
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20,
      },
      // max-width 400
      {
        breakpoint: 400,
        preview: false,
      },
    ];

    this.galleryImages = [
      {
        small: "assets/img/doctor-3big.jpg",
        big: "assets/img/doctor-3big.jpg",
      },
      {
        small: "assets/img/dentistroom.jpg",
        big: "assets/img/dentistroom.jpg",
      },
      {
        small: "assets/img/dentistroom1.jpg",
        big: "assets/img/dentistroom1.jpg",
      },
    ];
    this.tabs = [
      {
        tabName: "Overview",
      },
      {
        tabName: "Location",
      },
      {
        tabName: "Reviews",
      },
    ];
  }
  getProviderVideo(id: number) {
    this.clientService.getProviderVideo(id).subscribe((res) => {
      this.providerVideo = res;
      console.log(res);
    });
  }

  loadChild(event: any) {
    switch (event.tab.textLabel) {
      case this.tabs[0].tabName:
        this.getStaffDetail();
        break;
      case this.tabs[1].tabName:
        this.getLocationAvailability();
        break;
      case this.tabs[2].tabName:
        this.getReviewRating();
        break;
    }
  }
  getStaffDetail() {
    if (this.staffId != "") {
      this.homeService.getProviderDetail(this.staffId).subscribe((res) => {
        if (res.statusCode == 200) {
          this.userInfo = res.data;
          this.staffAwards = this.userInfo.staffAwardModels;
          this.staffExperiences = this.userInfo.staffExperienceModels;
          this.staffQualifications = this.userInfo.staffQualificationModels;
          this.staffTaxonomy = this.userInfo.staffTaxonomyModel;
          this.staffSpecialities = this.userInfo.staffSpecialityModel;
          this.staffServices = this.userInfo.staffServicesModels;
          this.fullname = this.commonService.getFullName(
            this.userInfo.firstName,
            this.userInfo.middleName,
            this.userInfo.lastName
          );
          this.getProviderVideo(res.data.id)
          this.isProfileLoaded = true;
        }
      });
    }
  }
  getAverageRating() {
    if (this.staffId != "") {
      this.homeService.getAverageRating(this.staffId).subscribe((res) => {
        if (res.statusCode == 200) {
          this.averageRating = res.data;
        }
      });
    }
  }
  StaffLocationAvailabilities: any[] = [];
  getLocationAvailability() {
    if (this.staffId != "") {
      this.homeService
        .getProviderLocationAndAvailibilityDetail(this.staffId)
        .subscribe((res) => {
          if (res.statusCode == 200) {
            this.StaffLocationAvailabilities = res.data;
            this.markers = [];
            this.StaffLocationAvailabilities.forEach((loc) => {
              this.markers.push({
                lat: loc.assignedLocationsModel.latitude,
                lng: loc.assignedLocationsModel.longitude,
                label: loc.assignedLocationsModel.location,
                draggable: true,
              });
            });
          }
        });
    }
  }
  reviewRatingList: any[] = [];
  getReviewRating(pageNumber: number = 1, pageSize: number = 5) {
    if (this.staffId != "") {
      this.homeService
        .getRatingReviews(this.staffId, true, pageNumber, pageSize)
        .subscribe((res) => {
          if (res.statusCode == 200) {
            this.reviewRatingList = res.data;
            this.reviewRatingMeta = res.meta;
          }
        });
    }
  }

  onReviewRatingPageOrSortChange(changeState?: any) {
    this.setReviewRatingtPaginatorModel(
      changeState.pageIndex + 1,
      changeState.pageSize,
      changeState.sort,
      changeState.order
    );
    this.getReviewRating(changeState.pageIndex + 1, 5);
  }

  setReviewRatingtPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string
  ) {
    this.reviewRatingfilterModel.pageNumber = pageNumber;
    this.reviewRatingfilterModel.pageSize = pageSize;
    this.reviewRatingfilterModel.sortOrder = sortOrder;
    this.reviewRatingfilterModel.sortColumn = sortColumn;
  }

  /*
  Google Map
  */
  // google maps zoom level
  zoom: number = 8;
  //17.685826172610167, 74.14007723268422
  // initial center position for the map
  lat: number = 30.6767304;
  lng: number = 76.70975070431633;

  clickedMarker(index: number,label?: string,) {
    console.log(`clicked the marker: ${label || index}`);
  }

  mapClicked($event: MouseEvent) {
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true,
    });
  }

  markerDragEnd(m: marker, $event: MouseEvent) {
    console.log("dragEnd", m, $event);
  }

  markers: marker[] = [
    {
      lat: 30.6767304,
      lng: 76.70975070431633,
      label: "A",
      draggable: true,
    },
  ];
  openDialogBookAppointment() {
    this.dialogModalRef.close();
    let dbModal;
    if (!localStorage.getItem("access_token")) {
      dbModal = this.dialogModal.open(LoginModelComponent, {
        hasBackdrop: true,
        data: { selectedIndex: 1 },
      });
      dbModal.afterClosed().subscribe((result: any) => {
        let response = result.response;
        if (
          response.statusCode >= 400 &&
          response.statusCode < 500 &&
          response.message
        ) {
          //this.errorMessage = response.message;
          this.headerComp.loading = false;
        } else if (response.statusCode === 205) {
          //this.errorMessage = response.message;
          this.headerComp.loading = false;
        } else if (response.access_token) {
          // this.headerComp.isPatient = result.isPatient;
          // if (result.isPatient == false) {
          //   this.headerComp.redirectToDashboard("/web");
          // } else {

          //this.headerComp.IsLogin = true;
          //this.headerComp.checkUserLogin();
          location.reload();
          //}
        } else {
          this.headerComp.openDialogSecurityQuestion();
        }
        // if (result != null && result.response.access_token != "") {

        //     this.headerComp.IsLogin == true;
        //     this.headerComp.checkUserLogin();
        // }
      });
    } else {
      this.createDailogForBookAppoitment();
    }
  }
  openDialogVideo() {
    this.dialogModalRef.close();
    let dbModal;
    dbModal = this.dialogModal.open(VideoPopupComponent, {
      hasBackdrop: true,
      width: "50%",
      data: this.providerVideo.data,
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result != null && result != "close") {
        if (result == "booked") {
        }
      }
    });
  }

  createDailogForBookAppoitment() {
    let dbModal;
    dbModal = this.dialogModal.open(BookAppointmentComponent, {
      hasBackdrop: true,
      width: "90%",
      data: {
        staffId: this.userInfo.id,
        userInfo: this.userInfo,
        providerId: "",
        locationId: this.locationId,
      },
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result != null && result != "close") {
        if (result == "booked") {
        }
      }
    });
  }

  backToListing() {
    location.href = "/doctor-list";
    //this.router.navigateByUrl("/doctor-list");
  }
  closeDialog(action: any): void {
    this.dialogModalRef.close(action);
  }

  openSeeFees(providerId: string) {
    let dbModal;
    dbModal = this.dialogModal.open(ConsultationFeesComponent, {
      width: "60%",
      data: { id: providerId },
    });
    dbModal.afterClosed().subscribe((result: string) => {});
  }
}

// just an interface for type safety.
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
