import { SubDomainService } from 'src/app/subDomain.service';
import { debounceTime, timeout } from 'rxjs/operators';
import { HomeService } from './home.service';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { DatepickerOptions } from 'ng2-datepicker';
import { enUS } from 'date-fns/locale';
import { UsersService } from 'src/app/platform/modules/agency-portal/users/users.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/platform/modules/core/services';
import {
  ProviderSearchFilterModel,
  ResponseModel,
} from 'src/app/platform/modules/core/modals/common-model';
import { MatDialog } from '@angular/material/dialog';
import { LoginModelComponent } from 'src/app/shared/login-model/login-model.component';
import { HomeHeaderComponent } from '../home-header/home-header.component';
import { SpecialityService } from 'src/app/platform/modules/agency-portal/masters/speciality/speciality.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FilterModel } from 'src/app/super-admin-portal/core/modals/common-model';
import { TranslateService } from '@ngx-translate/core';
import { RegisterModelComponent } from 'src/app/shared/register-model/register.component';

@Component({
  providers: [HomeHeaderComponent],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  selectedConsultationType: any[] = ['Home Visit', 'Face to Face', 'Online'];
  selectedSpeciality: any;
  selectedService: any;
  selectedLocation: any;
  selectedDate: any;
  membershipAd: any[] = [];
  footerAd: any[] = [];
  returnUrl: string = '';
  isMemberShipRectangle: boolean = false;
  isFooterRectangle: boolean = false;
  memberRecPath: string = '';
  footerRecPath: string = '';
  filterModel: ProviderSearchFilterModel;
  subcriptionFilterModel!: FilterModel;
  basicPlan: any = [];
  premiumPlan: any = [];
  providers: any = [];
  totalRecords: number = 0;
  metaData: any;
  //options: DatepickerOptions;
  options: any;
  taxonomies: any[] = [];
  speciality: any[] = [];
  services: any[] = [];
  location: any[] = [];
  specialityIconName: any;
  imageData: any[] = [];
  responseSpecialityIconName: any;
  tab1Active: boolean = true;
  tab2Active: boolean = false;
  tab3Active: boolean = false;
  showOnView: boolean = false;
  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false, //true,
    navSpeed: 700,
    center: false,
    margin: 20,
    navText: [
      '<i class="fa fa-caret-left" aria-hidden="true"></i>',
      '<i class="fa fa-caret-right" aria-hidden="true"></i>',
    ],

    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 3,
      },
      940: {
        items: 3,
      },
    },
    nav: true,
  };
  customOptionsTwo: OwlOptions = {
    loop: true,
    autoplay: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false, //true,
    navSpeed: 700,
    center: false,
    margin: 20,
    navText: [
      '<i class="fa fa-caret-left" aria-hidden="true"></i>',
      '<i class="fa fa-caret-right" aria-hidden="true"></i>',
    ],

    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 3,
      },
      940: {
        items: 3,
      },
    },
    nav: true,
  };
  customOptionsThree: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false, //true,
    margin: 20,
    navSpeed: 700,
    center: false,
    autoplay: true,
    navText: [
      '<i class="fa fa-caret-left" aria-hidden="true"></i>',
      '<i class="fa fa-caret-right" aria-hidden="true"></i>',
    ],

    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 3,
      },
      940: {
        items: 3,
      },
    },
    nav: true,
  };

  customDoctorOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    autoplay: true,
    margin: 20,
    navSpeed: 700,
    navText: [
      '<i class="fa fa-caret-left" aria-hidden="true"></i>',
      '<i class="fa fa-caret-right" aria-hidden="true"></i>',
    ],

    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 3,
      },
      940: {
        items: 3,
      },
    },
    nav: true,
  };
  customTestiOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    margin: 20,
    autoplay: true,
    navSpeed: 700,
    center: false,
    navText: [
      '<i class="fa fa-angle-left" aria-hidden="true"></i>',
      '<i class="fa fa-angle-right" aria-hidden="true"></i>',
    ],

    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 3,
      },
      940: {
        items: 3,
      },
    },
    nav: true,
  };
  customLogoOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    autoplay: true,
    margin: 20,
    navSpeed: 300,
    autoplayTimeout: 3000,
    navText: [
      '<i class="fa fa-angle-left" aria-hidden="true"></i>',
      '<i class="fa fa-angle-right" aria-hidden="true"></i>',
    ],

    responsive: {
      0: {
        items: 2,
      },
      400: {
        items: 2,
      },
      740: {
        items: 6,
      },
      940: {
        items: 6,
      },
    },
    nav: false,
  };
  carouselSlide: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,

    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 3,
      },
      740: {
        items: 5,
      },
      940: {
        items: 5,
      },
    },
  };
  allTestimonial: any[] = [];
  constructor(
    private usersService: UsersService,
    private domSanitizer: DomSanitizer,
    private homeService: HomeService,
    private router: Router,
    private datepipe: DatePipe,
    private commonService: CommonService,
    private subDomainService: SubDomainService,
    private dialogModal: MatDialog,
    private headerComp: HomeHeaderComponent,
    private specialityService: SpecialityService,
    private translate: TranslateService
  ) {
    translate.setDefaultLang(localStorage.getItem('language') || 'en');
    translate.use(localStorage.getItem('language') || 'en');
    this.taxonomies = [];
    this.speciality = [];
    this.location = [];
    let dte = new Date();
    dte.setDate(dte.getDate() - 1);
    this.options = {
      minYear: 1970,
      maxYear: 2030,
      displayFormat: 'MMM D[,] yyyy',
      barTitleFormat: 'MMMM yyyy',
      dayNamesFormat: 'dd',
      firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
      locale: enUS,
      minDate: dte, // Minimal selectable date
      //maxDate: new Date(Date.now()),  // Maximal selectable date
      barTitleIfEmpty: 'Click to select a date',
      placeholder: 'Select Date', // HTML input placeholder attribute (default: '')
      fieldId: 'my-date-picker', // ID to assign to the input field. Defaults to datepicker-<counter>
      useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown
    };
    this.filterModel = new ProviderSearchFilterModel();
  }

  ngOnInit() {
    this.getAdsHome();
    this.applyFilter();
    this.getSpeciality();
    this.getAllSubcriptionPlans();
    this.getAllTestimonial();
  }
  ngAfterViewInit() {
    if (localStorage.getItem('business_token')) {
      this.getMasterData(null);
    } else {
      const subDomainUrl = this.subDomainService.getSubDomainUrl();
      if (subDomainUrl) {
        this.subDomainService.verifyBusinessName(subDomainUrl).subscribe();
        //  this.subDomainService.setupVerifyBusinessResponse(response);
        setTimeout(() => {
          this.getMasterData(null);
        }, 3000);
        /* setTimeout(()=>{                           // <<<---using ()=> syntax
          this.subDomainService.getSubDomainInfo().subscribe(domainInfo => {
            if (domainInfo) {
              console.log('Home >> ngAfterViewInit 8');
              ///localStorage.setItem("logo","data:image/png;base64," +domainInfo.organization.logoBase64)
              this.subDomainService.updateFavicon(
                "data:image/png;base64," + domainInfo.organization.faviconBase64
              );

            }
          });
      }, 3000);*/
      }
    }
  }

  getAllTestimonial() {
    this.homeService
      .getAllTestimonial(this.filterModel)
      .subscribe((response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.allTestimonial = response.data;
        } else {
          this.allTestimonial = [];
        }
      });
  }
  Speciality(sin: { globalCodeName: any }) {
    this.router.navigate(['/doctor-list'], {
      queryParams: { searchTerm: sin.globalCodeName },
    });
  }
  RedirectToDoctorsList(sp: any) {
    this.router.navigate(['/doctor-list'], { queryParams: { searchTerm: sp } });
  }
  changeSpeciality(event?:any) {
    this.getMasterData(this.selectedSpeciality);
  }
  getMasterData(globalCodeId: any) {
    this.homeService
      .getMasterData(
        'masterLocation,MASTERTAXONOMY,MASTERSPECIALITY,MASTERSTAFFSERVICE',
        true,
        globalCodeId
      )
      .subscribe((response: any) => {
        if (response != null) {
          this.taxonomies =
            response.masterTaxonomy != null ? response.masterTaxonomy : [];
          this.speciality =
            response.masterSpeciality != null ? response.masterSpeciality : [];
          this.location =
            response.masterLocation != null ? response.masterLocation : [];
          this.services =
            response.masterStaffServices != null
              ? response.masterStaffServices
              : [];

          //this.speciality.push({ id: 0, value: "More specialties can be populated on request", disabled: true });
          this.speciality.push({
            id: 0,
            value: 'More speciality can be added',
            disabled: true,
          });
          this.services.push({
            id: 0,
            value: 'More services can be populated on request',
            disabled: true,
          });
        }
      });
  }
  doctorListingRedirection() {
    ////debugger
    let spl = this.commonService.encryptValue(this.selectedSpeciality, true);
    let srvc = this.commonService.encryptValue(this.selectedService, true);

    // let srvc= this.commonService.encryptValue(this.selectedService, true);
    let location = this.commonService.encryptValue(this.selectedLocation, true); //agencyremove
    // let location = this.commonService.encryptValue(101, true);
    let date = this.datepipe.transform(this.selectedDate, 'yyyy-MM-dd');
    this.router.navigate(['/doctor-list'], {
      queryParams: { sp: spl, loc: location, d: date, srvc: srvc },
    });
  }

  openDialogLogin() {
    this.router.navigate(['/web/login-selection']);
  }

  applyFilter() {
    this.setPaginatorModel(
      this.filterModel.pageNumber,
      this.filterModel.pageSize,
      this.filterModel.sortColumn,
      this.filterModel.sortOrder
    );
    this.getProviderList(this.filterModel);
  }

  getProviderList(filterModel: ProviderSearchFilterModel) {
    this.filterModel.Rates = '';
    this.filterModel.ReviewRating = '';
    this.homeService.getProviderList(filterModel).subscribe((response: any) => {
      this.providers = [];
      this.metaData = [];
      this.totalRecords = 0;
      if (response != null && response.statusCode == 200) {
        this.providers = response.data;
        this.metaData = response.meta;
        this.totalRecords = this.metaData.totalRecords;
      } else {
        //this.userInvitationModel = []; this.metaData = new Metadata();
      }
      // this.showLoader = false;
    });
  }

  openSymptomChecker():any {
    let dbModal;
    if (!localStorage.getItem('access_token')) {
      dbModal = this.dialogModal.open(LoginModelComponent, {
        hasBackdrop: true,
        data: { selectedIndex: 0 },
      });
      dbModal.afterClosed().subscribe((result: any) => {
        if (localStorage.getItem('access_token')) {
          this.router.navigate(['/symptom-checker']);
          return false;
        }
        return false;
      });
    } else {
      this.router.navigate(['/symptom-checker']);
      return false;
    }
    return;
  }
  setPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string
  ) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;

    //this.filterModel.Genders.push("0");
    //this.filterModel.Specialities.push(this.selectedSpeciality);
  }

  redirectToProfilePage(providerId: string) {
    this.router.navigate(['/doctor-profile'], {
      queryParams: {
        id: providerId,
      },
    });
  }

  redirectToListing(providerId: string) {
    this.router.navigate(['/doctor-list'], {
      queryParams: {
        providerId: providerId,
      },
    });
  }

  bookAppointment(staffId: number, providerId: string) {
    let dbModal;
    if (!localStorage.getItem('access_token')) {
      dbModal = this.dialogModal.open(LoginModelComponent, {
        hasBackdrop: true,
        data: { selectedIndex: 1 },
      });
      dbModal.afterClosed().subscribe((result: any) => {
        let response = result.response;
        if (
          response.statusCode >= 400 &&
          response.statusCode < 500 &&
          response.message
        ) {
          //this.errorMessage = response.message;
          this.headerComp.loading = false;
        } else if (response.statusCode === 205) {
          //this.errorMessage = response.message;
          this.headerComp.loading = false;
        } else if (response.access_token) {
          // this.headerComp.isPatient = result.isPatient;
          // if (result.isPatient == false) {
          //   this.headerComp.redirectToDashboard("/web");
          // } else {

          //this.headerComp.IsLogin = true;
          //this.headerComp.checkUserLogin();
          location.reload();
          //}
        } else {
          this.headerComp.openDialogSecurityQuestion();
        }
        // if (result != null && result.response.access_token != "") {

        //     this.headerComp.IsLogin == true;
        //     this.headerComp.checkUserLogin();
        // }
      });
    } else {
      //this.openDialogBookAppointment(staffId, providerId);
    }
    //let staffId = this.commonService.encryptValue(id);
  }

  getSpeciality() {
    this.specialityService
      .getSpecialityIconName()
      .subscribe((response: any) => {
        if (response != null) {
          this.responseSpecialityIconName = response.data;
          if (
            this.responseSpecialityIconName != null &&
            this.responseSpecialityIconName.length > 0
          ) {
            this.responseSpecialityIconName.forEach((app: any) => {
              app.specialityIcon = this.domSanitizer.bypassSecurityTrustUrl(
                app.specialityIcon
              );
            });

            this.specialityIconName = this.responseSpecialityIconName;
          }

          // console.log(this.specialityIconName);

          // this.imagePreview = this.specialityModel.photoThumbnailPath;
        }
      });
  }

  getAdsHome() {
    this.homeService.getAdsHome(true).subscribe((response: any) => {
      if (response != null && response.data) {
        this.imageData = response.data;
        this.membershipAd = response.data.filter(
          (d: { position: string }) => d.position == 'Membership'
        );
        if (this.membershipAd != null && this.membershipAd.length > 0) {
          this.isMemberShipRectangle = this.membershipAd[0].size == '2';
          this.memberRecPath = this.membershipAd[0].photoPath;
        }
        this.footerAd = response.data.filter(
          (d: { position: string }) => d.position == 'Footer'
        );
        if (this.footerAd != null && this.footerAd.length > 0) {
          this.isFooterRectangle = this.footerAd[0].size == '2';
          this.footerRecPath = this.footerAd[0].photoPath;
        }
      }
    });
  }

  tabActiveTwo(eve: number) {
    this.tab1Active = false;
    this.tab2Active = false;
    this.tab3Active = false;
    if (eve == 1) {
      this.tab1Active = true;
    } else if (eve == 2) {
      this.tab2Active = true;
    } else {
      this.tab3Active = true;
    }
  }

  showAllServices() {
    this.router.navigate(['/our-speciality']);
  }
  getAllSubcriptionPlans() {
    this.homeService
      .getAllSubscriptionPlans(true)
      .subscribe((response: any) => {
        this.basicPlan = response.data.filter(
          (e: { planType: string }) => e.planType == 'Basic'
        );
        this.premiumPlan = response.data.filter(
          (e: { planType: string }) => e.planType == 'Premium'
        );
      });
  }
  registerClick() {
    // let url = "/web/sign-up";
    // this.redirect(url);
    // this.IsSignUp = true;
    let dbModal;
    dbModal = this.dialogModal.open(RegisterModelComponent, {
      hasBackdrop: true,
      data: { selectedIndex: 1 },
    });
    dbModal.afterClosed().subscribe((result: string) => {});
  }
  loginClick():any {
    let dbModal;
    if (localStorage.getItem('UserRole') != 'CLIENT') {
      dbModal = this.dialogModal.open(LoginModelComponent, {
        hasBackdrop: true,
        data: { selectedIndex: 1 },
      });
      dbModal.afterClosed().subscribe((result: any) => {
        let response = result.response;
        if (
          response.statusCode >= 400 &&
          response.statusCode < 500 &&
          response.message
        ) {
          this.headerComp.loading = false;
        } else if (response.statusCode === 205) {
          this.headerComp.loading = false;
        } else {
          this.returnUrl = 'web/client/subscriptionplan';
          this.router.navigate([this.returnUrl]);
        }
      });
    } else {
      this.returnUrl = 'web/client/subscriptionplan';
      this.router.navigate([this.returnUrl]);
      return false;
    }
    return
  }

  howItWorksClick() {
    let url = '/providers';
    this.redirect(url);
  }

  redirect(path: string) {
    this.router.navigate([path]);
  }
}
