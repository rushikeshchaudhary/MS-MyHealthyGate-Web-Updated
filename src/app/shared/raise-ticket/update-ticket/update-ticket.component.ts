import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from "@ngx-translate/core";



import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ticket } from 'src/app/platform/modules/client-portal/client-profile.model';

@Component({
  selector: 'app-update-ticket',
  templateUrl: './update-ticket.component.html',
  styleUrls: ['./update-ticket.component.css']
})
export class UpdateTicketComponent implements OnInit {
  ticketForm!: FormGroup;
  selectedFiles: File[] = [];
  fileList: any = [];
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { Ticket: Ticket },
    private ref: MatDialogRef<UpdateTicketComponent>,
    private translate:TranslateService,
  ) { 
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
  }

  ngOnInit() {
    this.initializeForm(this.data.Ticket);
    if(this.data.Ticket.files){
      this.handleAlreadySelectedFiles(this.data.Ticket.files)
    }
   
  }

  initializeForm(ticket: Ticket): void {
    this.ticketForm = this.fb.group({
      id: [ticket.id],
      category: [ticket.category, Validators.required],
      priority: [ticket.priority, Validators.required],
      description: [ticket.description, Validators.required],
      files: [ticket.files]
    });
  }
  onSubmit(event: Event): void {
    if (this.ticketForm.valid) {
      const updatedTicket: Ticket = { ...this.data.Ticket, ...this.ticketForm.value };
      updatedTicket.files = this.selectedFiles;
      console.log('Updated Ticket:', updatedTicket);
      this.ref.close(updatedTicket);
    } else {
      alert('Form is invalid.');
    }
  }

  removeFile(index: number) {
    const filename = (this.fileList[index].fileName);
    this.fileList.splice(index, 1);
    const indexToRemove = this.selectedFiles.findIndex((file) => file.name === filename);

    if (indexToRemove !== -1) {
      this.selectedFiles.splice(indexToRemove, 1);
    }

  }


  handleAlreadySelectedFiles(file: File[]) {
    const files: File[] = file;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExtension = file.name.split('.').pop()!.toLowerCase();

      this.selectedFiles.push(file);

      const reader = new FileReader();
      reader.onload = () => {
        const dataURL = reader.result;
        this.fileList.push({
          data: dataURL,
          ext: fileExtension,
          fileName: file.name,
        });
      };
      this.fileList = this.fileList;
      reader.readAsDataURL(file);
    }
  }

  handleImageChange(e:any ) {
    const files: FileList = e.target.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExtension = file.name.split('.').pop()!.toLowerCase();

      this.selectedFiles.push(file);

      const reader = new FileReader();
      reader.onload = () => {
        const dataURL = reader.result;
        this.fileList.push({
          data: dataURL,
          ext: fileExtension,
          fileName: file.name,
        });
      };

      reader.readAsDataURL(file);
    }
  }

  closeDialog(type:any ) {
    this.ref.close();
  }
}
