import { PaymentService } from "./payment.service";
import { PaymentHistoryComponent } from "./payment-history/payment-history.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { PaymentRoutingModule } from "src/app/platform/modules/agency-portal/Payments/payment-routing.module";
import { SharedModule } from "src/app/shared/shared.module";
import { RefundHistoryComponent } from "./refund-history/refund-history.component";
import { ManageFeesRefundsComponent } from "./manage-fees-refunds/manage-fees-refunds.component";
import { CommonService } from 'src/app/platform/modules/core/services';
import { HttpTokenInterceptor } from "../../core/interceptors";
import { HTTP_INTERCEPTORS } from "@angular/common/http";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PaymentRoutingModule,
    SharedModule
  ],
  declarations: [PaymentHistoryComponent, RefundHistoryComponent],
  providers: [PaymentService, CommonService, { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },]
})
export class PaymentModule {}
