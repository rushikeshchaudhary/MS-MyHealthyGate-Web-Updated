import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { CommonService } from "../../core/services";
import { ClientsService } from "../../client-portal/clients.service";
import { ResponseModel } from "../../core/modals/common-model";
import { AddTemplateModalComponent } from "../add-template-modal/add-template-modal.component";
import { TemplateModel } from "./template.model";
import { DialogService } from "src/app/shared/layout/dialog/dialog.service";
import { NotifierService } from "angular-notifier";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-template",
  templateUrl: "./template.component.html",
  styleUrls: ["./template.component.css"],
})
export class TemplateComponent implements OnInit {
  displayColumns: Array<any> = [
    {
      displayName: "name",
      key: "name",
      isSort: false,
      class: "",
    },
    {
      displayName: "date",
      key: "date",
      isSort: false,
      class: "",
      type: "date",
    },
    {
      displayName: "created_date",
      key: "createdDate",
      isSort: false,
      class: "",
      type: "date",
    },
    {
      displayName: "actions",
      key: "Actions",
      isSort: true,
      class: "",
    },
  ];

  actionButtons: Array<any> = [
    { displayName: "Download", key: "download", class: "fa fa-download" },
    { displayName: "View", key: "view", class: "fa fa-eye" },
    { displayName: "Delete", key: "delete", class: "fa fa-trash" },
    // { displayName: "Edit", key: "edit", class: "fa fa-pencil" },
  ];

  currentUser: any;
  testFormGroup!: FormGroup;
  templateList: Array<any> = [];
  metaData: any;
  templateData: TemplateModel = new TemplateModel;

  constructor(
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private dialogModal: MatDialog,
    private commonService: CommonService,
    private clientService: ClientsService,
    private dialogService: DialogService,
    private notifier: NotifierService,
    private translate:TranslateService
  ) 
  {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
  }

  ngOnInit() {
    this.commonService.currentLoginUserInfo.subscribe((user) => {
      this.currentUser = user;
    });

    this.testFormGroup = this.formBuilder.group({
      searchKey: "",
      rangeStartDate: "",
      rangeEndDate: "",
    });

    this.setIntialValues();
    this.getAllTemplates();
  }

  get f() {
    return this.testFormGroup.controls;
  }

  setIntialValues() {
    var date = new Date();
    this.f["rangeStartDate"].setValue(
      new Date(date.getFullYear(), date.getMonth(), 1)
    );
    this.f["rangeEndDate"].setValue(
      new Date(date.getFullYear(), date.getMonth() + 1, 0)
    );
  }

  applyStartDateFilter(event: MatDatepickerInputEvent<Date>) {
    this.f["rangeStartDate"].setValue(event.value ? new Date (event.value) : null);
    this.getAllTemplates();
  }

  applyEndDateFilter(event: MatDatepickerInputEvent<Date>) {
    this.f["rangeEndDate"].setValue(event.value ? new Date (event.value) : null);
    this.getAllTemplates();
  }

  getAllTemplates() {
    let fromDate =
      this.f["rangeStartDate"].value != null && this.f["rangeStartDate"].value != ""
        ? this.datePipe.transform(
            new Date(this.f["rangeStartDate"].value),
            'MM/dd/yyyy'
          )
        : "";
    let toDate =
      this.f["rangeEndDate"].value != null && this.f["rangeEndDate"].value != ""
        ? this.datePipe.transform(
            new Date(this.f["rangeEndDate"].value),
            'MM/dd/yyyy'
          )
        : "";
    let searchKey =
      this.f["searchKey"].value == null ? "" : this.f["searchKey"].value;

    this.clientService
      .getAllTemplates(this.currentUser.id, searchKey, fromDate, toDate)
      .subscribe((response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.templateList = response.data;
          this.metaData = response.meta;
        } else {
          this.templateList = [];
          this.metaData = null;
        }
      });
  }

  clearFilters() {
    this.testFormGroup.reset();
    this.getAllTemplates();
  }

  createTemplate(templateModel: TemplateModel) {
    if (templateModel.id == 0) {
      templateModel.id = 0;
      templateModel.title = "";
      templateModel.name = "";
      templateModel.staffID = this.currentUser.id;
      templateModel.date = new Date();
      templateModel.htmlContent = "";
    }

    let templateModal;
    templateModal = this.dialogModal.open(AddTemplateModalComponent, {
      data: { template: templateModel },
    });
    templateModal.afterClosed().subscribe((result) => {
      this.getAllTemplates();
    });
  }

  //table action
  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.id;
    switch ((actionObj.action || "").toUpperCase()) {
      case "DOWNLOAD":
        this.downloadTemplate(actionObj);
        break;
      case "VIEW":
        this.viewTemplate(actionObj);
        break;
      case "EDIT":
        this.openDialog(id);
        break;
      case "DELETE":
        this.deleteDetails(id);
        break;
      default:
        break;
    }
  }

  //open popup
  openDialog(id: number) {
    if (id != null && id > 0) {
      this.clientService.getTemplateById(id).subscribe((response: any) => {
        if (response != null && response.data != null) {
          this.templateData = response.data;
          this.createTemplate(this.templateData);
        }
      });
    } else {
      this.templateData = new TemplateModel();
      this.templateData.id = 0;
      this.createTemplate(this.templateData);
    }
  }

  deleteDetails(id: number) {
    this.dialogService
      .confirm("Are you sure you want to delete this template?")
      .subscribe((result: any) => {
        if (result == true) {
          this.clientService.deleteTemplate(id).subscribe((response: any) => {
            if (response.statusCode === 200) {
              this.notifier.notify("success", response.message);
              this.getAllTemplates();
            } else if (response.statusCode === 401) {
              this.notifier.notify("warning", response.message);
            } else {
              this.notifier.notify("error", response.message);
            }
          });
        }
      });
  }

  viewTemplate = (act:any) => {
    this.clientService
      .getTemplatePdfById(act.data.id)
      .subscribe((response: any) => {
        let byteChar = atob(response.data.toString());
        let byteArray = new Array(byteChar.length);
        for (let i = 0; i < byteChar.length; i++) {
          byteArray[i] = byteChar.charCodeAt(i);
        }

        let uIntArray = new Uint8Array(byteArray);
        let file = new Blob([uIntArray], { type: "application/pdf" });
        var fileURL = URL.createObjectURL(file);
        var link = document.createElement("a");
        document.body.appendChild(link);
        link.href = fileURL;
        link.target = "_blank";
        link.click();
      });
  };

  downloadTemplate = (act:any) => {
    let fileName = "Template " + act.data.name;
    this.clientService
      .getTemplatePdfById(act.data.id)
      .subscribe((response: any) => {
        let byteChar = atob(response.data.toString());
        let byteArray = new Array(byteChar.length);
        for (let i = 0; i < byteChar.length; i++) {
          byteArray[i] = byteChar.charCodeAt(i);
        }

        let uIntArray = new Uint8Array(byteArray);
        let file = new Blob([uIntArray], { type: "application/pdf" });
        var fileURL = URL.createObjectURL(file);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.target = "_blank";
        a.href = fileURL;
        a.download = fileName;
        a.click();
        a.remove();
      });
  };
}
