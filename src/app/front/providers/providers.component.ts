import { Component, OnInit } from '@angular/core';
import { HomeService } from '../home/home.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.css']
})
export class ProvidersComponent implements OnInit {

  basicPlan:any = [];
  premiumPlan:any = [];
  viewFlag: any = 1;

  constructor(
    private homeService: HomeService,
    private router: Router,
    private activatedRoute:ActivatedRoute
  ) { }

  
  ngOnInit() {
    this.activatedRoute.fragment.subscribe((value)=>{
      this.jumpTo(value);
    });
    this.getAllSubcriptionPlans()
  }
  jumpTo(section:any){
    document.getElementById(section)!.scrollIntoView({behavior:'smooth'})
  }

  loginClick(){

  }

  viewFun(tabNum : any){
    this.viewFlag = tabNum;
  }

  getAllSubcriptionPlans(){
    this.homeService.getAllSubscriptionPlans( true).subscribe((response: any) => { 
    this.basicPlan = response.data.filter((e: { planType: string; }) => e.planType == "Basic");
    this.premiumPlan = response.data.filter((e: { planType: string; }) =>e.planType == "Premium");
    });
  }

  signUpClick() {
    let url = "/web/sign-up";
    this.redirect(url);
  }

  redirect(path: string) {
    this.router.navigate([path]);
  }
}
