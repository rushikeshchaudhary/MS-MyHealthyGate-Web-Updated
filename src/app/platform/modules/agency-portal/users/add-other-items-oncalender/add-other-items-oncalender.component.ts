import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { NotifierService } from "angular-notifier";
import { format } from "date-fns";
import { SchedulerService } from "../../../scheduling/scheduler/scheduler.service";

const getDateTimeString = (date: string, time: string): string => {
  const y = new Date(date).getFullYear(),
    m = new Date(date).getMonth(),
    d = new Date(date).getDate(),
    splitTime = time.split(":"),
    hours = parseInt(splitTime[0] || "0", 10),
    minutes = parseInt(splitTime[1].substring(0, 2) || "0", 10),
    meridiem = splitTime[1].substring(3, 5) || "",
    updatedHours =
      (meridiem || "").toUpperCase() === "PM" && hours != 12
        ? hours + 12
        : hours;

  const startDateTime = new Date(y, m, d, updatedHours, minutes);

  return format(startDateTime, "yyyy-MM-ddTHH:mm:ss");
};

@Component({
  selector: "app-add-other-items-oncalender",
  templateUrl: "./add-other-items-oncalender.component.html",
  styleUrls: ["./add-other-items-oncalender.component.css"],
})
export class AddOtherItemsOncalenderComponent implements OnInit {
  @ViewChild("myFileInput") myFileInput:any;
  otherItemFormGroup: FormGroup;
  maxDate = new Date();
  minDate = new Date();
  hideSaveButton: boolean = false;
  fileList: any = [];
  dataURL: any;

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: "6rem",
    minHeight: "3rem",
    placeholder: "Enter text here...",
    translate: "no",
    defaultParagraphSeparator: "p",
    defaultFontName: "Arial",

    // customClasses: [
    //   {
    //     name: "quote",
    //     class: "quote",
    //   },
    //   {
    //     name: "redText",
    //     class: "redText",
    //   },
    //   {
    //     name: "titleText",
    //     class: "titleText",
    //     tag: "h1",
    //   },
    //]
  };
  docList: any[]=[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogModalRef: MatDialogRef<AddOtherItemsOncalenderComponent>,
    private formBuilder: FormBuilder,
    private notifier: NotifierService,
    private schedulerService: SchedulerService
  ) {
    this.otherItemFormGroup = this.formBuilder.group({
      id: 0,
      startTime: "",
      endTime: "",
      endDate: "",
      pageContent: "",
      dateData: "",
      reserveType: ["", [Validators.required]],
      userName: "",
    });
  }

  ngOnInit() {
    if (this.data.providerId) {
      this.updateFormvalue();
    } else {
      this.updateFormValueForViewOnly();
    }

    console.log(this.data);
  }

  get formControls() {
    return this.otherItemFormGroup.controls;
  }

  updateFormValueForViewOnly = () => {
    this.otherItemFormGroup.patchValue({
      id: this.data.id,
      startTime: format(this.data.start, "HH:mm"),
      dateData: format(this.data.end, "dd-MM-yyyy"),
      endTime: format(this.data.end, "HH:mm"),
      pageContent: this.data.details,
      reserveType: this.data.title,
      userName: this.data.meta.userName,
    });
    this.hideSaveButton = true;
    // this.otherItemFormGroup.disable();
    console.log(this.otherItemFormGroup);

    this.GetUploadedDocument(this.data.id);
  };

  updateFormvalue = () => {
    this.otherItemFormGroup.patchValue({
      startTime: format(this.data.eventDate, "HH:mm"),
      dateData: format(this.data.eventDate, "dd-MM-yyyy"),
      endTime:
        this.data.firstLimitItem != undefined
          ? format(this.data.firstLimitItem, "HH:mm")
          : "",
    });
  };
  endTimeHandler = (event: any) => {
    if (
      this.getTimeInSecond(event.target.value) >
      this.getTimeInSecond(format(this.data.firstLimitItem, "HH:mm"))
    ) {
      this.notifier.notify("error", "Can not set time beyond available limit!");
      this.otherItemFormGroup.patchValue({
        endTime:
          this.data.firstLimitItem != undefined
            ? format(this.data.firstLimitItem, "HH:mm")
            : "",
      });
    } else if (
      this.getTimeInSecond(event.target.value) <
      this.getTimeInSecond(this.formControls["startTime"].value)
    ) {
      this.notifier.notify(
        "error",
        "End time should be greater than starttime!"
      );
      this.otherItemFormGroup.patchValue({
        endTime: format(this.data.firstLimitItem, "HH:mm"),
      });
    }
  };

  onNoClick(): void {
    this.dialogModalRef.close();
  }
  saveOtherCalendarItems = () => {
    // console.log(this.otherItemFormGroup.value);

    console.log(this.fileList);
    let reqData = {
      id: this.otherItemFormGroup.controls["id"].value,
      pageContent: this.otherItemFormGroup.controls["pageContent"].value,
      reserveType: this.otherItemFormGroup.controls["reserveType"].value,
      userName: this.otherItemFormGroup.controls["userName"].value,
      startDate: getDateTimeString(
        format(
          this.data.eventDate ? this.data.eventDate : this.data.start,
          "yyyy-MM-dd"
        ),
        this.otherItemFormGroup.controls["startTime"].value
      ),
      endDate: getDateTimeString(
        format(
          this.data.eventDate ? this.data.eventDate : this.data.start,
          "yyyy-MM-dd"
        ),
        this.otherItemFormGroup.controls["endTime"].value
      ),
      attachedDoc: this.fileList,
    };
    this.schedulerService
      .SaveProviderBlockCalenderTime(reqData)
      .subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.otherItemFormGroup.patchValue({
            id: res.data.id,
          });
          this.notifier.notify("success", res.message);
          this.dialogModalRef.close("save");
        } else {
          this.notifier.notify("error", res.message);
        }
      });
  };

  getTimeInSecond = (time: string) => {
    return (
      parseInt(time.split(":")[0]) * 3600 + parseInt(time.split(":")[1]) * 60
    );
  };

  handleImageChange(e:any) {
    let file_data = e.target.files;
    if (file_data.length > 0) {
      // Define a function to read each file asynchronously
      const readFile = (file:any) => {
        return new Promise((resolve, reject) => {
          let fileExtension = file.name.split(".").pop().toLowerCase();
          let reader = new FileReader();
          reader.onload = () => {
            resolve({
              data: reader.result,
              ext: fileExtension,
              fileName: file.name,
            });
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      };

      // Use Promise.all to wait for all files to be processed
      Promise.all(Array.from(file_data).map((file) => readFile(file)))
        .then((fileList) => {
          // Add processed files to this.fileList
          this.fileList.push(...fileList);
        })
        .catch((error) => {
          console.error("Error reading files:", error);
        });
    }
    this.myFileInput.nativeElement.value = "";
  }
  removeFile(index: number) {
    this.fileList.splice(index, 1);
    // this.myFileInput.nativeElement.value = "";
  }

  GetUploadedDocument = (id:any) => {
    this.schedulerService
      .getProviderBlockCalenderDocument(id)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.docList = res.data;
        }
      });
  };

  downloadFile(act: { extension: any; base64: string; originalFileName: string; }) {
    var fileType = "";
    switch (act.extension) {
      case "png":
        fileType = "image/png";
        break;
      case "gif":
        fileType = "image/gif";
        break;
      case "pdf":
        fileType = "application/pdf";
        break; // Assuming PDF for illustration
      case "jpeg":
        fileType = "image/jpeg";
        break;
      case "jpg":
        fileType = "image/jpeg";
        break;
      case "xls":
        fileType = "application/vnd.ms-excel";
        break;
      default:
        fileType = "";
    }

    if (act) {
      let byteChar = atob(act.base64);
      let byteArray = new Array(byteChar.length);
      for (let i = 0; i < byteChar.length; i++) {
        byteArray[i] = byteChar.charCodeAt(i);
      }

      let uIntArray = new Uint8Array(byteArray);
      let newBlob = new Blob([uIntArray], { type: fileType });
      const nav = window.navigator as any;
      if (nav && nav.msSaveOrOpenBlob) {
        nav.msSaveOrOpenBlob(newBlob);
        return;
      }
      const data = window.URL.createObjectURL(newBlob);
      var link = document.createElement("a");
      document.body.appendChild(link);
      link.href = data;
      link.download = act.originalFileName;
      link.click();
      setTimeout(function () {
        // For Firefox it is necessary to delay revoking the ObjectURL
        document.body.removeChild(link);
        window.URL.revokeObjectURL(data);
      }, 100);
    }
  }

  viewDocument = (act:any) => {
    // window.open(act.data.url, '_blank')
    // this.clientService.getLabReferralPdfById(act.id).subscribe((response: any) => {

    var fileType = "";
    switch (act.extension) {
      case "png":
        fileType = "image/png";
        break;
      case "gif":
        fileType = "image/gif";
        break;
      case "pdf":
        fileType = "application/pdf";
        break; // Assuming PDF for illustration
      case "jpeg":
        fileType = "image/jpeg";
        break;
      case "jpg":
        fileType = "image/jpeg";
        break;
      case "xls":
        fileType = "application/vnd.ms-excel";
        break;
      default:
        fileType = "";
    }

    if (act) {
      let byteChar = atob(act.base64);
      let byteArray = new Array(byteChar.length);
      for (let i = 0; i < byteChar.length; i++) {
        byteArray[i] = byteChar.charCodeAt(i);
      }

      let uIntArray = new Uint8Array(byteArray);
      let newBlob = new Blob([uIntArray], { type: fileType });
      const nav = window.navigator as any;
      if (nav && nav.msSaveOrOpenBlob) {
        nav.msSaveOrOpenBlob(newBlob);
        return;
      }
      const data = window.URL.createObjectURL(newBlob);
      var link = document.createElement("a");
      document.body.appendChild(link);
      link.href = data;
      link.target = "_blank";
      link.click();

      setTimeout(function () {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(data);
      }, 100);
    }
    //});
  };
}
