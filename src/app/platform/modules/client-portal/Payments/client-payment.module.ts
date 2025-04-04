import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClientPaymentRoutingModule } from "./client-payment-routing.module";
import { PaymentHistoryComponent } from "./payment-history/payment-history.component";
import { RefundHistoryComponent } from "./refund-history/refund-history.component";
import { CardHistoryComponent } from "./card-history/card-history.component";

import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpLoaderFactory, SharedModule } from "src/app/shared/shared.module";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { AddCardDialogComponent } from "./add-card-dialog/add-card-dialog.component";
//import { PaymentContainerComponent } from './payment-container/payment-container.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    ClientPaymentRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [
    PaymentHistoryComponent,
    RefundHistoryComponent,
    CardHistoryComponent,
    AddCardDialogComponent,
  ],
  // entryComponents: [
  //   PaymentHistoryComponent,
  //   RefundHistoryComponent,
  //   CardHistoryComponent,
  //   AddCardDialogComponent,
  //   // PaymentContainerComponent
  // ],
})
export class ClientPaymentModule {}
