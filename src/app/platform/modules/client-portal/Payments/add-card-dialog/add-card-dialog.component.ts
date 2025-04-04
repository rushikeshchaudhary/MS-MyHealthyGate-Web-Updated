import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from "angular-notifier";
import { format } from "date-fns";

import { Moment } from "moment";
import { ClientsService } from "../../clients.service";
import { TranslateService } from "@ngx-translate/core";
import * as moment from "moment";


@Component({
  selector: "app-add-card-dialog",
  templateUrl: "./add-card-dialog.component.html",
  styleUrls: ["./add-card-dialog.component.css"],
})
export class AddCardDialogComponent implements OnInit {
  addCardForm!: FormGroup;
  editCardForm!: FormGroup;
  submitted: boolean = false;
  isFormAdd;
  editFormData;
  splitDate: any = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    private formBuilder: FormBuilder,
    private dialogModalRef: MatDialogRef<AddCardDialogComponent>,
    private clientService: ClientsService,
    private notifier: NotifierService,
    private translate:TranslateService,

  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    if (this.data.type == "add") {
      this.isFormAdd = true;
    } else {
      this.isFormAdd = false;
      this.editFormData = this.data.data;
      this.splitDate = this.data.data.expiryDate.split("/");
    }
  }

  ngOnInit() {
    this.editCardForm = this.formBuilder.group({
      cardNumber: [],
      expiryDate: [moment()],
      nameOnCard: [],
      month: [],
      year: [],
    });
    this.addCardForm = this.formBuilder.group({
      cardNumber: [],
      expiryDate: [moment()],
      nameOnCard: [],
      month: [],
      year: [],
    });
    this.seteditform();
  }

  seteditform() {
    this.editCardForm.get("cardNumber")!.setValue(this.editFormData.cardNumber);
    this.editCardForm.get("nameOnCard")!.setValue(this.editFormData.nameOnCard);
    this.editCardForm.get("month")!.setValue(this.splitDate[0]);
    this.editCardForm.get("year")!.setValue(this.splitDate[1]);
  }
  get formControls() {
    return this.addCardForm.controls;
  }
  get editFormControls() {
    return this.editCardForm.controls;
  }

  setMonthAndYear(normalizedMonthAndYear:any, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = format(normalizedMonthAndYear, "yyyy-MM");

    this.data.type == "add"
      ? this.addCardForm.get("expiryDate")!.setValue(ctrlValue)
      : this.editCardForm.get("expiryDate")!.setValue(ctrlValue);
    datepicker.close();
  }

  closeDialog(action: string): void {
    this.dialogModalRef.close(action);
  }

  onSubmit = () => {
    let formatExpiryDate =
      this.addCardForm.controls["month"].value +
      "/" +
      this.addCardForm.controls["year"].value;
    const data = {
      nameOnCard: this.addCardForm.controls["nameOnCard"].value,
      cardNumber: this.addCardForm.controls["cardNumber"].value,
      expiryDate: formatExpiryDate,
    };
    this.clientService.SaveUserCardDetails(data).subscribe((res) => {
      if (res.statusCode == 200) {
        this.notifier.notify("success", res.message);
        this.closeDialog("add");
      } else {
        this.submitted = false;
        this.notifier.notify("error", res.message);
      }
    });
  };
  onEditSubmit = () => {
    let formatExpiryDate =
      this.editCardForm.controls["month"].value +
      "/" +
      this.editCardForm.controls["year"].value;
    const data = {
      cardId: this.editFormData.id,
      nameOnCard: this.editCardForm.controls["nameOnCard"].value,
      cardNumber: this.editCardForm.controls["cardNumber"].value,
      expiryDate: formatExpiryDate,
    };
    this.clientService.UpdateUserCard(data).subscribe((res) => {
      if (res.statusCode == 200) {
        this.notifier.notify("success", res.message);
        this.closeDialog("edit");
      } else {
        this.submitted = false;
        this.notifier.notify("error", res.message);
      }
      console.log(res);
    });
  };
}
