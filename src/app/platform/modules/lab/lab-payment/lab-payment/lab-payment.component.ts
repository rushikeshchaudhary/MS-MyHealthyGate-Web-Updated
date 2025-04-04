import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonService } from '../../../core/services';
import { LabManageFeeComponent } from '../lab-manage-fee/lab-manage-fee.component';
import { LabPaymentHistoryComponent } from '../lab-payment-history/lab-payment-history.component';
import { LabRefundHistoryComponent } from '../lab-refund-history/lab-refund-history.component';

@Component({
  selector: 'app-lab-payment',
  templateUrl: './lab-payment.component.html',
  styleUrls: ['./lab-payment.component.css']
})
export class LabPaymentComponent implements OnInit {

  @ViewChild("tabContent", { read: ViewContainerRef })
  private tabContent!: ViewContainerRef;
  paymentTabs: any;
  selectedIndex: number = 0;



  constructor(
    private cfr: ComponentFactoryResolver,
    private commonService:CommonService

  ) { 
    this.paymentTabs = [
      { TabName: "Payment History", Component: LabPaymentHistoryComponent },
      { TabName: "Payment Refund", Component: LabRefundHistoryComponent },
      { TabName: "Manage Fee", Component: LabManageFeeComponent },
      
    ];
  }

  ngOnInit() {
    this.commonService.currentLoginUserInfo.subscribe(user=>{
      console.log(user)
     })
  
    this.loadChild("Payment History");
  }

  loadComponent(eventType: any): any {
    console.log(eventType)
    this.loadChild(eventType.tab.textLabel);
    
  }
  loadChild(childName: string) {
    let factory: any;
    factory = this.cfr.resolveComponentFactory(
      this.paymentTabs.find((x:any) => x.TabName == childName).Component
    );
    this.tabContent.clear();
    let comp: ComponentRef<LabPaymentHistoryComponent> =
      this.tabContent.createComponent(factory);
  }
  handleTabChange(data: any): any {

    this.selectedIndex = this.paymentTabs.findIndex((s:any) => s.TabName == data.tab);

    this.loadChild(data.tab);
  }


}
