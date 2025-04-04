import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-popup',
  templateUrl: './video-popup.component.html',
  styleUrls: ['./video-popup.component.css']
})
export class VideoPopupComponent implements OnInit {
  videoData:any;
  playerSrc:any;

  constructor(
    private domSanitizer: DomSanitizer,
    private dialogModalRef: MatDialogRef<VideoPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.playerSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(this.data.videoPath);
      //this.videoData=this.data;
      console.log(this.data)
     }

  ngOnInit() {
  }
  closeDialog(action: any): void {
    this.dialogModalRef.close(action);
  }

}
