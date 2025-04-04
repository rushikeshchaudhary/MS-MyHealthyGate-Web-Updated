import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { CommonService } from "../../core/services";

@Component({
  selector: "app-provider-msg",
  templateUrl: "./provider-msg.component.html",
  styleUrls: ["./provider-msg.component.css"],
})
export class ProviderMsgComponent implements OnInit {
  userData;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogModalRef: MatDialogRef<ProviderMsgComponent>,
    private translate:TranslateService,
    private commonservice:CommonService
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.userData=data
  }

  ngOnInit() {
    console.log(this.data)
    
  }

  closeDialog=()=> {
    this.dialogModalRef.close();
  }
}
