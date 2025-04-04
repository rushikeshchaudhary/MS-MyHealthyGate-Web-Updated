import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from "@angular/router";
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { RefundHistoryComponent } from './refund-history/refund-history.component';
import { CardHistoryComponent } from './card-history/card-history.component';


const routes: Routes = [
  {
    path: "payment-history",
    component: PaymentHistoryComponent
  },
  {
    path: "refund-history",
    component: RefundHistoryComponent
  },
  {
    path: "card-history",
    component: CardHistoryComponent
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ClientPaymentRoutingModule { }
