import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-securitywecome',
  templateUrl: './securitywecome.component.html',
  styleUrls: ['./securitywecome.component.css']
})
export class SecuritywecomeComponent implements OnInit {

  constructor(
    private dialogModalRef: MatDialogRef<SecuritywecomeComponent>
  ) { }

  ngOnInit() {
  }
  closeDialog=()=> {
    this.dialogModalRef.close();
  }

}
