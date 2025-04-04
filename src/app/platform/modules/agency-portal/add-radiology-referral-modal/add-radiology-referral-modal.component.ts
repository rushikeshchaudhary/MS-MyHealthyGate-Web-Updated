import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators'
import { ClientsService } from '../../client-portal/clients.service';
import { ResponseModel } from '../../core/modals/common-model';
import { CommonService } from '../../core/services';
import { RadiologyReferralModel } from '../radiology-referral/radiology-referral.model';
//import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { SignaturePad } from 'angular2-signaturepad';
 
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-add-radiology-referral-modal',
  templateUrl: './add-radiology-referral-modal.component.html',
  styleUrls: ['./add-radiology-referral-modal.component.css']
})
export class AddRadiologyReferralModalComponent implements OnInit {
  @ViewChild(SignaturePad) signaturePad!: SignaturePad;
  organizationId: number = 128;
  submitted: boolean = false;
  masterRadiologyTests: Array<any> = [];
  selectedMasterTest: Array<any> = [];
  duplicateMasterTests: Array<any> = [];
  labsList: Array<any> = [];
  currentUser: any;
  patientId:number=0;
  patientList:any = [];
  labReferralForm!: FormGroup;
  labReferralList: Array<any> = [];
  filterCtrl: FormControl = new FormControl();
  filterPatientList: Array<any> = [];
  filterPatientName: string = "";
  filterPatientId: any;
  filterLabList: Array<any> = [];
  filterLabName: string = "";
  filterLabId!: number;
  appointmentId:number;
  public searching: boolean = false;
  public testingspeciality: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroy = new Subject<void>();
  signDataUrl!: string;
  logodataURL: any;
  stampdataURL: any;
  logoImagePreview: any;
  stampImagePreview: any;

  signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'dotSize': parseFloat('0.1'),
    'minWidth': 5,
    'canvasWidth': 600,
    'canvasHeight': 300
  };

  constructor(private commonService: CommonService,
    private clientService: ClientsService,
    private dialogModalRef: MatDialogRef<AddRadiologyReferralModalComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any, private notifier: NotifierService,
    private translate:TranslateService
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    console.log(this.data);
    this.labReferralList = data.referralList;
    this.patientId=data.patientId;
    this.appointmentId=data.appointmentId;
  }
  ngOnInit() {
    this.labReferralForm = this.formBuilder.group({
      testId: ["", Validators.required],
      patientId: [this.patientId, Validators.required],
      labId: [""],
      notes: [""],
      logo: [],
      stamp: [],
    });
    this.commonService.currentLoginUserInfo.subscribe((user) => {
      this.currentUser = user;
    });
    // this.patientList = [];
    console.log(this.currentUser);
    this.getPatients();
    this.getMasterTests();
    this.getAllLabs();
    this.filterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterspeciality();
      });

  }
  protected filterspeciality() {
    // if (!this.banks) {
    //   return;
    // }
    // get the search keyword
    let search = this.filterCtrl.value;
    if (search.length > 2) {
      search = search.toLowerCase();

      // if (!search) {
      //   this.filteredBanksMulti.next(this.banks.slice());
      //   return;
      // } else {
      //   search = search.toLowerCase();
      // }
      // filter the banks
      this.testingspeciality.next(
        this.duplicateMasterTests.filter(
          (bank) => bank.testName.toLowerCase().indexOf(search) > -1
        )
      );
    }
  }
  get formControls() {
    return this.labReferralForm.controls;
  }
  closeDialog(action: string) {
    this.dialogModalRef.close(action);
  }

  onSubmit():any {

    if (this.labReferralForm.invalid) {
      return this.labReferralForm;
    } else {

      let data = new RadiologyReferralModel();
      data = this.labReferralForm.value;
      data.ProviderId = this.currentUser.id;
      data.CreatedBy = this.currentUser.userID;
    //  data.signature = (this.signDataUrl || "").split(",")[1];   
      data.logoBase64 = this.logodataURL;
      data.stampBase64 = this.stampdataURL;

      if(this.patientId && this.patientId>0){
      data.appointmentId=this.appointmentId;
      data.patientId=this.patientId;
      }else{
      data.patientId = this.filterPatientId;
      data.appointmentId=0;
      }
      data.labId = this.filterLabId;
      data.Status = "Request Raised";
      data.referTo="RADIOLOGY"
      // var existingList = this.labReferralList.filter((x) => {
      //   return x.labId == data.labId && x.patientId == data.patientId
      //     && x.testId == data.testId
      // });
      // if (existingList.length > 0) {
      //   this.notifier.notify('error', "Record alredy exist");
      //   return this.labReferralForm;
      // }
      this.submitted = true;
      this.clientService.addLabReferral(data).subscribe((response: ResponseModel) => {
        if (response.statusCode == 200) {
          response.message="Radiology referral added successfully."
          this.notifier.notify("success", response.message);
          this.closeDialog('save');
          this.submitted = false;
          // console.log(response.data);
        } else {
          console.log(response.appError);
        }
      });
      //  console.log(this.labReferralForm.value);
    }
    return
  }
  getPatients() {
    this.clientService.getPatientsByStaffId(this.currentUser.id).subscribe((result: ResponseModel) => {
      if (result.statusCode == 200) {
        this.patientList = result.data;
      } else {
        this.patientList = [];
      }
    });
  }
  getAllLabs() {
    this.clientService.getAllLabList(this.organizationId, 329,this.filterPatientId).
      subscribe((result) => {
        if (result.statusCode == 200) {
          this.labsList = result.data.filter((d:any) => d.labName != undefined);
        } else {
          this.labsList = [];
        }
      });
  }
  getMasterTests() {
    this.clientService.getMasterData('MasterTests').subscribe((result: any) => {
      this.masterRadiologyTests = result.masterTests.filter((x: { roleId: number; })=> x.roleId == 329);
      this.duplicateMasterTests = result.masterTests.filter((x: { roleId: number; })=> x.roleId == 329);
      console.log(result);
    });
  }
  patientTypeHandler = (e: any) => {
    if (e !== "" && e != undefined) {

      this.filterPatientList = this.patientList.filter(
        (doc:any) => doc.fullName.toLowerCase().indexOf(e) != -1
      );
      console.log('filterPatientList 2:', this.filterPatientList);
    } else {
      this.filterPatientList = [];
    }
  }

  labTypeHandler = (e:any) => {
    // if (e != "" && e != undefined) {
    //   this.filterLabList = this.labsList.filter(
    //     (doc) =>
    //       doc.labName.toLowerCase().indexOf(e) != -1
    //   );
    // } else {
    //   this.filterLabList = [];
    // }
    console.log(e);
    this.filterLabName = e.labName;
    this.filterLabId = e.labId;
  }

  onSelectChange(data: { fullName: string; patientId: any; labName: string; labId: number; }, type: string) {
    if (type == "patient") {
      this.filterPatientName = data.fullName;
      this.filterPatientId = data.patientId;
      this.getAllLabs();
    } else {
      this.filterLabName = data.labName;
      this.filterLabId = data.labId;
    }
  }

  handleLogoImageChange(e:any) {
    if (this.commonService.isValidFileType(e.target.files[0].name, "image")) {
      var input = e.target;
      var reader = new FileReader();
      reader.onload = () => {
        this.logodataURL = reader.result;
        this.logoImagePreview = this.logodataURL;
      };
      reader.readAsDataURL(input.files[0]);
    } else this.notifier.notify("error", "Please select valid file type");
  }

  handleStampImageChange(e:any) {
    if (this.commonService.isValidFileType(e.target.files[0].name, "image")) {
      var input = e.target;
      var reader = new FileReader();
      reader.onload = () => {
        this.stampdataURL = reader.result;
        this.stampImagePreview = this.stampdataURL;
      };
      reader.readAsDataURL(input.files[0]);
    } else this.notifier.notify("error", "Please select valid file type");
  }

  removeLogoImage() {
    this.logodataURL = null;
    this.logoImagePreview = null;
  }

  removeStampImage() {
    this.stampdataURL = null;
    this.stampImagePreview = null;
  }

  drawComplete() {
    // will be notified of szimek/signature_pad's onEnd event
    // console.log(this.signaturePad.toDataURL());
    this.signDataUrl = this.signaturePad.toDataURL();
  }

  onClear() {
    this.signaturePad.clear();
    this.signDataUrl = "";
  }

  // sign pad
  ngAfterViewInit() {
    // this.signaturePad is now available
    this.signaturePad.set('minWidth', 5); // set szimek/signature_pad options at runtime
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
  }
}
