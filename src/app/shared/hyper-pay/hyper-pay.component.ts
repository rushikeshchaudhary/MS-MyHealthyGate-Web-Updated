import {
  Component,
  Inject,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Renderer2,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HyperPayModal } from "./hyperPay.modal";
import { SchedulerService } from "../../platform/modules/scheduling/scheduler/scheduler.service";
import { DOCUMENT } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";

declare var hpwlPayment: any;
@Component({
  selector: "app-hyper-pay",
  templateUrl: "./hyper-pay.component.html",
  styleUrls: ["./hyper-pay.component.css"],
})
export class HyperPayComponent implements AfterViewInit, OnInit, OnDestroy {
  lastAppointmentStartTime: any;
  lastAppointmentEndTime: any;
  checkoutId: any;
  isUrgent: boolean;
  notes: any;
  bookingMode: any;
  lastAppointment: any;
  providerInfo: any;
  UrgentUrl: string;
  notUrgetUrl: string;
  Url: string;
  @ViewChild("one", { read: ElementRef }) private divMessages!: ElementRef;
  htmlForm: string='';
  cardScript: any;
  cardNumber: string = "";
  expiryDate: string = "";
  cvv: string = "";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogModalRef: MatDialogRef<HyperPayModal>,
    private schedulerService: SchedulerService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private translate:TranslateService,
    @Inject(DOCUMENT) private _document:any
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.checkoutId = data.id;
    this.isUrgent = data.isUrgent;
    //this.Url = "https://localhost:4200/payment-success"; // local
    this.Url = "https://mscore.stagingsdei.com:9610/payment-success"; // staging
    //this.Url="https://myhealthygate.com/payment-success"; // production
    this.UrgentUrl = this.Url + "?urgentcare=1";
    this.notUrgetUrl = this.Url + "?urgentcare=0";
  }
  
  ngOnDestroy(): void {
    this._document.body.removeChild(this.cardScript);
  }

  ngOnInit(): void {
    this.cardScript = this.renderer.createElement("script");
    this.cardScript.type = "text/javascript";
    this.cardScript.text = `wpwlOptions = {
      style: "card",
      registrations: {
        requireCvv: true
      }
    };`;
    this.renderer.appendChild(this._document.body, this.cardScript);

    //window.document.body.removeChild(this.cardScript);
  }

  ngAfterViewInit() {
    if (this.checkoutId) {
      setTimeout(() => {
        this.initializeHyperpay();
      }, 2000);
    }
  }
  initializeHyperpay(): void {
    const wholeFormRegistrationCard =
      this.elementRef.nativeElement.querySelector(".patientPayment");

    const savedCardElement = wholeFormRegistrationCard.querySelector(
      "#wpwl-registrations"
    );
    // check If No registered card Is available.
    if (savedCardElement == null) {
      const createRegistrationHtml =
        '<div class="customLabel">Store payment details?</div><div class="customInput"><input style="height:20px;width:20px" type="checkbox" name="createRegistration" value="true" /></div>';
      const createRegistrationElement = this.renderer.createElement("div");
      this.renderer.setProperty(
        createRegistrationElement,
        "innerHTML",
        createRegistrationHtml
      );
      this.renderer.insertBefore(
        this.elementRef.nativeElement.querySelector(".wpwl-button").parentNode,
        createRegistrationElement,
        this.elementRef.nativeElement.querySelector(".wpwl-button")
      );

      // registration card is Available:
    } else {
      // const savedCardForm = savedCardElement.querySelector(
      //   ".wpwl-form-registrations"
      // );
      // savedCardForm.dataset.style = "card";
      // savedCardForm.dataset.registrations = JSON.stringify({
      //   requireCvv: true,
      // });

      const cardElement = wholeFormRegistrationCard.children[2];
      const createRegistrationHtml = `
      <div class="customLabel">Store payment details?</div>
      <div class="customInput"><input style="height:20px;width:20px" type="checkbox" name="createRegistration" value="true" /></div>
    `;

      const buttonElement = cardElement.querySelector(".wpwl-button");
      if (buttonElement) {
        buttonElement.insertAdjacentHTML("beforebegin", createRegistrationHtml);
      }
    }
  }

  getAppointmentDetails() {
    this.schedulerService
      .getAppointmentDetails(this.checkoutId)
      .subscribe((response) => {
        if (response.statusCode == 200) {
        }
      });
  }

  closeDialog(action: string): void {
    this.dialogModalRef.close(action);
  }

  renderPaymentform = () => {
    console.log("Loading ");

    // this.div.nativeElement.append(this.htmlForm);
    // this.div.nativeElement.innerHTML = this.htmlForm;
  };
}
