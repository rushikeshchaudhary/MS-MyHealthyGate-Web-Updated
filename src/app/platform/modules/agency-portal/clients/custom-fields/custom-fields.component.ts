import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ClientCustomLabelModel } from '../clientCustomLabel.model';
import { ResponseModel } from '../../../core/modals/common-model';
import { ClientsService } from '../clients.service';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { CommonService } from '../../../core/services';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-custom-fields',
  templateUrl: './custom-fields.component.html',
  styleUrls: ['./custom-fields.component.css'],
})
export class CustomFieldsComponent implements OnInit {
  @Output() handleTabChange: EventEmitter<any> = new EventEmitter<any>();
  clientId!: number;
  clientCustomLabels: ClientCustomLabelModel[] = [];
  submitted: boolean = false;
  constructor(
    private clientService: ClientsService,
    private notifier: NotifierService,
    private route: Router,
    private commonService: CommonService,
    private translate: TranslateService
  ) {
    translate.setDefaultLang(localStorage.getItem('language') || 'en');
    translate.use(localStorage.getItem('language') || 'en');
  }

  ngOnInit() {
    //////debugger
    this.getPatientCustomLabels();
  }
  getPatientCustomLabels() {
    this.clientService
      .getPatientCustomLabel(this.clientId)
      .subscribe((response: ResponseModel) => {
        if (response != null) {
          this.clientCustomLabels = response.data.PatientCustomLabels;
          this.clientCustomLabels.forEach((element) => {
            element.customLabelName = response.data.MasterCustomLabels.find(
              (x: { id: number }) => x.id == element.customLabelID
            ).customLabelName;
          });
        }
      });
  }
  onSubmit(event: any) {
    let clickType = event.currentTarget.name;
    this.clientCustomLabels.forEach((c) => (c.patientID = this.clientId));

    this.clientService
      .savePatientCustomLabel(this.clientCustomLabels)
      .subscribe((response: ResponseModel) => {
        if (response != null) {
          if (response.statusCode === 200) {
            this.notifier.notify('success', response.message);
            this.getPatientCustomLabels();
            if (clickType == 'SaveContinue') {
              this.route.navigate(['web/client/profile'], {
                queryParams: {
                  id: this.commonService.encryptValue(this.clientId, true),
                },
              });
            } else if (clickType == 'Save') {
              this.getPatientCustomLabels();
            }
          } else {
            this.notifier.notify('error', response.message);
          }
        }
      });
  }

  onPrevious() {
    this.handleTabChange.next({
      tab: 'Insurance',
      id: this.clientId,
    });
  }
}
