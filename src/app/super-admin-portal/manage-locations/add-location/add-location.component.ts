import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { ResponseModel } from '../../core/modals/common-model';
import { ManageLocationService } from '../manage-location.service';
import { ManageLocationModel } from './manage-location.model';
import { UsersService } from 'src/app/platform/modules/agency-portal/users/users.service';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.css']
})
export class AddLocationComponent implements OnInit {
  locationForm!: FormGroup;
  locationModel: ManageLocationModel;
  locationId: number=0;
  isEdit: boolean = false;
  submitted: boolean = false;
  masterCountry: Array<any> = []
  masterState: Array<any> = [];
  constructor(private formBuilder: FormBuilder, 
    private router: Router, 
    private activatedRoute: ActivatedRoute, 
    private locationService: ManageLocationService, 
    private notifier: NotifierService,
    private usersService :UsersService) {
    this.locationModel = new ManageLocationModel();
    
  }
  ngOnInit() {
    this.locationForm = this.formBuilder.group({
      id: [this.locationModel.id],
      locationName: [this.locationModel.locationName],
      locationDescription: [this.locationModel.locationDescription],
      address: [this.locationModel.address],
      city: [this.locationModel.city],
      zip: [this.locationModel.zip],
      phone: [this.locationModel.phone],
      isActive: [this.locationModel.isActive],
      countryId: [this.locationModel.countryID],
      stateId: [this.locationModel.stateID]
    });
    this.loadMasterData();
    this.activatedRoute.queryParams.subscribe(params => {
      this.locationId = params['id'] == undefined ? null : params['id'];
      if (this.locationId != undefined && this.locationId != null)
        this.isEdit = true;
      this.getLocationDetailsById();
    });
  }
  get formControls() { return this.locationForm.controls; }
  loadMasterData() {
    const masterData = { masterdata: 'MASTERCOUNTRY1,MASTERSTATE1' };
    this.locationService.getMasterData(masterData).subscribe((response: any) => {
      if (response) {
        this.masterCountry = response.masterCountry1;
        this.masterState = response.masterState1;
      }
    });
  }
  onSubmit() {
    if (this.locationForm.invalid) { return; }
    this.submitted = true;
    
    this.locationModel = this.locationForm.value;
    this.locationModel.isFromSuperAdmin = true;
    const formData = {
      ...this.locationModel
    };
    this.locationService.save(formData).subscribe((response) => {
      this.submitted = false;
      if (response.statusCode == 200) {
        this.notifier.notify('success', response.message);
        this.router.navigate(["webadmin/manage-locations"])
      } else {
        this.notifier.notify('error', response.message)
      }
    });
  }

  back() {
    this.router.navigate(["webadmin/manage-locations"]);
  }
  getLocationDetailsById() {
    this.locationService.getById(this.locationId).subscribe((response: ResponseModel) => {
      if (response != null && response.data != null) {
        this.locationModel = response.data;
        this.locationForm.patchValue(this.locationModel);
        this.locationForm.controls['countryId'].setValue(this.locationModel.countryID);
        this.locationForm.controls['stateId'].setValue(this.locationModel.stateID);
      }
    });
  }

  updateValue(country: any, addressObj: any) {
    this.usersService.getStateByCountryId(country).subscribe((res) => {
      if (res.statusCode == 200) {
        this.masterState = res.data;
        let stateIdMapped =
          this.masterState.find(
            (y) =>
              (y.value || "").toUpperCase() ==
              (addressObj.state || "").toUpperCase()
          ) == null
            ? null
            : this.masterState.find(
              (y) =>
                (y.value || "").toUpperCase() ==
                (addressObj.state || "").toUpperCase()
            ).id;

        // const pObJ = {
        //   address: addressObj.address1,
        //   countryID: country,
        //   city: addressObj.city,
        //   stateID: stateIdMapped,
        //   zip: addressObj.zip,
        //   latitude: addressObj.latitude,
        //   longitude: addressObj.longitude,
        //   apartmentNumber: "",

        // };
        // this.userForm.patchValue(pObJ);
      } else {
        this.masterState = [];
        this.notifier.notify("error", res.message);
      }
    });
    /*this.masterState =this.usersService.getStateByCountryId(country).toPromise();
    return this.masterState;*/
  }
}
