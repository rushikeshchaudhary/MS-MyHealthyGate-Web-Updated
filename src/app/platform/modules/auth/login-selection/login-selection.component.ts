import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { TermsConditionModalComponent } from 'src/app/front/terms-conditions/terms-conditions.component';
import { AuthenticationService } from '../auth.service';

@Component({
  selector: 'app-login-selection',
  templateUrl: './login-selection.component.html',
  styleUrls: ['./login-selection.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginSelectionComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl!: string;
  subDomainInfo: any;
  errorMessage: string|null = null;
  ipAddress!: string;
  isLogin:boolean=false;
  iSignUp:boolean=false;
  organizationModel!: string;
  constructor(

    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private dialogModal: MatDialog
  ) {
    if (this.route.snapshot.url[0].path == "signup-selection") {
      this.iSignUp = true;
    } else if (this.route.snapshot.url[0].path == "login-selection") {
      this.isLogin = true;
    }
  }

  ngOnInit() {
    this.organizationModel=sessionStorage.getItem("logo")!;
  }
  ngAfterViewChecked()
  {
    if(sessionStorage.getItem("logo"))
   {
    this.organizationModel=sessionStorage.getItem("logo")!;
  }
}
  reDirectTo(type:string){
    let url ='';
    if(this.isLogin){
      if(type==='patient'){
        url='/web/client-login' ;
      }else{
        url ='/web/login'  
      }
    }
    else if(this.iSignUp) {
      if(type==='patient'){
        url='/web/sign-up' ;
      }else if(type==='lab'){
        url='/web/sign-up';
      }else if(type==='pharmacy'){
        url='/web/sign-up';
      }else{
        url ='/web/sign-up'  
      }
      // url = type === 'patient'? '/web/client-signup' : '/web/provider-signup'
    }
    // else if(this.iSignUp) {
    //   url = type === 'patient'? '/web/client-signup' : '/web/provider-signup'
    // }
    this.redirect(url);
  }

  redirect(path:any) {
    this.router.navigate([path]);
  }

  changeSideImg(type:any) {
    if (type === 'patient')
      this.authenticationService.updateSideScreenImgSrc("../../../../../assets/login-patient.png");
    else if (type === 'provider')
      this.authenticationService.updateSideScreenImgSrc("../../../../../assets/login-doc.png");
    else if (type === 'lab')
    this.authenticationService.updateSideScreenImgSrc("../../../../../assets/login-patient.png");
    else if (type === 'pharmacy')
    this.authenticationService.updateSideScreenImgSrc("../../../../../assets/login-patient.png");
  }
  opentermconditionmodal() {
    let dbModal;
    dbModal = this.dialogModal.open(TermsConditionModalComponent, {
      hasBackdrop: true,
      width:'70%'
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result != null && result != "close") {
        
      }
    });
  }
}
