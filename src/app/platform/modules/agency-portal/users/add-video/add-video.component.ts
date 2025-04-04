import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { VideoPopupComponent } from 'src/app/front/video-popup/video-popup.component';
import { CommonService } from '../../../core/services';
import { ClientsService } from '../../clients/clients.service';

@Component({
  selector: 'app-add-video',
  templateUrl: './add-video.component.html',
  styleUrls: ['./add-video.component.css']
})
export class AddVideoComponent implements OnInit {

  staffId: string = "";
  videoDetails: any = [];
  sizeError: boolean = false;
  dataURL: any;
  providerVideo:any;
  myFiles: any[] = [];

  constructor(
    private commonService: CommonService,
    private clientService: ClientsService,
    private activatedRoute: ActivatedRoute,
    private notifier: NotifierService,
    private dialogModal: MatDialog,
  ) { 

    this.activatedRoute.queryParams.subscribe((param) => {
      this.staffId = param["id"];
    });
  }

  ngOnInit() {
    this.getProviderVideo();
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
          
      console.log(frmData)

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

  getProviderVideo(){
    this.commonService.loadingStateSubject.next(true);
    this.clientService.getProviderVideo(parseInt(this.staffId)).subscribe(res=>{
      this.providerVideo=res;
      console.log(res)
    })
  }


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
