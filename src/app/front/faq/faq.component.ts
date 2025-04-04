
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { HomeHeaderComponent } from "src/app/front/home-header/home-header.component";

@Component({
  providers: [HomeHeaderComponent],
  selector: "app-faq",
  templateUrl: "./faq.component.html",
  styleUrls: ["./faq.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class FaqComponent implements OnInit {
  panelOpenState: boolean = false;
  faqActiveFlag = 0;
  
  ngOnInit() {
    this.flagActive(0);
  }

  flagActive(eve: any) {
    this.faqActiveFlag = eve;
  }

}
