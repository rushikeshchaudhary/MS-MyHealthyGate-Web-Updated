import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { ImageViewerComponent } from 'src/app/shared/raise-ticket/image-viewer/image-viewer.component';

@Component({
  selector: 'app-superadmin-imageviewer',
  templateUrl: './superadmin-imageviewer.component.html',
  styleUrls: ['./superadmin-imageviewer.component.css']
})
export class SuperadminImageviewerComponent implements OnInit {

  ticketAttachmentFiles: any[] = [];
  allFilesLoaded = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { Files: any[] },
    private ref: MatDialogRef<ImageViewerComponent>,
    private notifier: NotifierService
  ) { }
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



  downloadFile(base64String: string, fileName: string) {
    const binaryString = window.atob(base64String);
    const byteArray = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([byteArray], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
  
    
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  }
  
  closeDialog() {
    this.ref.close();
  }

}
