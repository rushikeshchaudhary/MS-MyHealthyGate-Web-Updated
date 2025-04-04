import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { map } from 'rxjs/operators';
import { CommonService } from "./../../platform/modules/core/services";
import  {ViewReportService} from './view-report.service'
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html',
  styleUrls: ['./view-report.component.css']
})
export class ViewReportComponent implements OnInit {
reportId:any;
result:any;
  constructor(
    public dialogPopup: MatDialogRef<ViewReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService,
    private commonService: CommonService,
    private viewReportService :ViewReportService,
    private translate:TranslateService
  ) { 
    translate.setDefaultLang( localStorage.getItem("language") || "en"|| "en");
    translate.use(localStorage.getItem("language") || "en"|| "en");
    this.reportId = data;
    
  }

  ngOnInit() {
    
    this.getReport();
  }
  
  onClose() {
    this.dialogPopup.close();
  }

  getReport()
  {
    
    this.viewReportService.getReport(this.reportId).pipe(map(x => {
      return x;
    })).subscribe(resp => {
      //////debugger;
       this.result=resp;
    });
  }

}
