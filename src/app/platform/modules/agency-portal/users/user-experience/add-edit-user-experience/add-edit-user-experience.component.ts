import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NotifierService } from "angular-notifier";
import { UsersService } from "../../users.service";
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: "app-add-edit-user-experience",
  templateUrl: "./add-edit-user-experience.component.html",
  styleUrls: ["./add-edit-user-experience.component.css"],
})
export class AddEditUserExperienceComponent implements OnInit {
  isFormAdd: boolean = false;
  addExperienceForm!: FormGroup;
  submitted: boolean = false;
  fileList: any = [];
  dataURL: any;
  staffId;
  minDate = new Date(1900, 1, 1);

  constructor(
    private dialogModalRef: MatDialogRef<AddEditUserExperienceComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private notifier: NotifierService,
    private translate:TranslateService,
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.staffId = data.staffId;
  }

  ngOnInit() {
    this.addExperienceForm = this.formBuilder.group({
      organisationName: ['', Validators.required],
      role: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [],
    });
  }

  get addFormControls() {
    return this.addExperienceForm.controls;
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
    let formValues = {
      base64: this.fileList,
      staffId: this.staffId,
      organizationName: this.addExperienceForm.controls["organisationName"].value,
      role: this.addExperienceForm.controls["role"].value,
      startDate: this.addExperienceForm.controls["startDate"].value,
      endDate: this.addExperienceForm.controls["endDate"].value,
    };
    let dic: any[] = [];
    formValues.base64.forEach((element: { data: string; ext: any; }, index: any) => {
      dic.push(
        `"${element.data.replace(
          /^data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,/,
          ""
        )}": "${element.ext}"`
      );
    });
    let newObj = dic.reduce((acc, cur, index) => {
      acc[index] = cur;
      return acc;
    }, {});
    formValues.base64 = newObj;
    this.submitted = true;
    if (this.addExperienceForm.invalid) {
      this.submitted = false;
      return;
    }
    this.userService.saveStaffExperience(formValues).subscribe((res) => {
      if (res.statusCode == 200) {
        this.notifier.notify("success", res.message);
        this.closeDialog("add");
      } else {
        this.submitted = false;
        this.notifier.notify("error", res.message);
      }
    });
  };
}
