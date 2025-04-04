import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GetRaisedTicketByIdResponceModel, Ticket } from 'src/app/platform/modules/client-portal/client-profile.model';
import { UpdateTicketComponent } from 'src/app/shared/raise-ticket/update-ticket/update-ticket.component';

@Component({
  selector: 'app-superadminupdateraiseticket',
  templateUrl: './superadminupdateraiseticket.component.html',
  styleUrls: ['./superadminupdateraiseticket.component.css']
})
export class SuperadminupdateraiseticketComponent implements OnInit {

  ticketForm!: FormGroup;


  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { Ticket: GetRaisedTicketByIdResponceModel },
    private ref: MatDialogRef<UpdateTicketComponent>,
  ) { }

  ngOnInit() {
    this.initializeForm(this.data.Ticket);
    
  }

  initializeForm(ticket: GetRaisedTicketByIdResponceModel): void {
    this.ticketForm = this.fb.group({
      id: [ticket.ticketId],
      
      remarks: [ticket.remarks],
      status: [ticket.status],
      
    });
  }
  onSubmit(event: Event): void {
    if (this.ticketForm.valid) {
      const updatedTicket: GetRaisedTicketByIdResponceModel = { ...this.data.Ticket, ...this.ticketForm.value };
      
      console.log('Updated Ticket:', updatedTicket);
      this.ref.close(updatedTicket);
    } else {
      alert('Form is invalid.');
    }
  }

  
  closeDialog() {

    this.ref.close();
  }

}
