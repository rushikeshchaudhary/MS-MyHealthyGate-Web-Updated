import { MatDialog } from "@angular/material/dialog";
import { HomeService } from "../home/home.service";
import { DatePipe } from "@angular/common";
import { CommonService } from "src/app/platform/modules/core/services";
import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { DatepickerOptions } from "ng2-datepicker";
import { ActivatedRoute, Router } from "@angular/router";
import { LabSerachFilterModel, PharmacySearchFilterModel } from "src/app/platform/modules/core/modals/common-model";
import { HomeHeaderComponent } from "src/app/front/home-header/home-header.component";
import { TranslateService } from "@ngx-translate/core";

@Component({
  providers: [HomeHeaderComponent],
  selector: 'app-lab-pharmacy-list',
  templateUrl: './lab-pharmacy-list.component.html',
  styleUrls: ['./lab-pharmacy-list.component.css']
})
export class LabPharmacyListComponent implements OnInit {
  panelOpenState = false;
  specialityIconCheck: any;
  data: any[] = [];
  specialityIcon: any;
  showLoader: boolean = true;
  selectedSpeciality: any;
  selectedLocation: any;
  selectedDate: any;
  selectedGender!: string;
  @ViewChild('tempselectedDate')
  tempselectedDate!: ElementRef;
  @ViewChildren('temprating')
  temprating!: QueryList<any>;
  pharmacysearchtext!: string;
  labserachtext!: string;
  labWidgetClass: string = "col-sm-6 grid-profile";
  pharmacyWidgetClass: string = "col-sm-6 grid-profile";
  options!: DatepickerOptions;
  metaData: any;
  location: any[] = [];
  filterModel: LabSerachFilterModel;
  phafilterModel: PharmacySearchFilterModel;
  labs: any = [];
  pharmacies: any = [];
  totalRecords: number = 0;
  searchedLocation: string = "";
  masterGender: any = [];
  checkedLocations: string[] = [];
  checkedGenders: string[] = [];
  staffTaxonomy: any[] = [];
  labId!: string;
  pharmacyId!: string;
  @ViewChild('prosearchtext')
  prosearchtext!: ElementRef;
  constructor(private commonService: CommonService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private homeService: HomeService,
    private dialogModal: MatDialog,
    private headerComp: HomeHeaderComponent,
    private translate: TranslateService,
    private router: Router) {
    translate.setDefaultLang(localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.filterModel = new LabSerachFilterModel();
    this.phafilterModel = new PharmacySearchFilterModel();
  }

  ngOnInit() {
    window.scroll(0, 0)
    this.getMasterData();
    this.getLabList();
    this.getPharmacyList();
    this.route.queryParams.subscribe(params => {
      this.labId = params["labId"];
      this.pharmacyId = params["pharmacyId"];
    });
  }

  getLabList() {
    this.filterModel.pageSize = 2000;
    this.homeService.getLabList(this.filterModel).subscribe((response: any) => {
      this.filterModel.LabId = '';
      this.labs = [];
      this.metaData = [];
      this.totalRecords = 0;
      if (response != null && response.statusCode == 200) {

        this.labs = response.data;
        this.metaData = response.meta;
        this.totalRecords = this.metaData.totalRecords;
      } else {
      }
      this.showLoader = false;
    });
  }
  getPharmacyList() {
    this.phafilterModel.pageSize = 2000;
    this.homeService.getPharmacyList(this.phafilterModel).subscribe((response: any) => {
      this.phafilterModel.PharmacyId = '';
      this.pharmacies = [];
      this.metaData = [];
      this.totalRecords = 0;
      if (response != null && response.statusCode == 200) {

        this.pharmacies = response.data;
        this.metaData = response.meta;
        this.totalRecords = this.metaData.totalRecords;
      } else {
      }
      this.showLoader = false;
    });
  }
  getMasterData(globalCodeId: any[] = [], requestType: any = 0) {

    this.route.queryParams.subscribe(params => {

      var prvSelectedValue = this.commonService.encryptValue(params["sp"], false)
      var prvSelectedService = this.commonService.encryptValue(params["srvc"], false)
    });


    this.homeService
      .getMasterData("masterLocation,MASTERTAXONOMY,MASTERSTAFFSERVICE,MASTERSPECIALITY,MASTERGENDER", true)
      .subscribe((response: any) => {
        if (response != null) {
          this.masterGender =
            response.masterGender != null ? response.masterGender : [];
          this.location =
            response.masterLocation != null ? response.masterLocation : [];
          this.route.queryParams.subscribe(params => {
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
      });
  }
}
