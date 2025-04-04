import { Component, OnInit, ViewEncapsulation, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';
import { SubDomainService } from '../../../../subDomain.service';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AuthComponent implements OnInit, OnDestroy {
  imgSrc:string;
  subscription!: Subscription
  logoUrl: string;
  constructor(private subDomainService: SubDomainService,
    private authService: AuthenticationService,
    private translate: TranslateService,
    private cd: ChangeDetectorRef) {
    this.logoUrl = '';
    this.imgSrc = "../../../../../assets/login-patient.png";
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.subsribeSideImgUrl();
  }

  ngOnInit() {
    this.subscription = this.subDomainService.getSubDomainInfo().subscribe(domainInfo => {
      if (domainInfo)
        this.logoUrl = 'data:image/png;base64,' + domainInfo.organization.logoBase64;
    });
    this.setSideBarImgPath("../../../../../assets/login-patient.png");
  }

  subsribeSideImgUrl(){
    this.authService.getSideScreenImgSrc().subscribe(path => {
      if(path){
        this.setSideBarImgPath(path);
      }
    })
  }

  setSideBarImgPath(path:any){
    if(path){
    const sideScreenImgRef = document.getElementById("sideScreenImg") as HTMLImageElement;
    if(sideScreenImgRef)
    sideScreenImgRef.src =path;
   }
  }


  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
    
  }

 

}
