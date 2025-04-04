import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { format } from "date-fns";
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: "app-appointment-action",
  templateUrl: "./appointment-action.component.html",
  styleUrls: ["./appointment-action.component.css"],
})
export class AppointmentActionComponent implements OnInit {
  patientData;
  constructor(
    private dialogModalRef: MatDialogRef<AppointmentActionComponent>,    private translate:TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    data.appointmentDateTime =
      format(data.appointmentDateTime, 'MM/dd/yyyy') +
      " (" +
      format(data.startDateTime, 'h:mm a') +
      " )";
    this.patientData = data;
  }

  ngOnInit() {}
  closeDialog(action: string) {
    this.dialogModalRef.close(action);
  }
}
