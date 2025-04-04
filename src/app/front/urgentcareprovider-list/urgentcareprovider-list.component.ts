import { MatDialog } from "@angular/material/dialog";
import { HomeService } from "./../home/home.service";
import { DatePipe } from "@angular/common";
import { CommonService } from "src/app/platform/modules/core/services";
import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from "@angular/core";
import { DatepickerOptions } from "ng2-datepicker";
import { enUS } from 'date-fns/locale';
import { ActivatedRoute, Router } from "@angular/router";
import { ProviderSearchFilterModel } from "src/app/platform/modules/core/modals/common-model";
import { LoginModelComponent } from "src/app/shared/login-model/login-model.component";
import { HomeHeaderComponent } from "src/app/front/home-header/home-header.component";
import { BookFreeAppointmentComponent } from "../book-freeappointment/book-freeappointment.component";
import {
  debounceTime,
  map,
  distinctUntilChanged,
  filter
} from "rxjs/operators";
import { fromEvent } from 'rxjs';
import { ProviderProfileModalComponent } from "../provider-profile/provider-profile.component";
import { LabelType, Options } from "@angular-slider/ngx-slider";
import { CancelationRule } from "src/app/platform/modules/agency-portal/Payments/payment.models";
import { ProviderFeeSettingsComponent } from "../provider-fee-settings/provider-fee-settings.component";
import { UrgentCareAppointmentComponent } from "../urgentcare-appointment/urgentcare-appointment.component";
import { ConsultationFeesComponent } from "../consultation-fees/consultation-fees.component";
// import { Options } from "ngx-google-places-autocomplete/objects/options/options";
// type NewType = Options;

@Component({
  providers: [HomeHeaderComponent],
  selector: "app-urgentcareprovider-list",
  templateUrl: "./urgentcareprovider-list.component.html",
  styleUrls: ["./urgentcareprovider-list.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class UrgentCareProviderListComponent implements OnInit, AfterViewInit {
  panelOpenState = false;
  specialityIconCheck : any;
  specialityIcon : any;
  showLoader: boolean = true;
  selectedSpeciality: any;
  selectedLocation: any;
  selectedDate: any;
  @ViewChild('tempselectedDate') tempselectedDate: ElementRef|any;
  @ViewChildren('temprating')
  temprating!: QueryList<any>;
  
  providerserachtext:string='';
  doctorWidgetClass: string = "col-sm-6 grid-profile";
  //options: DatepickerOptions;
  options: any;
  metaData: any;
  sortby: any[] = [
    { value: 1, label: "Price Low" },
    { value: 2, label: "Price High" },
    { value: 3, label: "Rating" }
  ];

  location: any[] = [];
  speciality: any[] = [];
  services: any[] = [];
  minIndex: number = 0;
  maxIndex: number = 10;
  minIndexService: number = 0;
  maxIndexService: number = 10;
  filterModel: ProviderSearchFilterModel;
  providers: any = [];
  totalRecords: number = 0;
  searchedLocation: string = "";
  masterGender: any = [];

  Slider: Options = {
    floor: 0,
    ceil: 1000,
    translate: (value: number, label: LabelType): string => {
      return "JOD " + value;
    }
  };
  minrate= 0;
  maxrate=1000;
  

  checkedLocations: string[] = [];
  checkedSpecialities: string[] = [];
  checkedGenders: string[] = [];
  checkedServices: string[] = [];
  checkedRates: string[] = [];
  reviewRates: string[] = [];
  @ViewChild('prosearchtext') prosearchtext!: ElementRef;
  staffId:string='';
  constructor(
    private commonService: CommonService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private homeService: HomeService,
    private dialogModal: MatDialog,
    private headerComp: HomeHeaderComponent,
    private router: Router
  ) {
    let dte = new Date();
    dte.setDate(dte.getDate() - 1);
    this.options = {
      minYear: 1970,
      maxYear: 2030,
      displayFormat: "MMM D[,] yyyy",
      barTitleFormat: "MMMM yyyy",
      dayNamesFormat: "dd",
      firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
      locale: enUS,
      minDate: dte, // Minimal selectable date
      //maxDate: new Date(Date.now()),  // Maximal selectable date
      barTitleIfEmpty: "Click to select a date",
      placeholder: "Select Date", // HTML input placeholder attribute (default: '')
      fieldId: "my-date-picker", // ID to assign to the input field. Defaults to datepicker-<counter>
      useEmptyBarTitle: false // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown
    };
    this.filterModel = new ProviderSearchFilterModel();
  }


  ngAfterViewInit(): void {
    this.searchInitilizer();
  }

  ngOnInit() {
    window.scroll(0,0)
     this.getMasterData();
  
     this.route.queryParams.subscribe(params => {
      this.staffId = params["providerId"];
      this.specialityIcon = params["searchTerm"];
      // this.checkedSpecialities.push(
      //   this.commonService.encryptValue(params["sp"], false)
      // );
      if (
        params["loc"] != "" &&
        params["loc"] != null &&
        params["loc"] != undefined
      ) {
        this.checkedLocations.push(
          this.commonService.encryptValue(params["loc"], false)
        );
      }
      this.filterModel.Date = params["d"];
    });

    // this.setPaginatorModel(
    //   this.filterModel.pageNumber,
    //   this.filterModel.pageSize,
    //   this.filterModel.sortColumn,
    //   this.filterModel.sortOrder
    // );
    // this.getProviderList(this.filterModel);
  }
  public isKeySet(obj: any, key: string): boolean {
    let isFound = false;
    obj.forEach((element: string) => {
      if ((element as string) == key.toString()) isFound = true;
    });
    return isFound;
  }
  setPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string
  ) {
    let date = null;
    if (
      this.selectedDate != undefined &&
      this.selectedDate != null &&
      this.selectedDate != ""
    ) {
      date = new Date(this.selectedDate);
      //date.setDate(date.getDate() + 1);
    }
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.Date =
      date != null
        ? this.datePipe.transform(new Date(date), "dd-MM-yyyy")
        ?? "" : "";
    this.filterModel.Locations = this.selectedLocation;
    this.filterModel.Specialities = this.checkedSpecialities.toString();
    this.filterModel.Rates = this.checkedRates.toString();

    this.filterModel.MinRate = this.minrate.toString();

    this.filterModel.ReviewRating = this.reviewRates.toString();
    this.filterModel.Services = this.checkedServices.toString();
    this.filterModel.Gender = this.checkedGenders.toString();
    //this.filterModel.Genders.push("0");
    //this.filterModel.Specialities.push(this.selectedSpeciality);
    this.filterModel.ProviderId = this.staffId ? this.staffId : '';
  }
  onSpecialityChange(option: { id: string; }, event: { source: { checked: any; }; }) {
    this.filterModel.ProviderId = '';
    this.staffId = '';
    //this.prosearchtext.nativeElement.value = '';
    if (event.source.checked) {
      this.checkedSpecialities.push(option.id.toString());
      
    } else {
      for (var i = 0; i < this.checkedSpecialities.length; i++) {
        if (this.checkedSpecialities[i] == option.id) {
          this.checkedSpecialities.splice(i, 1);
        }
      }
    }
    
    this.getMasterData(this.checkedSpecialities,1)
    this.applyFilter(true);
    

  }
  onServiceChange(option: { id: string; }, event: { source: { checked: any; }; }) {
    this.filterModel.ProviderId = '';
    this.staffId = '';
    //this.prosearchtext.nativeElement.value = '';
    if (event.source.checked) {
      this.checkedServices.push(option.id.toString());
    } else {
      for (var i = 0; i < this.checkedServices.length; i++) {
        if (this.checkedServices[i] == option.id) {
          this.checkedServices.splice(i, 1);
        }
      }
    }
    this.applyFilter(true);
  }
  onGenderChange(option: { id: string; }, event: { source: { checked: any; }; }) {
    this.filterModel.ProviderId = '';
    this.staffId = '';
    this.prosearchtext.nativeElement.value = '';
    if (event.source.checked) {
      this.checkedGenders.push(option.id.toString());
    } else {
      for (var i = 0; i < this.checkedGenders.length; i++) {
        if (this.checkedGenders[i] == option.id) {
          this.checkedGenders.splice(i, 1);
        }
      }
    }
    this.applyFilter(true);
  }

  // onConsultationFeeChange(event) {
  //   this.filterModel.ProviderId = '';
  //   this.staffId = '';
  //   this.prosearchtext.nativeElement.value = '';
  //   if (event.source.checked) {
  //         this.checkedRates.push(event.source.id.toString());
  //       } else {
  //         for (var i = 0; i < this.checkedRates.length; i++) {
  //           if (this.checkedRates[i] == event.source.id) {
  //             this.checkedRates.splice(i, 1);
  //           }
  //         }
  //       }
    
  //   this.applyFilter(true);
  // }

   onConsultationFeeChange(event?:any) {

    this.filterModel.ProviderId = '';
    this.staffId = '';
    //this.prosearchtext.nativeElement.value = '';
    this.checkedRates=[this.maxrate.toString()];
    
    this.applyFilter(true);
  }

  onReviewRatingChange(event: { source: { checked: any; id: string; }; }) {
    this.filterModel.ProviderId = '';
    this.staffId = '';
    this.prosearchtext.nativeElement.value = '';
    if (event.source.checked) {
          this.reviewRates.push(event.source.id.toString());
        } else {
          for (var i = 0; i < this.reviewRates.length; i++) {
            if (this.reviewRates[i] == event.source.id) {
              this.reviewRates.splice(i, 1);
            }
          }
        }
    
    this.applyFilter(true);
  }

  onDateChange(event?:any) {

    this.applyFilter(true);
  }

  // onFeeChange(option, event) {
  //   if (event.source.checked) {
  //     this.checkedRates.push(option.id.toString());
  //   } else {
  //     for (var i = 0; i < this.checkedRates.length; i++) {
  //       if (this.checkedRates[i] == option.id) {
  //         this.checkedRates.splice(i, 1);
  //       }
  //     }
  //   }
  // }
  clearFilter() {
    
    this.prosearchtext.nativeElement.value = '';
    this.checkedGenders = [];
    this.checkedRates = [];
    this.checkedServices = [];
    this.checkedSpecialities = [];
    this.selectedSpeciality = [];
    this.reviewRates=[];
    this.tempselectedDate['displayValue']='';
    this.temprating.forEach(element => {
      element.checked=false;
    });
    // this.selectedSpeciality = "";
    // this.route.queryParams.subscribe(params => {
    //   this.selectedSpeciality = +this.commonService.encryptValue(
    //     params["sp"],
    //     false
    //   );
    // });
    // this.checkedSpecialities.push(this.selectedSpeciality);
    
    //To reset the Consultation Fees slider.
    this.maxrate=1000;
    this.minrate=0;
   
    this.applyFilter(false);
  }
  applyFilter(isSearching: boolean = true) {
    
    this.setPaginatorModel(
      this.filterModel.pageNumber,
      this.filterModel.pageSize,
      this.filterModel.sortColumn,
      this.filterModel.sortOrder
    );
    this.getProviderList(this.filterModel, isSearching);
  }
  seaching: boolean = false;
  clearing: boolean = false;
  getProviderList(
    filterModel: ProviderSearchFilterModel,
    Isflitering: boolean = false
  ) {
    if (Isflitering) this.seaching = true;
    else this.clearing = true;

    this.homeService.getUrgentCareProviderList(filterModel).subscribe((response: any) => {
      this.filterModel.ProviderId = '';
      this.staffId = '';
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
      this.showLoader = false;
      this.seaching = false;
      this.clearing = false;
    });
  }
 
  getMasterData(globalCodeId:any[]=[],requestType:any=0) {
    
    
    
    this.route.queryParams.subscribe(params => {
      
      var prvSelectedValue=this.commonService.encryptValue(params["sp"], false)
      var prvSelectedService=this.commonService.encryptValue(params["srvc"], false)
      if(prvSelectedService!='' && prvSelectedService!=null && this.checkedServices.length==0 && requestType==0)
     {
       this.checkedServices.push(prvSelectedService);
     }
     if(prvSelectedValue!='' && prvSelectedValue!=null && this.checkedSpecialities.length==0 && requestType==0)
     {
       this.checkedSpecialities.push(prvSelectedValue);
     }

      });
      
      
    this.homeService
      .getMasterData(
        "masterLocation,MASTERTAXONOMY,MASTERSTAFFSERVICE,MASTERSPECIALITY,MASTERGENDER",true,this.checkedSpecialities

      )
      .subscribe((response: any) => {
        if (response != null) {
          this.masterGender =
            response.masterGender != null ? response.masterGender : [];
          // this.speciality =
          //   response.masterTaxonomy != null ? response.masterTaxonomy : [];
          this.speciality =
            response.masterSpeciality != null ? response.masterSpeciality : [];
          this.location =
            response.masterLocation != null ? response.masterLocation : [];
          this.services =
            response.masterStaffServices != null
              ? response.masterStaffServices
              : [];
              
          this.route.queryParams.subscribe(params => {
            // this.selectedSpeciality
          // if( this.commonService.encryptValue(params["sp"], false)!=undefined &&  this.commonService.encryptValue(params["sp"], false)!=null)
           
          // {
            
          //   this.checkedSpecialities.push(
          //     this.commonService.encryptValue(params["sp"], false)
          //   );
          // }
            if (
              params["loc"] != "" &&
              params["loc"] != null &&
              params["loc"] != undefined
            ) {
              this.selectedLocation = +this.commonService.encryptValue(
                params["loc"],
                false
              ); //

              this.searchedLocation = this.location.find(
                x => (x.id = this.selectedLocation)
              ).locationName;
            }
            this.selectedDate = params["d"]; // this.datePipe.transform(params['d'], 'yyyy-MM-dd');
          });
        }
        if(!this.specialityIcon){
        this.applyFilter();
        }
        else{
          this.Providersearchtext(this.specialityIcon);
        }
      });
  }
  bookAppointment(staffId: number, providerId: string) {
    let dbModal;
    if (!localStorage.getItem("access_token")) {
      dbModal = this.dialogModal.open(LoginModelComponent, {
        hasBackdrop: true,
        data: { selectedIndex: 1 }
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
            //this.headerComp.isPatient = result.isPatient;
           //this.headerComp.IsLogin = true;
           //this.headerComp.loading = true;
           //this.headerComp.setispateintlogin();
          // location.reload();
          this.openDialogBookAppointment(staffId, providerId);
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
      this.openDialogBookAppointment(staffId, providerId);
    }
    //let staffId = this.commonService.encryptValue(id);
  }
  openDialogBookAppointment(staffId: number, providerId: string) {
    let dbModal;
    dbModal = this.dialogModal.open(UrgentCareAppointmentComponent, {
      hasBackdrop: true,
      data: {
        staffId: staffId,
        userInfo: null,
        providerId: providerId,
        locationId: this.selectedLocation || 0
      },
      width:"60%"
      //,height:"50%"

    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result != null && result != "close") {
        // if (result == "booked") {
        // }
        //location.reload();
      }
    });
  }
  // redirectToProfilePage(providerId: string) {
  //   if (
  //     this.selectedLocation != undefined &&
  //     this.selectedLocation != null &&
  //     this.selectedLocation != ""
  //   )
  //     this.router.navigate(["/doctor-profile"], {
  //       queryParams: {
  //         id: providerId,
  //         loc: this.commonService.encryptValue(this.selectedLocation, true)
  //       }
  //     });
  //   else
  //     this.router.navigate(["/doctor-profile"], {
  //       queryParams: {
  //         id: providerId
  //       }
  //     });
  // }

  redirectToProfilePage(providerId: string){
    let dbModal;
    dbModal = this.dialogModal.open(ProviderProfileModalComponent, {
      hasBackdrop: true,
      data: { id: providerId},
      width:'80%'
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result != null && result != "close") {
        
      }
    });
  }

  bookFreeAppointment(staffId: number, providerId: string) {
    let dbModal;
    if (!localStorage.getItem("access_token")) {
      dbModal = this.dialogModal.open(LoginModelComponent, {
        hasBackdrop: true,
        data: { selectedIndex: 1 }
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
      this.openDialogBookFreeAppointment(staffId, providerId);
    }
    //let staffId = this.commonService.encryptValue(id);
  }
  openDialogBookFreeAppointment(staffId: number, providerId: string) {
    let dbModal;
    dbModal = this.dialogModal.open(BookFreeAppointmentComponent, {
      hasBackdrop: true,
      data: {
        staffId: staffId,
        userInfo: null,
        providerId: providerId,
        locationId: this.selectedLocation || 0
      }
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result != null && result != "close") {
        if (result == "booked") {
        }
      }
    });
  }

  onSortChange(event: { value: { toString: () => string; }; }) {
    
    this.filterModel.SortType=event.value.toString();
    this.applysortFilter(true);
  }

  applysortFilter(isSearching: boolean = true) {
    
    this.setPaginatorModel(
      this.filterModel.pageNumber,
      this.filterModel.pageSize,
      this.filterModel.sortColumn,
      this.filterModel.sortOrder
    );
    this.getSortProviderList(this.filterModel, isSearching);
  }
  sortseaching: boolean = false;
  sortclearing: boolean = false;
  getSortProviderList(
    filterModel: ProviderSearchFilterModel,
    Isflitering: boolean = false
  ) {
  
    if (Isflitering) this.sortseaching = true;
    else this.sortclearing = true;
   
    this.homeService.getSortUrgentCareProviderList(filterModel).subscribe((response: any) => {
      this.filterModel.ProviderId = '';
      this.staffId = '';
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
      this.showLoader = false;
      this.seaching = false;
      this.clearing = false;
    });
  }


  searchInitilizer()
  {
    fromEvent(this.prosearchtext.nativeElement,'keyup').pipe(

      map((event: any) => {
        return event.target.value;
      })
       , filter(res => res.length > 2 || res.length ==0)
      , debounceTime(1000)
      , distinctUntilChanged()
     ).subscribe((text:string) => {

        this.Providersearchtext(text);
     })
  }

  Providersearchtext(text:string) {
    
    this.filterModel.ProvidersearchText=text;
    this.filterModel.ProviderId = '';
    this.homeService.getsearchtextUrgentCareProviderList(this.filterModel).subscribe((response: any) => { 
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
      this.showLoader = false;
      this.seaching = false;
      this.clearing = false;
    });
  }

  openCancellationRulesPopup(rules: CancelationRule[]){
    rules = rules ? rules : [];
    const dbModal = this.dialogModal.open(ProviderFeeSettingsComponent, {
      hasBackdrop: true,
      data: rules as CancelationRule[],
      width:'400px',
      maxWidth:'400px',
      minWidth:'40%'
    });
  }

  openSeeFees(providerId: string) {
    let dbModal;
    dbModal = this.dialogModal.open(ConsultationFeesComponent, {
      width:'60%',
      data: { id: providerId }
    });
    dbModal.afterClosed().subscribe((result: string) => {
      
    });
  }
 
}
