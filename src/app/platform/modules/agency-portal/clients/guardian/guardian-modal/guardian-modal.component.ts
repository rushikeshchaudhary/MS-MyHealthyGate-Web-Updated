import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClientsService } from '../../clients.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { GuardianModel } from '../../guardian.model';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-guardian-modal',
  templateUrl: './guardian-modal.component.html',
  styleUrls: ['./guardian-modal.component.css']
})
export class GuardianModalComponent implements OnInit {
  guardianModel: GuardianModel;
  guardianForm!: FormGroup;
  submitted: boolean = false;
  headerText: string = 'Add Guardian/Guarantor';
  masterRelationship!: any[];
  patientId: number;
  @Output() refreshGrid: EventEmitter<any> = new EventEmitter<any>();
  selectedPhoneCode: string = "0";
  phoneCountryCode: any;

  constructor(private formBuilder: FormBuilder, private guardianDialogModalRef: MatDialogRef<GuardianModalComponent>,
    private clientService: ClientsService,    private translate:TranslateService,

    @Inject(MAT_DIALOG_DATA) public data: any, private notifier: NotifierService) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.guardianModel = data.guardian;
    this.refreshGrid.subscribe(data.refreshGrid);
    if (this.guardianModel.id != null && this.guardianModel.id > 0)
      this.headerText = 'Edit Guardian/Guarantor';
    else
      this.headerText = 'Add Guardian/Guarantor';

    this.patientId = this.guardianModel.patientID;
    this.selectedPhoneCode = !this.guardianModel.guardianHomePhone ? "0" : this.guardianModel.guardianHomePhone.split(" ").length == 1 ? "0" : this.guardianModel.guardianHomePhone.split(" ")[0];
    this.selectedPhoneCode = this.selectedPhoneCode.replace("(", "").replace(")", "");
  }

  ngOnInit() {
    this.guardianForm = this.formBuilder.group({
      id: [this.guardianModel.id],
      guardianFirstName: [this.guardianModel.guardianFirstName],
      guardianLastName: [this.guardianModel.guardianLastName],
      guardianMiddleName: [this.guardianModel.guardianMiddleName],
      guardianHomePhone: [!this.guardianModel.guardianHomePhone? "0" : this.guardianModel.guardianHomePhone,[Validators.required],],
      guardianEmail: [this.guardianModel.guardianEmail,[Validators.email]],
      relationshipID: [this.guardianModel.relationshipID],
      isGuarantor: [this.guardianModel.isGuarantor],
    });
    this.getMasterData();
  }
  get formControls() { return this.guardianForm.controls; }
  onSubmit(event: any) {
    if (!this.guardianForm.invalid) {
      let clickType = event.currentTarget.name;
      this.submitted = true;
      this.guardianModel = this.guardianForm.value;
      this.guardianModel.patientID = this.patientId;
      this.guardianModel.isActive = true;
      this.guardianModel.guardianHomePhone = this.selectedPhoneCode == '0' ? this.guardianModel.guardianHomePhone : this.selectedPhoneCode.trim() + " " + this.guardianModel.guardianHomePhone;
      this.clientService.createGuardian(this.guardianModel).subscribe((response: any) => {
        this.submitted = false;
        if (response.statusCode == 200) {
          this.notifier.notify('success', response.message)
          if (clickType == "Save")
          {
            this.closeDialog('save');
          }
          else if (clickType == "SaveAddMore") {
            this.refreshGrid.next("");
            this.guardianForm.reset();
          }
        } else {
          this.notifier.notify('error', response.message)
        }
      });
    }
  }
  closeDialog(action: string): void {
    this.guardianDialogModalRef.close(action);
  }

  getMasterData() {
    let data = "MASTERRELATIONSHIP";
    this.clientService.getMasterData(data).subscribe((response: any) => {
      if (response != null) {
        this.masterRelationship = response.masterRelationship != null ? response.masterRelationship : [];
      }
    });
  }

  phoneCodeChange($event: string) {
    this.phoneCountryCode = $event;
    this.selectedPhoneCode = $event;
  }

}
