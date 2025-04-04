import { Component, OnChanges, Input, Inject, Output, EventEmitter, Optional, OnInit, ViewChild } from '@angular/core';
import { saveAs } from 'file-saver';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { FileViewModel } from 'src/app/platform/modules/agency-portal/users/users.model';
import { stringify } from 'querystring';
import { count } from 'console';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-doc-viewer',
  templateUrl: './doc-viewer.component.html',
  styleUrls: ['./doc-viewer.component.css']
})
export class DocViewerComponent implements OnInit {
  message: string = '';
  viewer:any = 'google';
  doc: string='';

  docTypes = ['TXT','DOC','DOCX','XLS','XLSX','PPT','PPTX','PDF','PAGES','TIFF','SVG']
  imgTypes = ['JPG','JPEG','PNG'];
  videoTypes= ['MP4','mov','wmv','AVI','AVCHD','FLV','F4V','SWF','MKV','WEBM','HTML5','MPEG-2'];
  
  isDocFile = false;
 

  videoUrl:any;
  docBlob!:Blob;
  isImage!:boolean;
  isVideo!:boolean;
  iHeight:number=0;
  iWidth:number=0;
  fileName:string='';
  @ViewChild('video') matVideo: any;
  video!:HTMLVideoElement;
  fileUrl:any;
  fileUrl2:any;
file:string;
file2:string;

  constructor(
    public dialogPopup: MatDialogRef<DocViewerComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: FileViewModel,
    private sanitizer:DomSanitizer,private translate:TranslateService
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    //////debugger
    this.file = String(data);
    this.fileUrl2 = String(this.file).split('.').pop();
    this.file2= this.fileUrl2;
    this.fileUrl=data;
    const fileType = this.file2.toUpperCase();
    if(this.docTypes.includes(fileType)){
      this.isDocFile = true;
      this.doc = this.file;//data.fileUrl;
    } else if(this.imgTypes.includes(fileType)){
      this.isImage = true;
      this.doc = this.file;
     // this.documentOpen(data.blob);
    } else if(this.videoTypes.includes(fileType)) {
      this.isVideo = true;
      this.documentOpen(data.blob);
    }


    
  }

  ngOnInit() {

    //////debugger
  }

  closeDialog(action: string): void {
    this.dialogPopup.close(action);
  }


  documentOpen(file: any){
    //////debugger
    if(file ){
      this.fileUrl = undefined;
      this.iHeight = screen.height / 1.6;
      this.iWidth = screen.height -2;
      if(this.isImage){
        this.showImg(file);
      } else if(this.isVideo){
        this.docBlob = file;
        this.videoUrl =URL.createObjectURL(file);
      } else {
        const fileName =  this.data.fileUrl.substring(this.data.fileUrl.lastIndexOf('/') + 1);
        saveAs(file,fileName);
        this.closeDialog('');
      }
    }
  }


  showImg(blob:Blob){
    var thisClass = this;
    let reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      let base64String = reader.result as string;
      const imgStringArray = base64String.split(';');
      const imgString = 'data:' + blob.type + ';' + imgStringArray[1];
      thisClass.fileUrl = imgString;
    }
  }

}

