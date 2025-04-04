import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: 'app-lab-data-table',
  templateUrl: './lab-data-table.component.html',
  styleUrls: ['./lab-data-table.component.css']
})
export class LabDataTableComponent implements OnInit, OnChanges {
  @Input()
  inputColumns: any[] = [];
  @Input()
  inputButtons: any[] = [];
  @Input()
  inputSource: any[] = [];
  @Input()
  showTooltip: boolean = false;
  @Output() onTableActionClick = new EventEmitter();

  displayedColumns: Array<any> = [];
  extraColumns: Array<any> = [];
  columnsToDisplay: Array<any> = [];
  
  dataSource: Array<any> = [];
  metaData: any;
  actionButton: Array<any> = [];
  noRecords: Array<any> = [];
  isLoadingResults = true;
  tooltipText:any='';

  constructor(private translate:TranslateService) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
   }
  ngOnChanges(value: any) {
    this.tooltipText=this.showTooltip?"Click to view options":" ";
    console.log()
    if (value.inputColumns) {
      this.displayedColumns = (value.inputColumns.currentValue || []).filter(
        (        x: { key: string; }) => x.key != "Actions"
      );
      let changedColumns = (this.displayedColumns || []).map(obj => obj.key);
      if (
        value.inputButtons != null &&
        value.inputButtons.currentValue.length > 0
      )
        changedColumns.push("Actions");
      this.columnsToDisplay = changedColumns;
      this.extraColumns = (value.inputColumns.currentValue || []).filter(
        (        x: { key: string; }) => x.key == "Actions"
      );
    }
    if (value.inputSource) {
      this.isLoadingResults = false;
      this.dataSource = value.inputSource.currentValue;
    }
    if (value.inputMeta) {
      this.metaData = value.inputMeta.currentValue 
    }
    if (value.inputButtons) {
      this.actionButton = value.inputButtons.currentValue || [];
    }
  }

  onActionClick(action: string, data: any) {
    
    const actionObj = {
      action,
      data
    };
    console.log(actionObj)
    this.onTableActionClick.emit(actionObj);
  }

  onCellClick(action: string | any, data: any)
  {
    const actionObj = {
      action,
      data
    };
    console.log(actionObj)
    this.onTableActionClick.emit(actionObj);
  }

  ngOnInit() {
  }

}
