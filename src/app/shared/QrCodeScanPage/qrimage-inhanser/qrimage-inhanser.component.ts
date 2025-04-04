import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-qrimage-inhanser",
  templateUrl: "./qrimage-inhanser.component.html",
  styleUrls: ["./qrimage-inhanser.component.css"],
})
export class QRImageInhanserComponent implements OnInit {
  constructor(
    private dialogModalRef: MatDialogRef<QRImageInhanserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
  }

  closeDialog=()=>{
    this.dialogModalRef.close()
  }
}
