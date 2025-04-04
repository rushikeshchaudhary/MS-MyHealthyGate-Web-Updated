import { Component, Input, OnInit } from '@angular/core';
import { VitalModalComponent } from '../vitals/vital-modal/vital-modal.component';
import { VitalModel } from '../vitals/vitals.model';
import { format } from 'date-fns';
import { FilterModel } from '../medication/medication.model';
import { ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { ClientsService } from '../clients.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from 'src/app/shared/layout/dialog/dialog.service';
import { CommonService } from '../../../core/services';
import { MediCertificateModalComponent } from './medi-certificate-modal/medi-certificate-modal.component';
import { TemplateModel } from '../../template/template.model';

@Component({
  selector: 'app-medi-certificate',
  templateUrl: './medi-certificate.component.html',
  styleUrls: ['./medi-certificate.component.css']
})
export class MediCertificateComponent implements OnInit {
  @Input() encryptedPatientId:any;
  @Input() encryptedPatientUserId:any;
  @Input() appointmentId: number = 0;
  templateData: TemplateModel = new TemplateModel;

 
  clientId!: number;
  header: string = "Med Certificate";
  isGrid:boolean=false;
displayedColumns: any[]=[];
vitalListingData: any[]=[];
metaData: any;
actionButtons: any[]=[];
  constructor(
    private activatedRoute: ActivatedRoute,
    public dialogModal: MatDialog,
    private commonService: CommonService
  ) {}
  ngOnInit() {
    this.commonService.loadingStateSubject.next(true);

    if (this.encryptedPatientId == undefined) {
      const apptId = this.activatedRoute.snapshot.paramMap.get("id");
      this.activatedRoute.queryParams.subscribe((params) => {
        this.clientId =
          params['id'] == undefined
            ? this.commonService.encryptValue(apptId, false)
            : this.commonService.encryptValue(params['id'], false);
      });
    } else {
      console.log(this.appointmentId)
      this.clientId = this.commonService.encryptValue(
        this.encryptedPatientId,
        false
      );
    }   
    this.commonService.loadingStateSubject.next(false);
  }

  createTemplate(templateModel: TemplateModel) {
    if (templateModel.id == 0) {
      templateModel.id = 0;
      templateModel.title = "";
      templateModel.name = "";
      templateModel.staffID = 158;
      templateModel.date = new Date();
      templateModel.htmlContent = "";
    }

    let templateModal;
    templateModal = this.dialogModal.open(MediCertificateModalComponent, {
      data: { template: templateModel }
    });
    templateModal.afterClosed().subscribe((result) => {
    //  this.getAllTemplates();
    });
  }

  openDialog(){
    this.templateData = new TemplateModel();
      this.templateData.id = 0;
      this.createTemplate(this.templateData);
  }

  onTableActionClick(event:any){

  }

  onPageOrSortChange(event:any){

  }

}
