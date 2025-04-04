import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { NotifierService } from "angular-notifier";
import { Subscription } from "rxjs";
import { ClientsService } from "src/app/platform/modules/client-portal/clients.service";
import { CommonService } from "src/app/super-admin-portal/core/services";
import { SharedService } from "../../shared.service";
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: "app-ticket-dialog",
  templateUrl: "./ticket-dialog.component.html",
  styleUrls: ["./ticket-dialog.component.css"],
})
export class TicketDialogComponent implements OnInit {
  IsEditForm: boolean = false;
  selectedFiles: File[] = [];
  fileList: any = [];
  userId!: number;
  subscription: Subscription | undefined;
  categories!: any[];
  // ticket: Ticket = {
  //   id: '',
  //   category: '',
  //   priority: '',
  //   description: '',
  //   files: [],
  //   status: 'pending',
  //   remarks: ''
  // };
  dataURL: any;
  ticketForm!: FormGroup;
  submitted!: boolean;
  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<TicketDialogComponent>,
    private sharedService: SharedService,
    private notifier: NotifierService,
    private translate:TranslateService,

  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
  }

  ngOnInit() {
    this.getCategories();
    this.initializeForm();
  }

  initializeForm(): void {
    this.ticketForm = this.fb.group({
      id: [""],
      category: ["", Validators.required],
      priority: ["", Validators.required],
      description: ["", Validators.required],
      files: [],
    });
  }

  onSubmit() {
    if (!this.ticketForm.invalid) {
      let formValues = {
        base64: this.fileList,
        category: this.ticketForm.value.category,
        priority: this.ticketForm.value.priority,
        description: this.ticketForm.value.description,
        status: "Pending",
      };
      let dic: any[] = [];
      console.log(formValues.base64);
      formValues.base64.forEach((element: { data: string; ext: any; fileName: any; }, index: any) => {
        dic.push(
          `"${element.data.replace(
            /^data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,/,
            ""
          )}": "${element.ext}":"${element.fileName}"`
        );
      });
      console.log(dic);
      let newObj = dic.reduce((acc, cur, index) => {
        acc[index] = cur;
        return acc;
      }, {});
      console.log(newObj);
      formValues.base64 = newObj;
      this.submitted = true;
      this.sharedService.UploadTicket(formValues).subscribe((response: any) => {
        this.submitted = false;
        if (response != null && response.statusCode == 200) {
          this.notifier.notify("success", response.message);
          this.closeDialog();
        } else {
          console.error(`Error : ${response.message}`);
        }
      });
    }
  }

  handleImageChange(e:any) {
    const files: FileList = e.target.files;

    // for (let i = 0; i < files.length; i++) {
    //   const file = files[i];
    //   if(file!=undefined ){
    //     const fileExtension = file.name.split(".").pop().toLowerCase();
    //   }
      
    //   this.selectedFiles.push(file);

    //   const reader = new FileReader();
    //   reader.onload = () => {
    //     const dataURL = reader.result;
    //     this.fileList.push({
    //       data: dataURL,
    //       ext: fileExtension,
    //       fileName: file.name,
    //     });
    //   };

    //   reader.readAsDataURL(file);
    // }

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        let fileExtension = ""; // Initialize fileExtension
    
        if (file.name) {
          fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
        }
        
        this.selectedFiles.push(file);
    
        const reader = new FileReader();
        reader.onload = () => {
          const dataURL = reader.result as string; // Type assertion
          this.fileList.push({
            data: dataURL,
            ext: fileExtension,
            fileName: file.name,
          });
        };
    
        reader.readAsDataURL(file);
      }
    }
    
  }

  removeFile(index: number) {
    const filename = this.fileList[index].fileName;
    this.fileList.splice(index, 1);
    const indexToRemove = this.selectedFiles.findIndex(
      (file) => file.name === filename
    );

    if (indexToRemove !== -1) {
      this.selectedFiles.splice(indexToRemove, 1);
    }
  }

  getCategories() {
    this.sharedService.GetTicketRaiseCategories().subscribe((res) => {
      if (res.statusCode === 200 && res.data) {
        this.categories = res.data;
      }
    });
  }
  closeDialog() {
    this.ref.close();
  }
}
