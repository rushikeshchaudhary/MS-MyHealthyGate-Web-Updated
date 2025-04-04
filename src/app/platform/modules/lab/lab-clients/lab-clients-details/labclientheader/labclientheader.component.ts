import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { ClientHeaderModel } from 'src/app/platform/modules/agency-portal/clients/client-header.model';
import { ClientsService } from 'src/app/platform/modules/agency-portal/clients/clients.service';
import { ResponseModel } from 'src/app/platform/modules/core/modals/common-model';
import { CommonService } from 'src/app/platform/modules/core/services';

@Component({
  selector: 'app-labclientheader',
  templateUrl: './labclientheader.component.html',
  styleUrls: ['./labclientheader.component.css']
})
export class LabclientheaderComponent implements OnInit {
  @Input() clientId!: number;
  @Input() headerText: string = "My Client";
  clientHeaderModel: ClientHeaderModel;
  isProvider: boolean = false;
  constructor(
    private clientService: ClientsService,
    private router: Router,
    private commonService: CommonService
  ) {
    this.clientHeaderModel = new ClientHeaderModel();
  }

  ngOnInit() {
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        if (user.userRoles && user.userRoles.roleName == 'Provider') {
          this.isProvider = true;
        }
      }
    });
  }
  getClientHeaderInfo() {
    this.clientService.getClientHeaderInfo(this.clientId).subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200) {
        this.clientHeaderModel = response.data;
        this.clientHeaderModel.patientBasicHeaderInfo != null ? this.clientHeaderModel.patientBasicHeaderInfo.dob = format(new Date(this.clientHeaderModel.patientBasicHeaderInfo.dob), 'MM/dd/yyyy') : '';
        const userId = this.clientHeaderModel.patientBasicHeaderInfo && this.clientHeaderModel.patientBasicHeaderInfo.userId;
        this.clientService.updateClientNavigations(this.clientId, userId);
      }
    });
  }
  ngOnChanges(value: any) {
    if (this.clientId != undefined && this.clientId != null)
      this.getClientHeaderInfo();
  }


  onNavigate(urlType: any = null) {
    if (this.clientId) {
      if (urlType == 'Profile') {
        //this.router.navigate(["/web/client/profile"], { queryParams: { id: this.commonService.encryptValue(this.clientId, true) } });
        const url = this.router.serializeUrl(this.router.createUrlTree(['/web/client/profile'], { queryParams: { id: this.commonService.encryptValue(this.clientId, true)  }, queryParamsHandling: 'merge' }));
        window.open(url, '_blank');
      } else {
        if (this.isProvider) {
          // this.router.navigate(["/web/manage-users/availability"], { queryParams: { cId: this.commonService.encryptValue(this.clientId, true) } });
          this.router.navigate(["/web/my-appointments"], { queryParams: { cId: this.commonService.encryptValue(this.clientId, true) } });          
        } else {
          // this.router.navigate(["/web/client/scheduling"], { queryParams: { cId: this.commonService.encryptValue(this.clientId, true) } });
          // this.router.navigate(["/web/client/my-scheduling"]);
          this.router.navigate(["/web/client/managelab"]);
        }
      }
    }
  }
}
