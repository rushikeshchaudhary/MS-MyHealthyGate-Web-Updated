import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SchedulerService } from 'src/app/platform/modules/scheduling/scheduler/scheduler.service';

@Component({
  selector: 'app-payment-success-test',
  templateUrl: './payment-success-test.component.html',
  styleUrls: ['./payment-success-test.component.css']
})
export class PaymentSuccessTestComponent implements OnInit {
  PaymentToken: any;

  constructor(
    private route: ActivatedRoute,
    private schedulerService: SchedulerService,
  ) { 
    this.route.queryParams.subscribe((params) => {
      this.PaymentToken = params["id"];
    });
  }

  ngOnInit() {
    console.log(this.PaymentToken);
    this.getPaymentStatus()
  }


  getPaymentStatus=()=>{
    debugger;
    this.schedulerService.HyperPayPaymentStatus(this.PaymentToken).subscribe((res)=>{
      console.log(res);
      
    })
  }

}
