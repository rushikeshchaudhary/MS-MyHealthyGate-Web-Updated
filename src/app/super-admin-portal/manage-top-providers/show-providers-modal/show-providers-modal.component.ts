import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { NotifierService } from 'angular-notifier';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { FilterModel, ResponseModel } from '../../core/modals/common-model';
import { ManageProvidersService } from '../../manage-providers/manage-providers.service';
import { ProviderModel } from '../../manage-providers/provider-model.model';

@Component({
  selector: 'app-show-providers-modal',
  templateUrl: './show-providers-modal.component.html',
  styleUrls: ['./show-providers-modal.component.css']
})
export class ShowProvidersModalComponent implements OnInit {
  filterModel!: FilterModel;

  showProvider!: FormGroup;
  staff1: any;
  staff2: any;
  staff3: any;
  staff4: any;
  staff5: any;
  staff6: any;
  staff7: any;
  staff8: any;
  staff9: any;
  staff10: any;
  errorMessage: string='';
  isInvalid: boolean = false;
  public websiteCtrl: FormControl = new FormControl();
  public websiteFilterCtrl: FormControl = new FormControl();
  public filteredWebsites: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  @ViewChild('singleSelect') singleSelect!: MatSelect;

  public websiteCtrl2: FormControl = new FormControl();
  public websiteFilterCtrl2: FormControl = new FormControl();
  public filteredWebsites2: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  @ViewChild('singleSelect2') singleSelect2!: MatSelect;

  public websiteCtrl3: FormControl = new FormControl();
  public websiteFilterCtrl3: FormControl = new FormControl();
  public filteredWebsites3: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  //@ViewChild('singleSelect2') singleSelect2: MatSelect;

  public websiteCtrl4: FormControl = new FormControl();
  public websiteFilterCtrl4: FormControl = new FormControl();
  public filteredWebsites4: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);


  public websiteCtrl5: FormControl = new FormControl();
  public websiteFilterCtrl5: FormControl = new FormControl();
  public filteredWebsites5: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroy = new Subject();

  public websiteCtrl6: FormControl = new FormControl();
  public websiteFilterCtrl6: FormControl = new FormControl();
  public filteredWebsites6: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);


  public websiteCtrl7: FormControl = new FormControl();
  public websiteFilterCtrl7: FormControl = new FormControl();
  public filteredWebsites7: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);


  public websiteCtrl8: FormControl = new FormControl();
  public websiteFilterCtrl8: FormControl = new FormControl();
  public filteredWebsites8: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);


  public websiteCtrl9: FormControl = new FormControl();
  public websiteFilterCtrl9: FormControl = new FormControl();
  public filteredWebsites9: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public websiteCtrl10: FormControl = new FormControl();
  public websiteFilterCtrl10: FormControl = new FormControl();
  public filteredWebsites10: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);


  //allProviders: ProviderModel[];
  constructor(private fb: FormBuilder,
    private notifier: NotifierService, private providerService: ManageProvidersService,
    private providerListDialogModalRef: MatDialogRef<ShowProvidersModalComponent>,
    @Inject(MAT_DIALOG_DATA) public allProviders: ProviderModel[]) { }

  ngOnInit() {
    this.filterModel = new FilterModel();
    // this.setInitialValue();
    let orderNo1 = this.allProviders.filter(d => d.orderNo == 1);
    /*if(orderNo1 && orderNo1.length>0){
      this.singleSelect.value=orderNo1[0];
    }*/

    this.filteredWebsites.next(this.allProviders.slice());

    //this.setInitialValue2();
    let orderNo2 = this.allProviders.filter(d => d.orderNo == 2);
    this.filteredWebsites2.next(this.allProviders.slice());

    //this.setInitialValue3();
    let orderNo3 = this.allProviders.filter(d => d.orderNo == 3);
    this.filteredWebsites3.next(this.allProviders.slice());

    let orderNo4 = this.allProviders.filter(d => d.orderNo == 4);
    this.filteredWebsites4.next(this.allProviders.slice());

    let orderNo5 = this.allProviders.filter(d => d.orderNo == 5);
    this.filteredWebsites5.next(this.allProviders.slice());

    let orderNo6 = this.allProviders.filter(d => d.orderNo == 6);
    this.filteredWebsites6.next(this.allProviders.slice());

    let orderNo7 = this.allProviders.filter(d => d.orderNo == 7);
    this.filteredWebsites7.next(this.allProviders.slice());

    let orderNo8 = this.allProviders.filter(d => d.orderNo == 8);
    this.filteredWebsites8.next(this.allProviders.slice());

    let orderNo9 = this.allProviders.filter(d => d.orderNo == 9);
    this.filteredWebsites9.next(this.allProviders.slice());

    let orderNo10 = this.allProviders.filter(d => d.orderNo == 10);
    this.filteredWebsites10.next(this.allProviders.slice());


    this.websiteFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks();
      });

    this.websiteFilterCtrl2.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterOrderNo2();
      });


    this.websiteFilterCtrl3.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterOrderNo3();
      });

    this.websiteFilterCtrl4.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterOrderNo4();
      });

    this.websiteFilterCtrl5.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterOrderNo5();
      });

    this.websiteFilterCtrl6.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterOrderNo6();
      });

    this.websiteFilterCtrl7.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterOrderNo7();
      });

    this.websiteFilterCtrl8.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterOrderNo8();
      });

    this.websiteFilterCtrl9.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterOrderNo9();
      });
    this.websiteFilterCtrl10.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterOrderNo10();
      });
    this.showProvider = this.fb.group({
      /* websiteFilterCtrl: [this.staff1],
       websiteFilterCtrl2: [this.staff2],*/
    });
    if (orderNo1 && orderNo1.length > 0) {
      console.log('order 1', orderNo1[0]);
      this.staff1 = orderNo1[0].staffID;
    }
    if (orderNo2 && orderNo2.length > 0) {
      console.log('order 2', orderNo2[0]);
      this.staff2 = orderNo2[0].staffID;
    }
    if (orderNo3 && orderNo3.length > 0) {
      console.log('order 3', orderNo3[0]);
      this.staff3 = orderNo3[0].staffID;
    }
    if (orderNo4 && orderNo4.length > 0) {
      console.log('order 4', orderNo4[0]);
      this.staff4 = orderNo4[0].staffID;
    }
    if (orderNo5 && orderNo5.length > 0) {
      console.log('order 3', orderNo5[0]);
      this.staff5 = orderNo5[0].staffID;
    }
    if (orderNo6 && orderNo6.length > 0) {
      this.staff6 = orderNo6[0].staffID;
    }
    if (orderNo7 && orderNo7.length > 0) {
      this.staff7 = orderNo7[0].staffID;
    }
    if (orderNo8 && orderNo8.length > 0) {
      this.staff8 = orderNo8[0].staffID;
    }
    if (orderNo9 && orderNo9.length > 0) {
      this.staff9 = orderNo9[0].staffID;
    }
    if (orderNo10 && orderNo10.length > 0) {
      this.staff10 = orderNo10[0].staffID;
    }
    // this.isValid();
    //this.getAllProviders();
  }

  ngOnDestroy() {
    this._onDestroy.next("");
    this._onDestroy.complete();
  }

  closeDialog(action: string) {
    this.providerListDialogModalRef.close(action);

  }
  getAllProviders() {
    this.filterModel.pageSize = 20;
    this.providerService
      .getAllProviders(this.filterModel,null,null,null)
      .subscribe((response: ResponseModel) => {
        if (response.statusCode == 200) {
          console.log(response.data);
          this.allProviders = response.data;
          // this.metaData = response.meta;
        } else {
          this.allProviders = [];
          // this.metaData = null;
        }
        /// this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];
      });
  }

  protected setInitialValue() {
    this.filteredWebsites
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: ProviderModel, b: ProviderModel) => a && b && a.staffID === b.staffID;
      });
  }


  protected setInitialValue2() {
    this.filteredWebsites
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect2.compareWith = (a: ProviderModel, b: ProviderModel) => a && b && a.staffID === b.staffID;
      });
  }

  protected filterBanks() {
    if (!this.allProviders) {
      return;
    }

    let search = this.websiteFilterCtrl.value;
    if (!search) {
      this.filteredWebsites.next(this.allProviders.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredWebsites.next(
      this.allProviders.filter(bank => bank.firstName.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterOrderNo2() {
    if (!this.allProviders) {
      return;
    }

    let search = this.websiteFilterCtrl2.value;
    if (!search) {
      this.filteredWebsites2.next(this.allProviders.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredWebsites2.next(
      this.allProviders.filter(bank => bank.firstName.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterOrderNo3() {
    if (!this.allProviders) {
      return;
    }

    let search = this.websiteFilterCtrl3.value;
    if (!search) {
      this.filteredWebsites3.next(this.allProviders.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredWebsites3.next(
      this.allProviders.filter(bank => bank.firstName.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterOrderNo4() {
    if (!this.allProviders) {
      return;
    }

    let search = this.websiteFilterCtrl4.value;
    if (!search) {
      this.filteredWebsites4.next(this.allProviders.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredWebsites4.next(
      this.allProviders.filter(bank => bank.firstName.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterOrderNo5() {
    if (!this.allProviders) {
      return;
    }

    let search = this.websiteFilterCtrl5.value;
    if (!search) {
      this.filteredWebsites5.next(this.allProviders.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredWebsites5.next(
      this.allProviders.filter(bank => bank.firstName.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterOrderNo6() {
    if (!this.allProviders) {
      return;
    }

    let search = this.websiteFilterCtrl6.value;
    if (!search) {
      this.filteredWebsites6.next(this.allProviders.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredWebsites6.next(
      this.allProviders.filter(bank => bank.firstName.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterOrderNo7() {
    if (!this.allProviders) {
      return;
    }

    let search = this.websiteFilterCtrl7.value;
    if (!search) {
      this.filteredWebsites7.next(this.allProviders.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredWebsites7.next(
      this.allProviders.filter(bank => bank.firstName.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterOrderNo8() {

    if (!this.allProviders) {
      return;
    }

    let search = this.websiteFilterCtrl8.value;
    if (!search) {
      this.filteredWebsites8.next(this.allProviders.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredWebsites8.next(
      this.allProviders.filter(bank => bank.firstName.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterOrderNo9() {
    if (!this.allProviders) {
      return;
    }

    let search = this.websiteFilterCtrl9.value;
    if (!search) {
      this.filteredWebsites9.next(this.allProviders.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredWebsites9.next(
      this.allProviders.filter(bank => bank.firstName.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterOrderNo10() {
    if (!this.allProviders) {
      return;
    }

    let search = this.websiteFilterCtrl10.value;
    if (!search) {
      this.filteredWebsites10.next(this.allProviders.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredWebsites10.next(
      this.allProviders.filter(bank => bank.firstName.toLowerCase().indexOf(search) > -1)
    );
  }

  onChange(event?:any) {
    this.isValid();
    //this.staff1
  }

  isValid() {
    let tempArr1: Array<any> = [];
    let tempArr2: Array<any> = [];
    let tempArr3: Array<any> = [];
    let tempArr4: Array<any> = [];
    let tempArr5: Array<any> = [];
    let tempArr6: Array<any> = [];
    let tempArr7: Array<any> = [];
    let tempArr8: Array<any> = [];
    let tempArr9: Array<any> = [];
    let tempArr10: Array<any> = [];

    tempArr1.push(this.staff2); tempArr1.push(this.staff3); tempArr1.push(this.staff4); tempArr1.push(this.staff5); tempArr1.push(this.staff6); tempArr1.push(this.staff7); tempArr1.push(this.staff8); tempArr1.push(this.staff9); tempArr1.push(this.staff10);
    tempArr2.push(this.staff1); tempArr2.push(this.staff3); tempArr2.push(this.staff4); tempArr2.push(this.staff5); tempArr2.push(this.staff6); tempArr2.push(this.staff7); tempArr2.push(this.staff8); tempArr2.push(this.staff9); tempArr2.push(this.staff10);
    tempArr3.push(this.staff2); tempArr3.push(this.staff1); tempArr3.push(this.staff4); tempArr3.push(this.staff5); tempArr3.push(this.staff6); tempArr3.push(this.staff7); tempArr3.push(this.staff8); tempArr3.push(this.staff9); tempArr3.push(this.staff10);
    tempArr4.push(this.staff2); tempArr4.push(this.staff3); tempArr4.push(this.staff1); tempArr4.push(this.staff5); tempArr4.push(this.staff6); tempArr4.push(this.staff7); tempArr4.push(this.staff8); tempArr4.push(this.staff9); tempArr4.push(this.staff10);
    tempArr5.push(this.staff2); tempArr5.push(this.staff3); tempArr5.push(this.staff4); tempArr5.push(this.staff1); tempArr5.push(this.staff6); tempArr5.push(this.staff7); tempArr5.push(this.staff8); tempArr5.push(this.staff9); tempArr5.push(this.staff10);
    tempArr6.push(this.staff1); tempArr6.push(this.staff2); tempArr6.push(this.staff3); tempArr6.push(this.staff4); tempArr6.push(this.staff5); tempArr6.push(this.staff7); tempArr6.push(this.staff8); tempArr6.push(this.staff9); tempArr6.push(this.staff10);
    tempArr7.push(this.staff1); tempArr7.push(this.staff2); tempArr7.push(this.staff3); tempArr7.push(this.staff4); tempArr7.push(this.staff5); tempArr7.push(this.staff6); tempArr7.push(this.staff8); tempArr7.push(this.staff9); tempArr7.push(this.staff10);
    tempArr8.push(this.staff1); tempArr8.push(this.staff2); tempArr8.push(this.staff3); tempArr8.push(this.staff4); tempArr8.push(this.staff5); tempArr8.push(this.staff6); tempArr8.push(this.staff7); tempArr8.push(this.staff9); tempArr8.push(this.staff10);
    tempArr9.push(this.staff1); tempArr9.push(this.staff2); tempArr9.push(this.staff3); tempArr9.push(this.staff4); tempArr9.push(this.staff5); tempArr9.push(this.staff6); tempArr9.push(this.staff7); tempArr9.push(this.staff8); tempArr9.push(this.staff10);
    tempArr10.push(this.staff1); tempArr10.push(this.staff2); tempArr10.push(this.staff3); tempArr10.push(this.staff4); tempArr10.push(this.staff5); tempArr10.push(this.staff7); tempArr10.push(this.staff8); tempArr10.push(this.staff9); tempArr10.push(this.staff6);
    this.errorMessage = "";
    this.isInvalid = false;
    if (tempArr1.includes(this.staff1) || tempArr2.includes(this.staff2) || tempArr3.includes(this.staff3) || tempArr4.includes(this.staff4) || tempArr5.includes(this.staff5) || tempArr6.includes(this.staff6) || tempArr7.includes(this.staff7) || tempArr8.includes(this.staff8) || tempArr9.includes(this.staff9) || tempArr10.includes(this.staff10)) {
      this.isInvalid = true;
      this.errorMessage = `${this.errorMessage} Please select unique provider name.`
    }

    /*if (this.staff1 == this.staff2 || this.staff1 == this.staff3) {
      this.errorMessage = `${this.errorMessage} Top 1 and Top 2 Providers can't be same`;
    } else if (this.staff1 == this.staff3) {
      this.errorMessage = `${this.errorMessage} Top 1 and Top 3 Providers can't be same`;
    }*/
  }
  onSubmit() {
    var postData: Array<{ Id: number, OrderNo: number }> = [{
      Id: this.staff1,
      OrderNo: 1
    },
    {
      Id: this.staff2,
      OrderNo: 2
    },
    {
      Id: this.staff3,
      OrderNo: 3
    },
    {
      Id: this.staff4,
      OrderNo: 4
    },
    {
      Id: this.staff5,
      OrderNo: 5
    },
    {
      Id: this.staff6,
      OrderNo: 6
    },
    {
      Id: this.staff7,
      OrderNo: 7
    }, {
      Id: this.staff8,
      OrderNo: 8
    }, {
      Id: this.staff9,
      OrderNo: 9
    }, {
      Id: this.staff10,
      OrderNo: 10
    }];
    this.providerService.updateTopProviders(postData).subscribe((response: ResponseModel) => {
      if (response.statusCode == 200) {
        this.notifier.notify('success', 'Submitted Successfully');
        this.providerListDialogModalRef.close('close');
        // console.log(response.data);
      }
    }, error => {
      console.log(error);
    })
    this.isValid();
  }
}
