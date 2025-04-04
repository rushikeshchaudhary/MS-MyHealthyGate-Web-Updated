import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { ResponseModel } from '../core/modals/common-model';
import { CommonService } from '../core/services';
import { ManagePharmacyService } from '../manage-pharmacy/manage-pharmacy.service';
export class AdsModel {
  position: string="";
  size: string="";
  adImage: string="";
  IsOverright!: boolean;
  PhotoBase64!: boolean;
  shape?: string;
  IsActive?: boolean;
  id?: number;
}

export class AdsModelCount {
  position: string="";
  size: string="";
  imageCount: number=0;

}

@Component({
  selector: 'app-manage-ads',
  templateUrl: './manage-ads.component.html',
  styleUrls: ['./manage-ads.component.css']
})
export class ManageAdsComponent implements OnInit {

  manageAdsForm!: FormGroup;
  submitted = false;
  adsModel: AdsModel;
  getAdsCount: AdsModelCount[] = [];
  loading = false;
  imagePreview: any;
  dataURL: any;
  selectedSize: string="";
  getAllAdsList: AdsModel[] = [];
  metaData: any;

  constructor(private pharmacyService: ManagePharmacyService, private notifier: NotifierService, private commonService: CommonService, private formBuilder: FormBuilder, private notifierService: NotifierService) {
    this.adsModel = new AdsModel();
  }
  displayColumns: Array<any> = [
    { displayName: "Position", key: "position", isSort: true, class: "", width: "15%" },
    { displayName: "Size", key: "shape", isSort: true, class: "", width: "15%" },
    { displayName: "Actions", key: "Actions", isSort: true, class: "", width: "25%" },
    { displayName: "Image",type:"img", key: 'photoPath', isSort: true, class: "", width: "20%" }
  ];
  actionButtons: Array<any> = [
    { displayName: "Deactivate", key: "deactivate", class: "fa fa-ban" },
  ];
  position: Array<any> = [{ name: "Above Footer", value: "Footer" }, { name: "Above Membership", value: "Membership" }];

  ngOnInit() {
    this.manageAdsForm = this.formBuilder.group({
      position: [this.adsModel.position, [Validators.required]],
      size: '',
      adImage: [this.adsModel.adImage, [Validators.required]]
    });

    this.getAds();
    this.getAllAds();
    // this.selectedSize='Square';
  }
  get f() {
    return this.manageAdsForm.controls;
  }
  handleImageChange(e:any):any {
    if (this.commonService.isValidFileType(e.target.files[0].name, "image")) {
      var input = e.target;
      //The file size in MB adn max limit is 2.5 MB.
      //in bytes 2097152 = 2MB, 2621440 = 2.5 MB.
      let maxSize = 2621440;
      // console.log(e.target.files[0].size);
      if (e.target.files[0].size > maxSize) {
        this.notifierService.notify("error", "Please Select the image size less than 2.5 MB.");
        return false;
      }
      var reader = new FileReader();
      reader.onload = () => {
        this.dataURL = reader.result;
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
    else
      this.notifier.notify('error', "Please select valid file type");
      return
  }

  getAds() {
    this.pharmacyService.getAds().subscribe((response: ResponseModel) => {
      if (response.statusCode == 200) {
        this.getAdsCount = response.data;
        console.log(response.data);

      } else {
        console.log(response.data);
      }
    }, error => {
      console.log(error);
    });

  }
  getAllAds() {
    this.pharmacyService.getAllAds().subscribe((response: ResponseModel) => {
      if (response.statusCode == 200) {
        // console.log(response.data);
        this.getAllAdsList = response.data;
        this.getAllAdsList.forEach((d) => {
          d.shape = d.size == "1" ? "Square" : "Reactangle";
        })
        this.metaData = response.meta;
        this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];
      } else {
        this.getAllAdsList = [];
        this.metaData = null;

      }
    }, error => {
      console.log(error);
    });

  }
  onSubmit() {
    if (!this.manageAdsForm.invalid) {
      let count = this.getAdsCount.filter(d => d.position == this.manageAdsForm.value.position
        && d.size == this.manageAdsForm.value.size);
      this.adsModel.IsOverright = count != null && count.length > 0 ? this.manageAdsForm.value.size == 2 ? count[0].imageCount > 0
        : count[0].imageCount > 2 : false;

      if (!this.adsModel.IsOverright) {
        let count = this.getAdsCount.filter(d => d.position == this.manageAdsForm.value.position
          && d.size != this.manageAdsForm.value.size);
        this.adsModel.IsOverright = count != null && count.length > 0 ? this.manageAdsForm.value.size == 2 ? count[0].imageCount > 0
          : count[0].imageCount > 2 : false;
      }
      this.adsModel.position = this.manageAdsForm.value.position;
      this.adsModel.size = this.manageAdsForm.value.size;
      this.adsModel.PhotoBase64 = this.dataURL;

      this.pharmacyService.createAds(this.adsModel).subscribe((response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.imagePreview = null;
          this.notifierService.notify("success", response.message);
          this.manageAdsForm.reset();
          this.getAds();
          this.getAllAds();
        } else {
          this.notifierService.notify("error", response.message);
        }
      });
    }

  }
  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.id;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'DEACTIVATE':
        this.updateAdsStatus(id);
        break;
      default:
        break;
    }
  }
  updateAdsStatus(id: number) {
    var adsToUpdate = new AdsModel();
    adsToUpdate.id = id;
    adsToUpdate.IsActive = false;
    this.pharmacyService.updateAdsStatus(adsToUpdate).subscribe((response: ResponseModel) => {
      if (response.statusCode == 200) {
        this.notifier.notify('success', response.message);
        this.getAllAds();
      } else {
        this.notifier.notify('error', response.message);
      }
    })

  }
}
