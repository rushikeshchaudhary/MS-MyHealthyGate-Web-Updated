import { Component, OnInit, ViewEncapsulation, Inject } from "@angular/core";

import { ActivatedRoute, Router } from "@angular/router";
import { DataTableComponent } from "src/app/shared/data-table/data-table.component";
import { CommonService } from "src/app/platform/modules/core/services";
import { HomeService } from "src/app/front/home/home.service";
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
} from "src/app/front/doctor-profile/doctor-profile.model";
import { ClientsService } from "src/app/platform/modules/agency-portal/clients/clients.service";
import { VideoPopupComponent } from "src/app/front/video-popup/video-popup.component";
import { NotifierService } from "angular-notifier";
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from "@kolkov/ngx-gallery";

@Component({
  providers: [HomeHeaderComponent],
  selector: "app-show-provider-profile",
  templateUrl: "./show-provider-profile.component.html",
  styleUrls: ["./show-provider-profile.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class ShowProviderProfileComponent implements OnInit {
  staffId: string = "";
  locationId: number = 0;
  userInfo: any;
  fullname: string = "";
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
  videoDetails: any = [];
  sizeError: boolean = false;
  dataURL: any;
  providerVideo:any;
  myFiles: any[] = [];

  constructor(
    private homeService: HomeService,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private clientService: ClientsService,
    private dialogModal: MatDialog,
    private notifier: NotifierService,
    private headerComp: HomeHeaderComponent,
    private dialogModalRef: MatDialogRef<ShowProviderProfileComponent>,
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
      { displayName: "Date", key: "createdDate", width: "250px", type: "date" },
    ];
    this.reviewRatingfilterModel = new FilterModel();
    this.staffId = this.data.id;
  }
  galleryOptions!: NgxGalleryOptions[];
  galleryImages!: NgxGalleryImage[];
  ngOnInit() {

    this.commonService.loadingStateSubject.next(true);

    this.getProviderVideo();
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
    this.commonService.loadingStateSubject.next(false);

  }
  getStaffDetail() {
    if (this.staffId != "") {
      this.homeService.getProviderDetail(this.staffId).subscribe((res) => {
        if (res.statusCode == 200) {
          this.userInfo = res.data;
          console.log(res.data);
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
        }
      });
    }
  }
  getProviderVideo(){
    this.commonService.loadingStateSubject.next(true);
    this.clientService.getProviderVideo(parseInt(this.staffId)).subscribe(res=>{
      this.providerVideo=res;
      console.log(res)
    })
  }
  getAverageRating() {
    if (this.staffId != "") {
      this.homeService.getAverageRating(this.staffId).subscribe((res) => {
        if (res.statusCode == 200) {
          this.averageRating = res.data;
          this.commonService.loadingStateSubject.next(false);
        }
      });
    }
  }
  closeDialog(action: any): void {
    this.dialogModalRef.close(action);
  }

  onSelectVideo = (e: any) => {
    const maxAllowedSize = 50 * 1024 * 1024;
    if (e.target.files[0].size > maxAllowedSize) {
      this.sizeError = true;
    } else {
      let fileExtension = e.target.files[0].name.split(".").pop().toLowerCase();
      var input = e.target;
      var reader = new FileReader();
      reader.onload = () => {
        this.dataURL = reader.result;
        this.videoDetails.push({
          data: this.dataURL,
          ext: fileExtension,
          fileName: e.target.files[0].name,
        });
      };
      this.myFiles = [];

      for (var i = 0; i < e.target.files.length; i++) {      
        this.myFiles.push(e.target.files[i]);      
      }  

      reader.readAsDataURL(input.files[0]);
      // this.videoDetails = e.target.files;
      this.sizeError = false;
    }
  };
  removeFile = (index: number) => {
    this.videoDetails.splice(index, 1);
  };

  uploadHandler = (type:string) => {
    
    if(type=="upload")
    {
      this.commonService.loadingStateSubject.next(true);
      let dataValue = {
        StaffId: this.staffId,
        base64: this.videoDetails,
      };
      let dic: any[] = [];
      dataValue.base64.forEach((element: { data: string; ext: any; }, index: any) => {
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
      dataValue.base64 = newObj;
      const frmData = new FormData();      
      for (var i = 0; i < this.myFiles.length; i++) {      
        frmData.append("fileUpload", this.myFiles[i]);      
      }  
      frmData.append("StaffId", this.staffId);      

      this.clientService.uploadStaffVideo(frmData).subscribe(res=>{
          this.notifier.notify("success", "Video Upload Successfully");
          this.getProviderVideo();
          this.commonService.loadingStateSubject.next(false);
      })
    }else{
      this.commonService.loadingStateSubject.next(true);
      let dataValue:any = {
        StaffId: this.staffId,
        base64: null,
      };
      this.clientService.uploadStaffVideo(dataValue).subscribe(res=>{
        this.notifier.notify("success", "Video Removed Successfully");
        this.getProviderVideo();
        this.commonService.loadingStateSubject.next(false);
    })
    }
    
  };

  // openModal() {

  //     let documentModal;
  //     documentModal = this.dialogModal.open(UploadVideoModalComponent, {
  //       data: this.staffId,
  //     });
  //     documentModal.afterClosed().subscribe((result: string) => {
  //      console.log("wkjecwekb")
  //     });

  // }




  openDialogVideo() {
    let dbModal;
    dbModal = this.dialogModal.open(VideoPopupComponent, {
      hasBackdrop: true,
      width:'70%',
      data: this.providerVideo.data
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result != null && result != "close") {
        if (result == "booked") {
        }
      }
    });
  }
}
