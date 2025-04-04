import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Console } from 'console';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-desclaimer',
  templateUrl: './desclaimer.component.html',
  styleUrls: ['./desclaimer.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DesclaimerComponent implements OnInit {

  constructor(private dialogModalRef: MatDialogRef<DesclaimerComponent>,private translate:TranslateService) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
  }

  ngOnInit() {
  }
  closeDialog(action: any): void {
    this.dialogModalRef.close(action);
  }
  onsubmit() {
    sessionStorage.setItem('iagree', 'yes');
    this.dialogModalRef.close();
  }
}
