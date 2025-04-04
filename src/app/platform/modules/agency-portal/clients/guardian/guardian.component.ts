import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ClientsService } from '../clients.service';
import { GuardianModel } from '../guardian.model';
import { GuardianModalComponent } from './guardian-modal/guardian-modal.component';
import { ResponseModel } from '../../../core/modals/common-model';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { DialogService } from '../../../../../shared/layout/dialog/dialog.service';
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: 'app-guardian',
  templateUrl: './guardian.component.html',
  styleUrls: ['./guardian.component.css']
})
export class GuardianComponent implements OnInit {
  @Output() handleTabChange: EventEmitter<any> = new EventEmitter<any>();
  clientId!: number;
  guardianModel!: GuardianModel;
  submitted:boolean=false;
  guardianList: Array<GuardianModel> = [];
  constructor(private clientsService: ClientsService, private guardianDialogModal: MatDialog,
    private notifier: NotifierService, private dialogService: DialogService,
    private translate:TranslateService)
     {
      translate.setDefaultLang( localStorage.getItem("language") || "en");
       translate.use(localStorage.getItem("language") || "en");
  }

  ngOnInit() {
    this.getGuardianList(1, 1000);
  }

  onSubmit(event: any) {
    let clickType = event.currentTarget.name;

    this.handleTabChange.next({
      tab: "Address",
      clickType: clickType,
      id:this.clientId
    });
  }

  onPrevious(event: any){
    let clickType = event.currentTarget.name;
    this.handleTabChange.next({
      tab: "demographic_info",
      clickType: clickType,
      id:this.clientId
    });
  }

  openDialog(id?: number) {
    if (id != null && id > 0) {
      this.clientsService.getGuardianById(id).subscribe((response: any) => {
        if (response != null && response.data != null) {
          this.guardianModel = response.data;
          this.createModal(this.guardianModel);
        }
      });
    }
    else {
      this.guardianModel = new GuardianModel();
      this.createModal(this.guardianModel);
    }
  }

  delete(id: number) {
    this.dialogService.confirm("Are you sure you want to delete client's guardian?").subscribe((result: any) => {
      if (result == true) {
        this.clientsService.deleteGuardian(id).subscribe((response: any) => {
          if (response != null && response.data != null) {
            if (response.statusCode == 200) {
              this.notifier.notify('success', response.message);
              this.getGuardianList(1, 1000);
            } else {
              this.notifier.notify('error', response.message)
            }
          }
        });
      }
    })
  }

  createModal(guardianModel: GuardianModel) {
    //////debugger
    this.guardianModel.patientID = this.clientId;
    let guardianModal;
    guardianModal = this.guardianDialogModal.open(GuardianModalComponent, { data: { guardian: guardianModel, refreshGrid: this.refreshGrid.bind(this) } })
    guardianModal.afterClosed().subscribe((result: string) => {
      if (result == 'save')
        this.getGuardianList(1, 1000);

    });
  }

  getGuardianList(pageNumber: number, pageSize: number) {
    this.clientsService.getGuardianList(this.clientId, pageNumber, pageSize).subscribe((response: ResponseModel) => {
      if (response != null && response.data != null && response.data.length > 0) {
        this.guardianList = response.data;
      } else {
        this.guardianList;
        if (response.statusCode == 404) {
          this.guardianList=[];                
        }
      }
    }
    );
  }
  refreshGrid(data: any) {
    this.getGuardianList(1, 1000);
  }
}
