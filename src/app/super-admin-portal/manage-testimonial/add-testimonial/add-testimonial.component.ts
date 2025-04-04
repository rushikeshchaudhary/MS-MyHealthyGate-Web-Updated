import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { ResponseModel } from '../../core/modals/common-model';
import { CommonService } from '../../core/services/common.service';
import { ManageTestimonialService } from '../manage-testimonial.service';
import { ManageTestimonialModel } from './manage-testimonial.model';

@Component({
  selector: 'app-add-testimonial',
  templateUrl: './add-testimonial.component.html',
  styleUrls: ['./add-testimonial.component.css']
})
export class AddTestimonialComponent implements OnInit {
  testimonialForm!: FormGroup;
  testimonialModel: ManageTestimonialModel;
  testimonialId!: number;
  isEdit: boolean = false;
  submitted: boolean = false;
  masterCountry: Array<any> = []
  masterState: Array<any> = [];
  dataURL: string | ArrayBuffer = '';
  imagePreview: string ="";
  constructor(private formBuilder: FormBuilder, private router: Router,
    private activatedRoute: ActivatedRoute, private testimonialService: ManageTestimonialService,
    private notifier: NotifierService,
    private commonService: CommonService,
    private notifierService: NotifierService) {
    this.testimonialModel = new ManageTestimonialModel();
  }
  ngOnInit() {
    this.testimonialForm = this.formBuilder.group({
      id: [this.testimonialModel.id],
      name: [this.testimonialModel.name],
      description: [this.testimonialModel.description],
      organizationName: [this.testimonialModel.organizationName],
      isActive: [this.testimonialModel.isActive],
      profilePic: [this.testimonialModel.profilePic, [Validators.required]],
      imgad: [this.testimonialModel.profilePic, [Validators.required]]
    });
    this.loadMasterData();
    this.activatedRoute.queryParams.subscribe(params => {
      this.testimonialId = params['id'] == undefined ? null : params['id'];
      if (this.testimonialId != undefined && this.testimonialId != null)
        this.isEdit = true;
      this.getTestimonialDetailsById();
    });
  }
  get formControls() { return this.testimonialForm.controls; }
  loadMasterData() {
    const masterData = { masterdata: 'MASTERCOUNTRY1,MASTERSTATE1' };
    this.testimonialService.getMasterData(masterData).subscribe((response: any) => {
      if (response) {
        this.masterCountry = response.masterCountry1;
        this.masterState = response.masterState1;
      }
    });
  }
  onSubmit() {
    if (this.testimonialForm.invalid) { return; }
    this.submitted = true;

    this.testimonialModel = this.testimonialForm.value;
    this.testimonialModel.isFromSuperAdmin = true;
    this.testimonialModel.profilePic = this.imagePreview;
    const formData = {
      ...this.testimonialModel
    };
    this.testimonialService.save(formData).subscribe((response) => {
      this.submitted = false;
      if (response.statusCode == 200) {
        this.notifier.notify('success', response.message);
        this.router.navigate(["webadmin/manage-testimonial"])
      } else {
        this.notifier.notify('error', response.message)
      }
    });
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
        //this.dataURL = reader.result;
        this.dataURL = "";
      };
      reader.readAsDataURL(input.files[0]);
      const formData = new FormData();
      formData.append("file", input.files[0], input.files[0].name);
      this.testimonialService.uploadFile(formData).subscribe((response) => {
        this.testimonialForm.controls["profilePic"].setValue(response);
        this.dataURL = response;
        this.imagePreview = response;
      });
    }
    else
      this.notifier.notify('error', "Please select valid file type")
      return;
  }
  back() {
    this.router.navigate(["webadmin/manage-testimonial"]);
  }
  getTestimonialDetailsById() {
    this.testimonialService.getById(this.testimonialId).subscribe((response: ResponseModel) => {
      if (response != null && response.data != null) {
        this.testimonialModel = response.data;
        this.testimonialForm.patchValue(this.testimonialModel);
        this.dataURL =  response.data.profilePic;
        this.imagePreview =  response.data.profilePic;
      }
    });
  }
}
