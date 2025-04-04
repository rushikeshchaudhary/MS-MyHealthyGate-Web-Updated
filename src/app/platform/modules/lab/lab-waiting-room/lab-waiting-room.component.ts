import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: "app-lab-waiting-room",
  templateUrl: "./lab-waiting-room.component.html",
  styleUrls: ["./lab-waiting-room.component.css"],
})
export class LabWaitingRoomComponent implements OnInit {
  

  constructor(
    private translate:TranslateService
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
  }

  ngOnInit() {
  }
  onTabChange=(event:any)=>{
    console.log(event)
  }
  
}
