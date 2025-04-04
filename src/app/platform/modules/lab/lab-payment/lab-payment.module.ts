import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LabPaymentRoutingModule } from "./lab-payment-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { CommonService } from "../../core/services";
import { LabPaymentService } from "./lab-payment.service";
import { LabPaymentHistoryComponent } from "./lab-payment-history/lab-payment-history.component";
import { LabRefundHistoryComponent } from "./lab-refund-history/lab-refund-history.component";
import { LabManageFeeComponent } from "./lab-manage-fee/lab-manage-fee.component";
import { LabPaymentComponent } from "./lab-payment/lab-payment.component";

@NgModule({
  imports: [
    CommonModule,
    LabPaymentRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
  ],
  declarations: [
    LabPaymentHistoryComponent,
    LabRefundHistoryComponent,
    LabManageFeeComponent,
    LabPaymentComponent,
  ],
  // entryComponents: [
  //   LabPaymentHistoryComponent,
  //   LabRefundHistoryComponent,
  //   LabManageFeeComponent,
  // ],
  providers: [CommonService, LabPaymentService],
})
export class LabPaymentModule {}
