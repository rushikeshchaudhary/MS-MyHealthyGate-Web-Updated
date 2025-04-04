import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-paymentforadmin',
  templateUrl: './manage-paymentforadmin.component.html',
  styleUrls: ['./manage-paymentforadmin.component.css']
})
export class ManagePaymentforadminComponent implements OnInit {
  moduleTabs: Array<any> = [
    {
      displayName: "PaymentHistory",
      iconName: "",
      route: "SuperAdminPaymentHistory",
    },
    {
      displayName: "RefundHistory",
      iconName: "",
      route: "Total-Refund",
    },
    {
      displayName: "ManageFees",
      iconName: "",
      route: "ManageFeesRefunds",
    },
  ];
  selectedTabIndex: any;
  selectedTabDisplayName:any;
  private changeDetectorRef!: ChangeDetectorRef;
  constructor(private router: Router) { }

  ngOnInit() {
    this.onTabChange(0);
  }
  onTabChange(selectedTabIndex: number) {
    // const tab = this.moduleTabs[selectedTabIndex];
    // this.onItemSelected(tab);
    let data = this.moduleTabs.filter((ele, index) => {
      return index == selectedTabIndex;
    });
    this.selectedTabDisplayName = data[0].displayName

    console.log(data)
  }
  onItemSelected(item: { children: string | any[]; route: any; params: any; }) {
    if (!item.children || !item.children.length) {
      this.router.navigate([item.route], { queryParams: item.params || {} });
      this.changeDetectorRef.detectChanges();
    }
  }

}
