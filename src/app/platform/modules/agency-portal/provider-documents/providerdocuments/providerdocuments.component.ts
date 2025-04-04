import { Component, OnInit, Input } from '@angular/core';
//import { UsersService } from '../users.service';
import { NotifierService } from 'angular-notifier';
import { ResponseModel } from '../../../core/modals/common-model';
//import { UserDocumentModel } from '../users.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { format, addDays } from 'date-fns';
import { MatDialog } from '@angular/material/dialog';
//import { AddUserDocumentComponent } from './add-user-document/add-user-document.component';
//import { CommonService } from '../../../core/services';
import { DialogService } from '../../../../../shared/layout/dialog/dialog.service';
import { UserDocumentModel } from '../../users/users.model';
import { UsersService } from '../../users/users.service';
import { AddUserDocumentComponent } from '../../users/user-documents/add-user-document/add-user-document.component';
import { AddProviderDocumentComponent } from '../add-provider-document/add-provider-document.component';
import { LoggedInUserModel, LoginUser } from '../../../core/modals/loginUser.modal';
import { Subscription } from 'rxjs';
import { CommonService } from '../../../core/services';
import { ProviderDocumentService } from '../provider-documents.service';
import { DocViewerComponent } from 'src/app/shared/doc-viewer/doc-viewer.component';
import { Router } from '@angular/router';
//import { CommonService } from '../../../core/services/common.service';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-provider-documents',
  templateUrl: './providerdocuments.component.html',
  styleUrls: ['./providerdocuments.component.css']
})
export class ProviderDocumentsComponent implements OnInit {
  documentFormGroup!: FormGroup;
  userId!: number;
  //@Input() isSpecificUser: boolean = false;
  locationId!: number;
  todayDate = new Date();
  fromDate!: string;
  toDate!: string;
  documentList: Array<UserDocumentModel> = [];
  locationUsers: any = [];
  loginUserId!: number;
  uploadPermission!: boolean;
  downloadPermission!: boolean;
  deletePermission!: boolean;
  subscription!: Subscription;
  loggedInUserModel!: LoggedInUserModel;
  documentstatus!: boolean;
  myFlagForSlideToggle!: boolean;
  showUploader = false;
  constructor(
    private dialogModal: MatDialog,
    private userService: UsersService,
    private notifier: NotifierService,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private dialogService: DialogService,
    private providerDocumentService: ProviderDocumentService,
    private router:Router,
    private translate:TranslateService
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
  }

  ngOnInit() {

    this.subscription = this.commonService.loginUser.subscribe((user: LoginUser) => {
      //////debugger;
      if (user.data) {
        this.userId = user.data.userID;
      }
    });

    this.documentFormGroup = this.formBuilder.group({
      userId: [],
      fromDate: [],
      toDate: []
    });


    //this.checkLoggedinUser();


    this.getUserDocuments();
    //this.getUserPermissions();
  }

  //   checkLoggedinUser(){
  //     this.providerDocumentService.getUserRole().subscribe((response: any) => {
  //         if(response != null && response.statusCode == 200){
  //             //////debugger;
  //             this.loggedInUserModel  =response.data;

  //         }   
  //       });
  // }

  get formControls() {
    return this.documentFormGroup.controls;
  }
  notifiers() {
    this.notifier.notify('error', "You are not authorized to upload content here, please contact administrator.");
  }
  createModal() {
    if (this.userId != null) {
      let documentModal;
      documentModal = this.dialogModal.open(AddProviderDocumentComponent, { data: this.userId })
      documentModal.afterClosed().subscribe((result: string) => {
        if (result == 'save')
          this.getUserDocuments();
      });
    }
    else this.notifier.notify('error', "Please select user");
  }
  applyFilter() {
    //////debugger;
    let values = this.documentFormGroup.value;
    //this.userId = this.loginUserId;//values.userId;
    this.fromDate = values.fromDate;
    this.toDate = values.toDate;
    this.getUserDocuments();
  }
  clearfilters() {
    this.documentFormGroup.reset();
    this.userId = 0;
    this.documentList = [];
  }
  getUserDocuments() {
    //////debugger;
    if (this.userId != null) {
      //this.fromDate = this.fromDate == null ? '1990-01-01' : format(this.fromDate, "yyyy-MM-dd");
      //this.toDate = this.toDate == null ? format(this.todayDate, "yyyy-MM-dd") : format(this.toDate, "yyyy-MM-dd");
      let fromDateObj = this.fromDate ? new Date(this.fromDate) : new Date('1990-01-01');
      let toDateObj = this.toDate ? new Date(this.toDate) : this.todayDate;

      this.fromDate = format(fromDateObj, 'yyyy-MM-dd');
      this.toDate = format(toDateObj, 'yyyy-MM-dd');
      this.userService.getprovidereductaionalDocuments(this.userId, this.fromDate, this.toDate).subscribe((response: ResponseModel) => {
        if (response != null) {
          //////debugger;
          this.documentList = (response.data != null && response.data.length > 0) ? response.data : [];
          if (response.statusCode == 404) {
            // this.notifier.notify('error', "No Records Found")
          }
        }
      }
      );
    }
  }

  getUserByLocation() {
    this.userService.getUserByLocation(this.locationId).subscribe((response: ResponseModel) => {
      if (response != null && response.data != null && response.data.staff != null && response.data.staff.length > 0) {
        this.locationUsers = response.data.staff;
      }
    }
    );
  }
  getUserDocument(value: UserDocumentModel) {
    // this.userService.getUserDocument(value.id).subscribe((response: any) => {
    //   this.userService.downloadFile(response, response.type, value.url);
    // }
    // );
    let key;
    if (value.key.toLowerCase() ===  "refferal") {
      key = "refferal";
    }
    else{
      key = "userdoc";
    }
    this.userService.getDocumentForDownlod(value.id,key).subscribe((response: any) => {
 console.log(response);
         if (response.statusCode == 200) {
          var fileType = "";
          switch (response.data.extenstion) {
            case ".png":
              fileType = "image/png";
              break;
            case ".gif":
              fileType = "image/gif";
              break;
            case ".pdf":
              fileType = "application/pdf";
              break; 
            case ".jpeg":
              fileType = "image/jpeg";
              break;
            case ".jpg":
              fileType = "image/jpeg";
              break;
            case ".xls":
              fileType = "application/vnd.ms-excel";
              break;
            default:
              fileType = "";
          }
          var binaryString = atob(response.data.base64);
          var bytes = new Uint8Array(binaryString.length);
          for (var i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          var newBlob = new Blob([bytes], {
            type: fileType,
          });
    //  this.userService.downloadFile(response, response.type, value.url);
    this.userService.downloadFile( newBlob,
      fileType,
      response.data.fileName);
    }
    else {
         
      this.notifier.notify("error", response.message);
    }
  }
  
    );
  }

  onOpenDocViewer(url: string) {
    //////debugger;
    const modalPopup = this.dialogModal.open(
      DocViewerComponent,
      {
        hasBackdrop: true,
        width: "62%",
        data: url
      }
    );

    // modalPopup.afterClosed().subscribe((result) => {
    //   // if (result === "SAVE") this.fetchEvents();
    // });
  }
  // deleteUserDocument(id: number) {
  //   this.userService.deleteUserDocument(id).subscribe((response: ResponseModel) => {
  //     if (response != null) {
  //       this.notifier.notify('success', response.message);
  //       this.getUserDocuments();
  //     } else {
  //       this.notifier.notify('error', response.message);
  //     }
  //   }
  //   );
  // }

  deleteUserDocument(id: number) {
    this.dialogService.confirm('Are you sure you want to delete this document?').subscribe((result: any) => {
      if (result == true) {
        this.userService.deleteUserDocument(id)
          .subscribe((response: any) => {
            if (response.statusCode === 204) {
              this.notifier.notify('success', response.message)
              this.getUserDocuments();
            } else if (response.statusCode === 401) {
              this.notifier.notify('warning', response.message)
            } else {
              this.notifier.notify('error', response.message)
            }
          })
      }
    })
  }

  gettogglevalue(event:any, id: number) {
    //////debugger;
    this.documentstatus = event.source.checked;
    this.updateDocumentActiveStatus(id);
  }

  updateDocumentActiveStatus(id: number) {

    this.userService.updateDocumentStatus(id, this.documentstatus)
      .subscribe((response: any) => {
        if (response.statusCode === 200) {
          this.notifier.notify('success', response.message)
          this.getUserDocuments();
        } else if (response.statusCode === 401) {
          this.notifier.notify('warning', response.message)
        } else {
          this.notifier.notify('error', response.message)
        }
      })
  }

  onClickContactNow(){
    // var a = document.createElement("a");
    // document.body.appendChild(a);
    // a.target = '_blank';
    // a.href = "https://myhealthygate.com/contact-us";
    // a.click();
    this.router.navigate(['/contact-us']);
    //window.open('/contact-us', '_blank');
  }





  //   getUserPermissions() {
  //     const actionPermissions = this.userService.getUserScreenActionPermissions('USER', 'USER_DOCUMENT_LIST');
  //     const { USER_DOCUMENT_LIST_UPLOAD, USER_DOCUMENT_LIST_DOWNLOAD, USER_DOCUMENT_LIST_DELETE } = actionPermissions;

  //     this.uploadPermission = USER_DOCUMENT_LIST_UPLOAD || false;
  //     this.downloadPermission = USER_DOCUMENT_LIST_DOWNLOAD || false;
  //     this.deletePermission = USER_DOCUMENT_LIST_DELETE || false;

  //   }
}
