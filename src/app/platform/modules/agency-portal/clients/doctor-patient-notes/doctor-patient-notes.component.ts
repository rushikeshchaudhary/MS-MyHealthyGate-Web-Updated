import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { ClientsService } from '../../../client-portal/clients.service';
import { Metadata, ResponseModel } from '../../../core/modals/common-model';
import { DoctorPatientNotes } from './doctor-patient-notes';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-doctor-patient-notes',
  templateUrl: './doctor-patient-notes.component.html',
  styleUrls: ['./doctor-patient-notes.component.css']
})
export class DoctorPatientNotesComponent implements OnInit {
  patientNotesForm!: FormGroup;
  staffId: number;
  patientId: number;
  notes: Array<any> = [];
  metaData: Metadata=new Metadata();
  editorConfig: AngularEditorConfig;
  displayColumns: Array<any> = [
    {
      displayName: "Note",
      key: "patientNotes",
      isSort: false,
      class: ""
    },
    {
      displayName: "Created Date",
      key: "createdDate",
      isSort: false,
      class: "",
      type: "date"
    }
  ];
  constructor(private notifierService: NotifierService, private clientService: ClientsService, @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder, private dialogModalRef: MatDialogRef<DoctorPatientNotesComponent>) {
    this.patientId = data.patientId;
    this.staffId = data.providerId;

    this.editorConfig = {
      editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '10rem',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: 'auto',
      translate: 'no',
      enableToolbar: false,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        { class: 'arial', name: 'Arial' },
        { class: 'times-new-roman', name: 'Times New Roman' },
        { class: 'calibri', name: 'Calibri' },
        { class: 'comic-sans-ms', name: 'Comic Sans MS' }
      ],
      customClasses: [
        {
          name: 'quote',
          class: 'quote',
        },
        {
          name: 'redText',
          class: 'redText'
        },
        {
          name: 'titleText',
          class: 'titleText',
          tag: 'h1',
        },
      ],
      //sanitize: true,
      //toolbarPosition: 'top',
      // toolbarHiddenButtons: [
      //   [
      //   ],
      //   [
      //     'customClasses',
      //     'link',
      //     'unlink',
      //     'insertImage',
      //     'insertVideo',
      //     'toggleEditorMode'
      //   ]
      // ]
    };
  }

  ngOnInit() {
    this.patientNotesForm = this.formBuilder.group({
      patientNotes: ["", Validators.required]
    });
    this.getDoctorPatientNotes();
  }
  get formControls() {
    return this.patientNotesForm.controls;
  }
  closeDialog(action: string) {
    this.dialogModalRef.close(action);
  }
  onSubmit():any {
    if (this.patientNotesForm.invalid) {
      return this.patientNotesForm
    } else {
      let data = new DoctorPatientNotes();
      data = this.patientNotesForm.value;
      data.patientId = this.patientId;
      data.providerId = this.staffId;
      this.clientService.createOrUpdateDoctorPatientNotes(data).subscribe((res: ResponseModel) => {
        if (res.statusCode == 200) {
          // this.patientNotesForm.reset();
          //this.getDoctorPatientNotes();
          this.notifierService.notify("success", res.message);
          this.closeDialog('close');
        } else {
          this.notifierService.notify("error", res.message);
        }
      });
    }
    return
  }
  getDoctorPatientNotes() {
    this.clientService.getDoctorNotes(this.patientId, this.staffId).subscribe((response: ResponseModel) => {
      if (response.statusCode == 200) {
        this.metaData.currentPage=1;
        this.metaData.defaultPageSize=5;
        this.metaData.pageSize=5;
        this.metaData.totalPages=1;
        this.notes = response.data;
        this.patientNotesForm.controls['patientNotes'].setValue(this.notes[0].patientNotes);
        console.log(this.notes);
      } else {
        this.notes = [];
      }
    });
  }
}
