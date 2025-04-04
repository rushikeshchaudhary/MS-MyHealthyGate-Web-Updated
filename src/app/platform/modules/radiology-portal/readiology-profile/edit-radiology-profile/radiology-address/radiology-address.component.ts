import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { format } from 'date-fns';
import { UsersService } from 'src/app/platform/modules/agency-portal/users/users.service';
import { LoginUser } from 'src/app/platform/modules/core/modals/loginUser.modal';
import { CommonService } from 'src/app/platform/modules/core/services';
import { LabService } from 'src/app/platform/modules/lab/lab.service';
import { PharmacyService } from 'src/app/platform/modules/pharmacy-portal/pharmacy.service';
import { DialogService } from 'src/app/shared/layout/dialog/dialog.service';
import { AddEditRadiologyAddressComponent } from './add-edit-radiology-address/add-edit-radiology-address.component';

@Component({
  selector: 'app-radiology-address',
  templateUrl: './radiology-address.component.html',
  styleUrls: ['./radiology-address.component.css']
})
export class RadiologyAddressComponent implements OnInit {
  PharmacyInfo: any ;
  PharmacyAddress: Array<any> = [];
  loginData: any;
  submitted: boolean = false;
  masterCountry: any = [];
  masterState: any = [];
  pharmacyAddressForm!: FormGroup;
  constructor(
    private commonService: CommonService,
    private labService: LabService,
    private formBuilder: FormBuilder,
    private notifier: NotifierService,
    private route: Router,
    private el: ElementRef,
    private usersService: UsersService,
    private matDialog: MatDialog,
    private dialogService: DialogService,
  ) { }

  ngOnInit() {
    this.pharmacyAddressForm = this.formBuilder.group({
      appartmentNumber: [
        this.PharmacyAddress.length > 0
          ? this.PharmacyAddress[0].aptNumber
          : "",
      ],
      countryID: [
        this.PharmacyAddress.length > 0
          ? this.PharmacyAddress[0].countryName
          : "",
      ],
      city: [
        this.PharmacyAddress.length > 0 ? this.PharmacyAddress[0].cityName : "",
      ],
      stateID: [
        this.PharmacyAddress.length > 0
          ? this.PharmacyAddress[0].stateName
          : "",
      ],
      zip: [
        this.PharmacyAddress.length > 0
          ? this.PharmacyAddress[0].zipNumber
          : "",
      ],
      phoneNumber: [
        this.PharmacyAddress.length > 0 ? this.PharmacyAddress[0].phone : "",
        [Validators.required, Validators.minLength(14)],
      ],
    });

    this.usersService
      .getMasterData("masterCountry,masterState", true, null)
      .subscribe((response: any) => {
        if (response != null) {
          this.masterCountry = response.masterCountry;
          this.masterState = response.masterState;
        }
      });

    this.commonService.loginUser.subscribe((user: LoginUser) => {
      if (user.data) {
//         console.log(user.data);
        this.loginData = user.data;
        this.getPharmacyData();
      }
    });
  }

  addEditAddressHandler=(event:any)=>{
    let dbModal;
    dbModal = this.matDialog.open(AddEditRadiologyAddressComponent, {
      hasBackdrop: true,
      width: "70%",
      data: {
        radiologyId:this.loginData.id,
        requestType: "add",
      },
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result == "close") {
        // console.log(result);
      } else {
        this.getPharmacyData();
      }
    });
  }

  editAddress = (item:any) => {
    // console.log(item);
    let dbModal;
    dbModal = this.matDialog.open(AddEditRadiologyAddressComponent, {
      hasBackdrop: true,
      width: "70%",
      data: {
        radiologyId: this.loginData.id,
        addressData: item,
        requestType: "Update",
      },
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result == "close") {
        // console.log(result);
      } else {
        this.getPharmacyData();
      }
    });
  };
  deleteAddress = (item:any) => {

    console.log(item);
    let id=item.addressID;
    this.dialogService
    .confirm("Are you sure you want to delete this Address?")
    .subscribe((result: any) => {
      if (result == true) {
        this.labService.deleteRadiologyAddress(id).subscribe(res=>{

          if (res != null) {
                  this.notifier.notify("success", res.message);
                  this.getPharmacyData();
                } else {
                  this.notifier.notify("error", res.message);
                }
        });
        // this.clientService
        //   .deleteUserDocument(id)
        //   .subscribe((response: ResponseModel) => {
        //     if (response != null) {
        //       this.notifier.notify("success", response.message);
        //       this.getUserDocuments();
        //     } else {
        //       this.notifier.notify("error", response.message);
        //     }
        //   });
      }
    });
  };

  getPharmacyData = () => {
    this.labService.GetRadiologyById(this.loginData.id).subscribe((res) => {
      console.log(res);
      
      this.PharmacyInfo = res.data.pharmacyInfo;
      this.PharmacyInfo = res.data;
      this.PharmacyInfo.dob = format(this.PharmacyInfo.dob, 'MM/dd/yyyy');
      this.PharmacyInfo.doj = format(this.PharmacyInfo.doj, 'MM/dd/yyyy');
      
      this.PharmacyAddress = res.data.radiologyAddressData;
    });
  };

}
