
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { HomeHeaderComponent } from "src/app/front/home-header/home-header.component";
import { TranslateService } from "@ngx-translate/core";

@Component({
  providers: [HomeHeaderComponent],
  selector: "app-our-doctors",
  templateUrl: "./our-doctors.component.html",
  styleUrls: ["./our-doctors.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class OurDoctorsComponent implements OnInit {
  constructor(private translate: TranslateService) {
    translate.setDefaultLang(localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
  }

  ngOnInit() { }
}
