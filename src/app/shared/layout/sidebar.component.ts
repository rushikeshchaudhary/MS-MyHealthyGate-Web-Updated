import { Component, ViewChild, OnInit, Input, OnChanges } from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { SharedService } from "../shared.service";
import { NavItem, SidebarInfo } from "../models";
import { SubDomainService } from "src/app/subDomain.service";
import { Router } from "@angular/router";
import { CommonService } from "src/app/platform/modules/core/services";

@Component({
  selector: "app-layout-sidebar",
  templateUrl: "sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
  providers: [SubDomainService],
})
export class SidebarComponent implements OnInit, OnChanges {
  @Input() sidebarInfo!: SidebarInfo;
  @ViewChild("sidenav") public sidenav!: MatSidenav;
  isSideBarOpen = true;
  organizationModel: string|null=null;
  navItems: NavItem[] = [];
  verifiedUser: any;
  constructor(
    private subDomainService: SubDomainService,
    private sharedService: SharedService,
    private commonService:CommonService,
    private router: Router
  ) {
    this.subDomainService.subjectlogo.subscribe((res) => {
      if (res) {
        setTimeout(() => {
          this.organizationModel = sessionStorage.getItem("logo");
        }, 500);
      }
    });
    if (sessionStorage.getItem("logo"))
      this.organizationModel = sessionStorage.getItem("logo");
  }
  ngAfterViewChecked() {
    if (sessionStorage.getItem("logo")) {
      this.organizationModel = sessionStorage.getItem("logo");
    }
  }

  ngOnChanges(changes:any) {
    const sidebarInfo = changes.sidebarInfo || null;
    if (sidebarInfo && sidebarInfo.currentValue) {
      this.verifiedUser = localStorage.getItem("UserRole");
      this.navItems = sidebarInfo.currentValue.navigations;
      console.log('verifiedUser',this.verifiedUser);

      // debugger
      // if(this.verifiedUser=='PROVIDER'){
      //   let index=this.navItems.findIndex(d=>d.displayName=='My Appointments');
      //   if(index!=-1){
      //    // this.navItems[index].extraInfo = localStorage.getItem("pendingAppointment");
      //    this.navItems[index].extraInfo= this.commonService.getPendingAppointment();
      //   }
      // }

      // debugger
      // if(this.verifiedUser=='PROVIDER'){
      //   let index=this.navItems.findIndex(d=>d.displayName=='Mailbox');
      //   if(index!=-1){
      //    // this.navItems[index].extraInfo = localStorage.getItem("pendingAppointment");
      //    this.navItems[index].extraInfo= this.commonService.getInboxCount();
      //   }
      // }

      /*if(this.verifiedUser=='PROVIDER'){
        let index=this.navItems.findIndex(d=>d.displayName=='Masters');
        if(index!=-1){
          this.navItems[index].displayName="Clinical Management";
        }
        
      }*/
    }
  }

  ngOnInit() {
    this.verifiedUser = localStorage.getItem("UserRole");
    if (sessionStorage.getItem("logo"))
      this.organizationModel = sessionStorage.getItem("logo");
    this.sharedService.setSidenav(this.sidenav);
    this.addremoveCustomClasses(true);
  }

  imgClickHandler = () => {
    let role = localStorage.getItem("UserRole");
    console.log(role);

    if (role == "CLIENT") {
      this.router.navigate(["/web/client/dashboard"]);
    } else if (role == "STAFF") {
      this.router.navigate(["/web/dashboard"]);
    } else if (role == "PROVIDR") {
      this.router.navigate(["/web/dashboard"]);
    } else if (role == "RADIOLOGY") {
      this.router.navigate(["/web/radiology/dashboard"]);
    } else if (role == "LAB") {
      this.router.navigate(["/web/lab/dashboard"]);
    } else if (role == "PHARMACY") {
      this.router.navigate(["/web/pharmacy/dashboard"]);
    }
  };

  toggleSidebar() {
    this.isSideBarOpen = !this.isSideBarOpen;
    this.addremoveCustomClasses(this.isSideBarOpen);
  }

  addremoveCustomClasses(isOpen: boolean) {
    const elerefSidebar = document.getElementsByClassName("mat-drawer");
    const elerefContent = document.getElementsByClassName("mat-drawer-content");
    const elerefHeader = document.getElementsByClassName("main-header");

    let sidebar =
      elerefSidebar && elerefSidebar.length > 0
        ? (elerefSidebar[0] as HTMLElement)
        : null;
    let content =
      elerefContent && elerefContent.length > 0
        ? (elerefContent[0] as HTMLElement)
        : null;
    let header =
      elerefHeader && elerefHeader.length > 0
        ? (elerefHeader[0] as HTMLElement)
        : null;

    if (isOpen) {
      if (sidebar) {
        sidebar.classList.add("custom-nav-sidebar-open");
        sidebar.classList.remove("custom-nav-sidebar-close");
      }
      if (content) {
        content.classList.add("custom-draw-content-open");
        content.classList.remove("custom-draw-content-close");
      }
      if (header) {
        header.classList.add("custom-header-content-open");
        header.classList.remove("custom-header-content-close");
      }
    } else {
      if (sidebar) {
        sidebar.classList.remove("custom-nav-sidebar-open");
        sidebar.classList.add("custom-nav-sidebar-close");
      }
      if (content) {
        content.classList.remove("custom-draw-content-open");
        content.classList.add("custom-draw-content-close");
      }
      if (header) {
        header.classList.remove("custom-header-content-open");
        header.classList.add("custom-header-content-close");
      }
    }
  }
}
