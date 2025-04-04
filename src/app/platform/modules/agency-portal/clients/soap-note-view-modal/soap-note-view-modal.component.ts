import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-soap-note-view-modal',
  templateUrl: './soap-note-view-modal.component.html',
  styleUrls: ['./soap-note-view-modal.component.css']
})
export class SoapNoteViewModalComponent implements OnInit {

  jsonFormData: any = { components: [] };
  initialFormValues: any = { data: {} };
  formattedTemplateData!: string;
  templateFormName!: string;

  constructor(
    private dialogModalRef: MatDialogRef<SoapNoteViewModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
 
  this.TemplateData();

  }
  TemplateData(): void {
  
   
    let formJson:any = { components: [] },
    formData = { data: {} };
    try {
      formJson = JSON.parse(this.data.templateJson);
      formData = JSON.parse(this.data.templateData);
    } catch (err) {}

    formJson.components=formJson.components.filter((component:any) => component.type !== 'button');
    this.jsonFormData = this.data.templateJson
      ? formJson
      : this.jsonFormData;
    this.templateFormName = this.data.templateName || "";
    this.initialFormValues = this.data.templateData
      ? formData
      : this.initialFormValues
    
  } 

  closeDialog(action: string) {
    this.dialogModalRef.close(action);
  }
}
