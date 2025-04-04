import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { DynamicFilterModel } from 'src/app/platform/modules/core/modals/common-model';
import { CommonService } from 'src/app/platform/modules/core/services';
import { TermsConditionModalComponent } from '../terms-conditions/terms-conditions.component';

@Component({
  selector: 'app-home-footer',
  templateUrl: './home-footer.component.html',
  styleUrls: ['./home-footer.component.css']
})
export class HomeFooterComponent implements OnInit {
  isContactUsSubmited=false
  filterModel: DynamicFilterModel = new DynamicFilterModel();
  allPages:any;
  organizationEmailAddress: string="info@smartdatainc.net";
  getOrganizationEmailAddressUrl="api/Organization/GetOrganizationEmailAddress";
  sendContactUsEmailUrl="api/Organization/SendContactUsEmail";
   getAllURL: string = 'DynamicPage/GetAll';
  contactUsText= new FormControl("",[Validators.email,Validators.required]);
    constructor(private commonService: CommonService, private dialogModal: MatDialog,
      private notifier: NotifierService) { 
    this.getOrganizationEmailAddress();
  }


  ngOnInit() {
    this.getAllStaticPages();
  }

  getOrganizationEmailAddress(){
    this.commonService.get(this.getOrganizationEmailAddressUrl).subscribe( res => this.organizationEmailAddress = res.data);
  }
  opentermconditionmodal() {
    let dbModal;
    dbModal = this.dialogModal.open(TermsConditionModalComponent, {
      hasBackdrop: true,
      width:'70%'
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result != null && result != "close") {
        
      }
    });
  }

  get mailToAddress() :string{
    if(this.organizationEmailAddress){
      return "mailto:"+this.organizationEmailAddress+"?Subject=Hello%20again";
    } else {
      return "mailto:info@smartdatainc.net?Subject=Hello%20again";
    }
   
  }

  sendContactUsEmail(){
    //////debugger
    this.isContactUsSubmited= true;
    if(this.contactUsText.invalid){
      return;
    }
      const model = {EmailAddress:this.contactUsText.value};
      this.commonService.post(this.sendContactUsEmailUrl,model,true).subscribe(res => {
        if(res.data){
          this.notifier.notify('success','Submitted Successfully');
          this.contactUsText.setValue('');
          this.isContactUsSubmited= false;
        }
      });
    
  }

  getAllStaticPages() {
    this.filterModel.pageSize = 10;
    this.filterModel.isActiveRequired = true;
    var url = `${this.getAllURL}?sortOrder=${this.filterModel.sortOrder}&sortColumn=${this.filterModel.sortColumn}&pageNumber=${this.filterModel.pageNumber}&pageSize=${this.filterModel.pageSize}`;
    this.commonService.get(url).subscribe(res => {
      this.allPages = [];
      if (res != null && res.statusCode == 200) {
        this.allPages = res.data;
      }
    });
  }



}
