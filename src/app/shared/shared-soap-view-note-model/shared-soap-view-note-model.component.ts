import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SoapNoteViewModalComponent } from 'src/app/platform/modules/agency-portal/clients/soap-note-view-modal/soap-note-view-modal.component';

@Component({
  selector: 'app-shared-soap-view-note-model',
  templateUrl: './shared-soap-view-note-model.component.html',
  styleUrls: ['./shared-soap-view-note-model.component.css']
})
export class SharedSoapViewNoteModelComponent implements OnInit {

 
  jsonFormData: any = { components: [] };
  initialFormValues: any = { data: {} };
  formattedTemplateData: string="";
  templateFormName: string="";

  constructor(
    private dialogModalRef: MatDialogRef<SoapNoteViewModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
 
  this.TemplateData();

  }
  // TemplateData(): void {
  
   
  //   let formJson = { components: [] },
  //   formData = { data: {} };
  //   try {
  //     formJson = JSON.parse(this.data.templateJson);
  //     formData = JSON.parse(this.data.templateData);
  //   } catch (err) {}
    
  //   formJson.components=formJson.components.filter(component => component.type !== 'button');
    
  //   this.jsonFormData = this.data.templateJson
  //     ? formJson
  //     : this.jsonFormData;
  //   this.templateFormName = this.data.templateName || "";
  //   this.initialFormValues = this.data.templateData
  //     ? formData
  //     : this.initialFormValues
    
  // } 

  TemplateData(): void {
    let formJson: { components: any[] } = { components: [] };
    let formData: { data: any } = { data: {} };
  
    try {
     
      formJson = JSON.parse(this.data.templateJson || '{}');
      formData = JSON.parse(this.data.templateData || '{}');
    } catch (err) {
      console.error('Error parsing JSON:', err);
    }
  
    
    if (Array.isArray(formJson.components)) {
      formJson.components = formJson.components.filter(component => component.type !== 'button');
    }
  
    
    this.jsonFormData = this.data.templateJson ? formJson : this.jsonFormData;
    this.templateFormName = this.data.templateName || "";
    this.initialFormValues = this.data.templateData ? formData : this.initialFormValues;
  }
  

  closeDialog(action: string) {
    this.dialogModalRef.close(action);
  }
}
