import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../auth.service";
import { CommonService } from "../../core/services";
import { environment } from "src/environments/environment";
import * as internal from "assert";
import { MatDialog } from "@angular/material/dialog";
import { SecuritywecomeComponent } from "../securitywecome/securitywecome.component";

@Component({
  selector: "app-security-question",
  templateUrl: "./security-question.component.html",
  styleUrls: ["./security-question.component.css"]
})
export class SecurityQuestionComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription;
  securityQuestionForm!: FormGroup;
  securityQuestionOptionsForm!: FormGroup;
  loading = false;
  submitted = false;
  errorMessage: string|null=null;
  returnUrl!: string;
  firstTimeLogin: boolean = false;
  securityQuestions: any = [];
  securityQuestionOptions: any = [];
  authData: any;
  ipAddress!: string;
  isPatient!: number;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService,
    private commonService: CommonService, // private securityQuestionService: SecurityQuestionService, // private alertService: AlertService
    private dialog:MatDialog
    ) {
    this.createForm();
    this.errorMessage = null;
  }
  createForm() {
    // this.securityQuestionForm = this.formBuilder.group({
    //   question: ''
    // });
  }
  createOptionsForm() {
    // this.securityQuestionOptionsForm = this.formBuilder.group({
    //   question: '',
    //   answer: ''
    // });
  }
  ngOnInit() {
    this.securityQuestionModal();
    this.commonService.sytemInfo.subscribe(obj => {
      this.ipAddress = obj.ipAddress;
    });
    this.isPatient = Number(localStorage.getItem("isPatient"));
    this.subscription = this.commonService.loginSecurity.subscribe(
      (user: any) => {
        if (
          user.loginResponse &&
          !user.loginResponse.access_token &&
          user.loginResponse.data
        ) {
          if (user.loginResponse.firstTimeLogin) {
            this.securityQuestions = user.loginResponse.data;
            this.firstTimeLogin = true;
            this.authData = user.authData;

            const questionsForm: { [key: string]: any } = {};
            (this.securityQuestions || []).forEach((obj: any) => {
              questionsForm[`question${obj.id}`] = ["", Validators.required];
            });
            this.securityQuestionForm = this.formBuilder.group({
              ...questionsForm
            });
          } else {
            this.securityQuestionOptions = user.loginResponse.data;
            this.firstTimeLogin = false;
            this.authData = user.authData;
            this.securityQuestionOptionsForm = this.formBuilder.group({
              question: ["", Validators.required],
              answer: ["", Validators.required]
            });
          }
        } else {
          this.router.navigate(["/web"]);
        }
      }
    );
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.securityQuestionForm;
  }
  get g() {
    return this.securityQuestionOptionsForm;
  }
  onSubmitQuestionAnswer() {
    this.submitted = true;
    this.errorMessage = null;
    // stop here if form is invalid
    if (this.securityQuestionOptionsForm.invalid) {
      return;
    }
    this.loading = true;

    const postData = {
      userName: this.authData.username,
      password: this.authData.password,
      QuestionID: this.g.value.question,
      Answer: this.g.value.answer,
      ipaddress: this.ipAddress,
      macaddress: "ec:aa:a0:2d:dc:67"
    };
    this.authService.checkQuestionAnswer(postData).subscribe(
      data => {
        this.submitted = false;
        if (data.statusCode == 200 && data.access_token) {
          if (this.isPatient == 0)
            this.router.navigate(["/web"]);
          else
            this.router.navigate(["web/client/dashboard"]);
        }

        else this.errorMessage = data.message;
      },
      error => {
        this.loading = false;
      }
    );
  }
  securityQuestionModal() {
    //let response;
    this.dialog.open(SecuritywecomeComponent, {
      hasBackdrop: true,
      width: "45%"
    });
    // response.afterClosed().subscribe((result: string) => {

    // });
  }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.securityQuestionForm.invalid) {
      return;
    }
    this.loading = true;
    const questionsDataArray = (Object.keys(this.f.value) || []).map(key => {
      return {
        Id: 0,
        QuestionID: key.replace("question", ""),
        Answer: this.f.value[key]
      };
    });

    const postData = {
      userName: this.authData.username,
      password: this.authData.password,
      SecurityQuestionList: questionsDataArray,
      ipaddress: this.ipAddress,
      macaddress: "ec:aa:a0:2d:dc:67"
    };
    this.authService.saveSecurityQuestion(postData).subscribe(
      data => {

        if (data.data.users3.userRoles.roleName == "Radiology") {
          this.router.navigate(["/web/dashboard"])
        } else if (data.data.users3.userRoles.roleName == "Pharmacy") {
          this.router.navigate(["/web/dashboard"])
        }
        else if (data.data.users3.userRoles.roleName.toUpperCase() == "PROVIDER" || data.data.users3.userRoles.roleName == "Lab")
          this.router.navigate(["/web/dashboard"]);
        else
          this.router.navigate(["/web/client/dashboard"]);
      },
      error => {
        this.loading = false;
      }
    );
  }

  ngOnDestroy() {
    if(this.subscription){

      this.subscription.unsubscribe();
    }
  }
}
