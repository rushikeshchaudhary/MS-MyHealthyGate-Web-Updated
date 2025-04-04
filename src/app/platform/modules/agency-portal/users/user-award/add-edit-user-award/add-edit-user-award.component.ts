import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NotifierService } from "angular-notifier";
import { UsersService } from "../../users.service";

@Component({
  selector: "app-add-edit-user-award",
  templateUrl: "./add-edit-user-award.component.html",
  styleUrls: ["./add-edit-user-award.component.css"],
})
export class AddEditUserAwardComponent implements OnInit {
  isFormAdd: boolean = false;
  addAwardForm!: FormGroup;
  submitted: boolean = false;
  fileList: any = [];
  dataURL: any;
  staffId;
  imageError = false;

  constructor(
    private dialogModalRef: MatDialogRef<AddEditUserAwardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private notifier: NotifierService
  ) {
    this.staffId = data.staffId;
  }

  ngOnInit() {
    this.addAwardForm = this.formBuilder.group({
      awardType: [],
      description: [],
      awardDate: [],
    });
  }

  get addFormControls() {
    return this.addAwardForm.controls;
  }

  handleImageChange = (e: any) => {
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
  removeFile = (index: any) => {
    this.fileList.splice(index, 1);
  };

  closeDialog(action: string): void {
    this.dialogModalRef.close(action);
  }

  onSubmit = () => {
    let formValues = {
      base64: this.fileList,
      staffId: this.staffId,
      awardType: this.addAwardForm.controls["awardType"].value,
      description: this.addAwardForm.controls["description"].value,
      awardDate: this.addAwardForm.controls["awardDate"].value,
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
    this.userService.saveStaffAward(formValues).subscribe((res) => {
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
