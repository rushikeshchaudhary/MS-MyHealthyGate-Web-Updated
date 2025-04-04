import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-review-modal',
  templateUrl: './review-modal.component.html',
  styleUrls: ['./review-modal.component.css']
})
export class ReviewModalComponent implements OnInit {
  reviewRatingList: any[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogModalRef: MatDialogRef<ReviewModalComponent>
  ) {
    console.log(this.data)
  }

  ngOnInit() {
    console.log(this.data,"Data");
    this.reviewRatingList=  this.data;
    console.log(this.reviewRatingList,"this.reviewRatingList")
  }

 

  closeDialog() {
    this.dialogModalRef.close();
  }

}
