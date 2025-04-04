import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { ActivatedRoute, ParamMap } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { UsersService } from "src/app/platform/modules/agency-portal/users/users.service";
// import { UsersService } from "../../users.service";

@Component({
  selector: 'app-add-edit-qualification',
  templateUrl: './add-edit-qualification.component.html',
  styleUrls: ['./add-edit-qualification.component.css']
})
export class AddEditQualificationComponent implements OnInit {
  isFormAdd: boolean = false;
  addQualificationForm!: FormGroup;
  submitted: boolean = false;
  fileList: any = [];
  dataURL: any;
  staffId;
  imageError = false;
  labId!: number;

  constructor(
    private dialogModalRef: MatDialogRef<AddEditQualificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private notifier: NotifierService,
    private activatedRoute:ActivatedRoute
  ) {
   //debugger
   this.staffId = data.staffId;
  }

  ngOnInit() {
    this.addQualificationForm = this.formBuilder.group({
      course: [],
      university: [],
      startDate: [],
      endDate: [],
    });

   
    
  }
  get addFormControls() {
    return this.addQualificationForm.controls;
  }
  handleImageChange = (e:any) => {
    let fileExtension = e.target.files[0].name.split(".").pop().toLowerCase();
    var input = e.target;
    var reader = new FileReader();
    reader.onload = () => {
      this.dataURL = reader.result;
      this.fileList.push({
        data: this.dataURL,
        ext: fileExtension,
        fileName: e.target.files[0].name,
      });
    };
    reader.readAsDataURL(input.files[0]);
  };
  removeFile = (index:any) => {
    this.fileList.splice(index, 1);
  };

  closeDialog(action: string): void {
    this.dialogModalRef.close(action);
  }
  onSubmit = () => {
    if (this.fileList.length != 0) {
      let formValues = {
        base64: this.fileList,
        staffId: this.staffId,
        course: this.addQualificationForm.controls["course"].value,
        university: this.addQualificationForm.controls["university"].value,
        startDate: this.addQualificationForm.controls["startDate"].value,
        endDate: this.addQualificationForm.controls["endDate"].value,
      };
      let dic:any = [];
      formValues.base64.forEach((element:any, index:any) => {
        dic.push(
          `"${element.data.replace(
            /^data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,/,
            ""
          )}": "${element.ext}"`
        );
      });
      let newObj = dic.reduce((acc:any, cur:any, index:any) => {
        acc[index] = cur;
        return acc;
      }, {});
      formValues.base64 = newObj;
      this.submitted = true;
      this.userService
        .newSaveStaffQualification(formValues)
        .subscribe((res) => {
          if (res.statusCode == 200) {
            this.notifier.notify("success", res.message);
            this.closeDialog("add");
          } else {
            this.submitted = false;
            this.notifier.notify("error", res.message);
          }
        });
    } else {
      this.imageError = true;
    }
  };
}
