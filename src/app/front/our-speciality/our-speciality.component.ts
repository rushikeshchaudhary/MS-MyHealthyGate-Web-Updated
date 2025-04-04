import {
  AfterViewInit,
  Component,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { Router } from "@angular/router";
import { HomeHeaderComponent } from "../home-header/home-header.component";

@Component({
  providers: [HomeHeaderComponent],
  selector: "app-our-speciality",
  templateUrl: "./our-speciality.component.html",
  styleUrls: ["./our-speciality.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class OurSpecialityComponent implements OnInit, AfterViewInit {
  showOnView: boolean = false;

  constructor(
    private router: Router
  ) {

  }

  ngAfterViewInit(): void {

  }

  ngOnInit() {
    window.scroll(0, 0);

  }
  showAllServices() {
    this.showOnView = !this.showOnView;
    if(!this.showOnView){
      window.scroll(0, 0);
    }


  }
  RedirectToDoctorsList(sp:any) {
    this.router.navigate(['/doctor-list'], { queryParams: { 'searchTerm': sp } });
  }

  moreSpecialityClick() {
    let url = "/doctor-list";
    this.redirect(url);
  }

  redirect(path: string) {
    this.router.navigate([path]);
  }
}
