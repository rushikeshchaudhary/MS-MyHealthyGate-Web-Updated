import { DOCUMENT } from "@angular/common";
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { SchedulerService } from "src/app/platform/modules/scheduling/scheduler/scheduler.service";
declare var hpwlPayment: any;
@Component({
  selector: "app-test-payment-flow",
  templateUrl: "./test-payment-flow.component.html",
  styleUrls: ["./test-payment-flow.component.css"],
})
export class TestPaymentFlowComponent implements OnInit {
  @ViewChild("paymantForm") paymantForm!: ElementRef;
  Url = "https://localhost:4200/testPaymentSuccess"; // staging
  UrgentUrl = this.Url + "?urgentcare=1";
  constructor(
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private _document:any,
    private schedulerService: SchedulerService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.createPaymentForm();
  }
  createPaymentForm = () => {
    this.schedulerService
      .checkoutPaymentForAppointment(44 + "")
      .subscribe((response: any) => {
        console.log("payment = > ", response);
        const script = document.createElement("script");
        script.src = `https://test.oppwa.com/v1/paymentWidgets.js?checkoutId=${response.id}`;
        script.async = true;
        document.body.appendChild(script);
        setTimeout(() => {
          this.initializeHyperpay();
        }, 2000);
      });
  };

  initializeHyperpay(): void {
    const wholeFormRegistrationCard = this.elementRef.nativeElement;

    const savedCardElement = wholeFormRegistrationCard.querySelector(
      "#wpwl-registrations"
    );
    // check If No registered card Is available.
    if (savedCardElement == null) {
      const createRegistrationHtml =
        '<div class="customLabel">Store payment details?</div><div class="customInput"><input style="height:20px;width:20px" type="checkbox" name="createRegistration" value="true" /></div>';
      const createRegistrationElement = this.renderer2.createElement("div");
      this.renderer2.setProperty(
        createRegistrationElement,
        "innerHTML",
        createRegistrationHtml
      );
      this.renderer2.insertBefore(
        this.elementRef.nativeElement.querySelector(".wpwl-button").parentNode,
        createRegistrationElement,
        this.elementRef.nativeElement.querySelector(".wpwl-button")
      );

      // registration card is Available:
    } else {
      const cardElement = wholeFormRegistrationCard.children[2];
      const createRegistrationHtml = `
      <div class="customLabel">Store payment details?</div>
      <div class="customInput"><input style="height:20px;width:20px" type="checkbox" name="createRegistration" value="true" /></div>
    `;
      setTimeout(() => {
        const buttonElement = cardElement.querySelector(".wpwl-button");
        if (buttonElement) {
          buttonElement.insertAdjacentHTML(
            "beforebegin",
            createRegistrationHtml
          );
        }
      }, 0);
    }
  }
}
