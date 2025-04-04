import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HomeService } from '../home/home.service';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-consultation-fees',
  templateUrl: './consultation-fees.component.html',
  styleUrls: ['./consultation-fees.component.css']
})
export class ConsultationFeesComponent implements OnInit {
  userInfo: any;
  lastFollowup: any;
  isProfileLoaded: boolean = false;
  IsPreviousFollowup: boolean = false;
  staffId!: string;
  Organization: any;
  providers: any = [];
  providerId: string = "";

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private dialogModalRef: MatDialogRef<ConsultationFeesComponent>,
    private homeService: HomeService, private translate: TranslateService
  ) {
    translate.setDefaultLang(localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.providerId = data.id;
  }

  ngOnInit() {
    this.getStaffDetail();

  }
  closeDialog(action: any): void {
    this.dialogModalRef.close(action);
  }
  getStaffDetail() {
    this.homeService.getProviderDetail(this.providerId).subscribe(res => {
      if (res.statusCode == 200) {
        this.userInfo = res.data;
        this.isProfileLoaded = true;
      }
    });
  }

}
