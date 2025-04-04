import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { ResponseModel } from 'src/app/platform/modules/core/modals/common-model';
import { ManageSubscriptionplansService } from '../manage-subscriptionplans.service';
import { ManageSubscriptionplans } from './manage-subscriptionplans.model';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-add-subscriptionplans',
  templateUrl: './add-subscriptionplans.component.html',
  styleUrls: ['./add-subscriptionplans.component.css'],
})
export class AddSubscriptionplansComponent implements OnInit {
  subscriptionplanForm!: FormGroup;
  subscriptionplanModel: ManageSubscriptionplans;
  subscriptionplanId: number = 0;
  typeOfPlan: any = ['Basic', 'Premium'];
  selectedPlan: string = 'Basic';
  isEdit: boolean = false;
  submitted: boolean = false;
  maxDate = new Date();

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter descriptions here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',

    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
  };

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private subscriptionplanService: ManageSubscriptionplansService,
    private notifier: NotifierService
  ) {
    this.subscriptionplanModel = new ManageSubscriptionplans();
  }

  ngOnInit() {
    this.subscriptionplanForm = this.formBuilder.group({
      id: [this.subscriptionplanModel.id],
      organizationId: [this.subscriptionplanModel.organizationId],
      amountPerClient: [this.subscriptionplanModel.amountPerClient],
      title: [this.subscriptionplanModel.title],
      planType: ['Basic'],
      descriptions: [
        this.subscriptionplanModel.descriptions,
        [Validators.required],
      ],
      phone: [this.subscriptionplanModel.phone],
      isActive: [this.subscriptionplanModel.isActive],
      subscriberName: [this.subscriptionplanModel.subscriberName],
      expiryDate: [this.subscriptionplanModel.expiryDate],
      startDate: [this.subscriptionplanModel.startDate],
    });
    this.activatedRoute.queryParams.subscribe((params) => {
      this.subscriptionplanId = params['id'] == undefined ? null : params['id'];
      if (
        this.subscriptionplanId != undefined &&
        this.subscriptionplanId != null
      )
        this.isEdit = true;
      this.getSubscriptionPlanDetailsById();
    });
  }
  get formControls() {
    return this.subscriptionplanForm.controls;
  }
  onSubmit() {
    if (this.subscriptionplanForm.invalid) {
      return;
    }
    this.submitted = true;

    this.subscriptionplanModel = this.subscriptionplanForm.value;
    this.subscriptionplanModel.isFromSuperAdmin = true;
    const formData = {
      ...this.subscriptionplanModel,
    };
    this.subscriptionplanService.save(formData).subscribe((response) => {
      this.submitted = false;
      if (response.statusCode == 200) {
        this.notifier.notify('success', response.message);
        this.router.navigate(['webadmin/manage-subscriptionplans']);
      } else {
        this.notifier.notify('error', response.message);
      }
    });
  }
  onModeChange(mode: any) {
    this.selectedPlan = mode;
    //this.typeOfPlan.mode = mode;
  }
  back() {
    this.router.navigate(['webadmin/manage-subscriptionplans']);
  }
  getSubscriptionPlanDetailsById() {
    this.subscriptionplanService
      .getById(this.subscriptionplanId)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.data != null) {
          this.subscriptionplanModel = response.data;
          this.subscriptionplanForm.patchValue(this.subscriptionplanModel);
        }
      });
  }
}
