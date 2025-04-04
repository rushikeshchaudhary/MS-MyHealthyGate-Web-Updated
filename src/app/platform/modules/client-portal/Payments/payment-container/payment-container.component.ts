import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotifierService } from 'angular-notifier';
import { NavItem } from 'src/app/shared/models';
import { LoginUser } from '../../../core/modals/loginUser.modal';
import { CommonService } from '../../../core/services';
//import { LoginUser } from '../core/modals/loginUser.modal';
//import { CommonService } from "../core/services";

@Component({
  selector: 'app-payment-container',
  templateUrl: './payment-container.component.html',
  styleUrls: ['./payment-container.component.css']
})
export class PaymentContainerComponent implements OnInit {

  moduleTabs: NavItem[] = [];
  selectedTabIndex!: number;
  appointmentId!: number;
  isPatient=false;
  isProvider=false;
  constructor(
    private router:Router,
    private notifier: NotifierService,
    private route: ActivatedRoute,
    //private waitingRoomService: WaitingRoomService,
    private commonService: CommonService,
    private translate:TranslateService
  ) {
    this.inItTabs();
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
  }

inItTabs(){
  this.moduleTabs =[
    {displayName:'payment_history', route : "/web/client/payment/payment-history",iconName:""},
    { displayName: 'refund_history', route: "/web/client/payment/refund-history", iconName: "" },
    { displayName: 'card_history', route: "/web/client/payment/card-history", iconName: "" },
  ];

  // if(this.isProvider){
  //   this.moduleTabs = this.moduleTabs.filter(x => x.displayName != "Reschedule Appointment");
  //}
  //////debugger;
  const tabRoutes = [...this.moduleTabs];
  const routestabRoutes =  tabRoutes.map(x => x.route);
  const currentIndex = routestabRoutes.findIndex((x:any) => this.router.url.includes(x));
  if(currentIndex != -1) {
    this.selectedTabIndex = currentIndex;
  } else {
    this.selectedTabIndex = 0;
    //this.onTabChange(this.selectedTabIndex);
  }
}

  ngOnInit(): void {

  }

  onTabChange(tabIndex:any): void {
     const route = this.moduleTabs[tabIndex].route as string;
    this.router.navigate([route]);
  }

  // nextTab(){
  //   this.onTabChange(this.selectedTabIndex + 1)
  // }


}
