import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppointmentTypeComponent } from "./appointment-type/appointment-type.component";
import { ServiceCodesComponent } from "./service-codes/service-codes.component";
import { MastersRoutingModule } from "./masters-routing.module";
import { AppointmentTypeModalComponent } from "./appointment-type/appointment-type-modal/appointment-type-modal.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PlatformMaterialModule } from "../../../platform.material.module";
import { ServiceCodeModalComponent } from "./service-codes/service-code-modal/service-code-modal.component";
import { MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material/dialog";
import { SharedModule } from "../../../../shared/shared.module";
import { ServiceCodeService } from "./service-codes/service-code.service";
import { AppointmentTypeService } from "./appointment-type/appointment-type.service";
import { IcdCodesComponent } from "./icd-codes/icd-codes.component";
import { IcdCodeModalComponent } from "./icd-codes/icd-code-modal/icd-code-modal.component";
import { ICDCodeService } from "./icd-codes/icd-code.service";
import { ColorPickerModule } from "ngx-color-picker";
import { RolePermissionsComponent } from "./role-permissions/role-permissions.component";
import { SecurityQuestionComponent } from "./security-question/security-question.component";
import { SecurityQuestionService } from "./security-question/security-question.service";
import { SecurityQestionModalComponent } from "./security-question/security-question-modal/security-question-modal.component";
import { CustomFieldsComponent } from "./custom-fields/custom-fields.component";
import { CustomFieldModalComponent } from "./custom-fields/custom-fields-modal/custom-fields-modal.component";
import { CustomFieldsService } from "./custom-fields/custom-fields.service";
import { InsuranceTypeComponent } from "./insurance-type/insurance-type.component";
import { InsuranceTypeModalComponent } from "./insurance-type/insurance-type-modal/insurance-type-modal.component";
import { InsuranceTypeService } from "./insurance-type/insurance-type.service";
import { RolePermissionService } from "./role-permissions/role-permission.service";
import { LocationMasterComponent } from "./location-master/location-master.component";
import { LocationModalComponent } from "./location-master/location-master-modal/location-master-modal.component";
import { LocationService } from "./location-master/location-master.service";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { RoundingRulesComponent } from "./rounding-rules/rounding-rules.component";
import { RoundingRulesModalComponent } from "./rounding-rules/rounding-rules-modal/rounding-rules-modal.component";
import { RoundingRulesService } from "./rounding-rules/rounding-rules.service";
import { UserRolesComponent } from "./user-roles/user-roles.component";
import { UserRoleModalComponent } from "./user-roles/user-role-modal/user-role-modal.component";
import { UserRoleService } from "./user-roles/user-role.service";
import { TagsComponent } from "./tags/tags.component";
import { TagModalComponent } from "./tags/tag-modal/tag-modal.component";
import { TagsService } from "./tags/tags.service";
import { AgencyDetailComponent } from "./agency-detail/agency-detail.component";
import { AgencyDetailService } from "./agency-detail/agency-detail.service";
import { QuestionComponent } from "./question/question.component";
import { ServiceComponent } from "./service/service.component";
import { SpecialityComponent } from "./speciality/speciality.component";
import {SpecialityModalComponent} from "./speciality/speciality-modal/speciality-modal.component"
import { ServiceModalComponent } from "./service/service-modal/service-modal.component";
import { MasterService } from "src/app/platform/modules/agency-portal/masters/service/service.service";
import { AddKeywordComponent } from "../keyword/add-keyword/add-keyword.component";
import { AddCareCategoryComponent } from "../keyword/add-carecategory/add-carecategory.component";
import { CareCategoryComponent } from "../keyword/carecategory/carecategory.component";
import { KeywordComponent } from "../keyword/keywords/keyword.component";
import { CommonService } from "../../core/services/common.service";
import { InsuranceCompanyDetailsComponent } from './insurance-company-details/insurance-company-details.component';
import { CompanyInsuranceModelComponent } from './company-insurance-model/company-insurance-model.component';
import { SpecialityService } from "./speciality/speciality.service";
import { CatogeryMasterComponent } from './catogery-master/catogery-master.component';
import { CategoryMasterServiceService } from "./catogery-master/category-master-service.service";
import { CreateCategoryMasterDataComponent } from './create-category-master-data/create-category-master-data.component';
import { CompanyInsuranceService } from "./company-insurance-model/company-insurance.service";
import { TestMasterComponent } from './test-master/test-master.component';
import { CreateTestMasterdataComponent } from './create-test-masterdata/create-test-masterdata.component';
import { TestmasterserviceService } from "./create-test-masterdata/testmasterservice.service";
import { ImmunizationDetailsComponent } from './immunization-details/immunization-details.component';
import { CreateImmunizationDetailsComponent } from './create-immunization-details/create-immunization-details.component';
import { ImmunizationserviceService } from "./immunizationservice.service";
import { PrescriptionDrugDetailsComponent } from './prescription-drug-details/prescription-drug-details.component';
import { CreateDrugPresciptionComponent } from './create-drug-presciption/create-drug-presciption.component';
import { DrugPrescriptionServiceService } from "./create-drug-presciption/drug-prescription-service.service";
import { MasterAllergiesDetailsComponent } from './master-allergies-details/master-allergies-details.component';
import { CreateMasterAllergiesComponent } from './create-master-allergies/create-master-allergies.component';
import { MasterAllergiesServiceService } from "./master-allergies-details/master-allergies-service.service";
import { MasterSecurityquestionsComponent } from './master-securityquestions/master-securityquestions.component';
import { CreateMastersecurityquestionComponent } from './create-mastersecurityquestion/create-mastersecurityquestion.component';
import { SecurityquestionmasterService } from "./master-securityquestions/securityquestionmaster.service";
import {HttpTokenInterceptor} from "../../core/interceptors/http.token.interceptor"
import { HTTP_INTERCEPTORS } from "@angular/common/http";

@NgModule({
  imports: [
    CommonModule,
    MastersRoutingModule,
    ColorPickerModule,
    FormsModule,
    ReactiveFormsModule,
    PlatformMaterialModule,
    
    NgxMaterialTimepickerModule,
    //[NgxMaterialTimepickerModule.forRoot()],
    SharedModule
  ],
  providers: [
    AppointmentTypeService,
    ServiceCodeService,
    ICDCodeService,
    SecurityQuestionService,
    CustomFieldsService,
    InsuranceTypeService,
    RolePermissionService,
    LocationService,
    RoundingRulesService,
    UserRoleService,
    TagsService,
    CommonService,
    AgencyDetailService,
    MasterService,
    CategoryMasterServiceService,
    CompanyInsuranceService,
    TestmasterserviceService,
    ImmunizationserviceService,
    DrugPrescriptionServiceService,
    MasterAllergiesServiceService,
    SecurityquestionmasterService,
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        disableClose: true,
        minWidth: "55%",
        maxWidth: "90%"
      }
    },
    SpecialityService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
  ],
  declarations: [
    AppointmentTypeComponent,
    ServiceCodesComponent,
    AppointmentTypeModalComponent,
    ServiceCodeModalComponent,
    IcdCodesComponent,
    IcdCodeModalComponent,
    SecurityQuestionComponent,
    SecurityQestionModalComponent,
    CustomFieldsComponent,
    CustomFieldModalComponent,
    InsuranceTypeComponent,
    InsuranceTypeModalComponent,
    RolePermissionsComponent,
    LocationMasterComponent,
    LocationModalComponent,
    RoundingRulesComponent,
    RoundingRulesModalComponent,
    UserRolesComponent,
    UserRoleModalComponent,
    TagsComponent,
    TagModalComponent,
    AgencyDetailComponent,
    QuestionComponent,
    ServiceComponent,
    ServiceModalComponent,
    SpecialityComponent,
    SpecialityModalComponent,
    AddKeywordComponent,
    CareCategoryComponent,
    AddCareCategoryComponent,
    KeywordComponent,
    InsuranceCompanyDetailsComponent,
    CompanyInsuranceModelComponent,
    CatogeryMasterComponent,
    CreateCategoryMasterDataComponent,
    TestMasterComponent,
    CreateTestMasterdataComponent,
    ImmunizationDetailsComponent,
    CreateImmunizationDetailsComponent,
    PrescriptionDrugDetailsComponent,
    CreateDrugPresciptionComponent,
    MasterAllergiesDetailsComponent,
    CreateMasterAllergiesComponent,
    MasterSecurityquestionsComponent,
    CreateMastersecurityquestionComponent
  ],
  // entryComponents: [
  //   AppointmentTypeModalComponent,
  //   ServiceCodeModalComponent,
  //   IcdCodeModalComponent,
  //   SecurityQestionModalComponent,
  //   CustomFieldModalComponent,
  //   InsuranceTypeModalComponent,
  //   LocationModalComponent,
  //   RoundingRulesModalComponent,
  //   UserRoleModalComponent,
  //   TagModalComponent,
  //   ServiceModalComponent,
  //   SpecialityModalComponent,
  //   CompanyInsuranceModelComponent,
  //   CreateCategoryMasterDataComponent,
  //   CreateTestMasterdataComponent,
  //   ImmunizationDetailsComponent,
  //   CreateImmunizationDetailsComponent,
  //   PrescriptionDrugDetailsComponent,
  //   CreateDrugPresciptionComponent,
  //   MasterAllergiesDetailsComponent,
  //   CreateMasterAllergiesComponent,
  //   MasterSecurityquestionsComponent,
  //   CreateMastersecurityquestionComponent

  //   // AddKeywordComponent
  // ],
  exports:[
    ServiceComponent,
    ServiceModalComponent,
    SpecialityComponent,
    SpecialityModalComponent,
    InsuranceCompanyDetailsComponent,
    CatogeryMasterComponent,
    TestMasterComponent,
    IcdCodesComponent,
    IcdCodeModalComponent,
    ImmunizationDetailsComponent,
    PrescriptionDrugDetailsComponent,
    CreateDrugPresciptionComponent,
    CreateMasterAllergiesComponent,
    MasterAllergiesDetailsComponent,
    TagsComponent,
    TagModalComponent,
    CustomFieldsComponent,
    CustomFieldModalComponent,
    InsuranceTypeComponent,
    AgencyDetailComponent,
    InsuranceTypeModalComponent,
    MasterSecurityquestionsComponent,
    CreateMastersecurityquestionComponent

  ]
})
export class MastersModule {}
