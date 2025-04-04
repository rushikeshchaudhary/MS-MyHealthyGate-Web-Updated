import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LabPaymentComponent } from './lab-payment/lab-payment.component';

const routes: Routes = [
  {
    path: "",
    component: LabPaymentComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LabPaymentRoutingModule { }
