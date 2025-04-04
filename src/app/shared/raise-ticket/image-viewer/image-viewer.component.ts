import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.css']
})
export class ImageViewerComponent implements OnInit {
  ticketAttachmentFiles: any[] = [];
  allFilesLoaded = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { Files: any[] },
    private ref: MatDialogRef<ImageViewerComponent>,
    private notifier: NotifierService,
    private translate:TranslateService,
  ) { 
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
  }
  ngOnInit(): void {
    this.ticketAttachmentFiles=this.data.Files;
    this.allFilesLoaded=true;
  //  console.log(this.ticketAttachmentFiles);
    
  }

  extractNameInfo(data:any){

  }

  viewFile(path: string, fileName: string) {
    if (path !== "") {
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.target = "_blank";
      a.href = path;
      // a.download = fileName;
      a.click();
      a.remove();
    } else {
      this.notifier.notify("error", "Cannot download this file"); 
    }
  }


  // downloadFile(path: string, fileName: string) {
  //   if (path !== "") {
  //     const link = document.createElement("a");
  //     link.href = path;
  //     link.download = fileName;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   }
  // else{
  //   this.notifier.notify("error", "cannot download this file");
  // }
  // }
  
  closeDialog() {
    this.ref.close();
  }
}


