import { ServiceComponent } from "./service/service.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppointmentTypeComponent } from "./appointment-type/appointment-type.component";
import { ServiceCodesComponent } from "./service-codes/service-codes.component";
import { IcdCodesComponent } from "./icd-codes/icd-codes.component";
import { RolePermissionsComponent } from "./role-permissions/role-permissions.component";
import { SecurityQuestionComponent } from "./security-question/security-question.component";
import { CustomFieldsComponent } from "./custom-fields/custom-fields.component";
import { InsuranceTypeComponent } from "./insurance-type/insurance-type.component";
import { LocationMasterComponent } from "./location-master/location-master.component";
import { RoundingRulesComponent } from "./rounding-rules/rounding-rules.component";
import { SpecialityComponent } from "./speciality/speciality.component";
import { UserRolesComponent } from "./user-roles/user-roles.component";
import { TagsComponent } from "./tags/tags.component";
import { AgencyDetailComponent } from "./agency-detail/agency-detail.component";
import { AgencyPermissionGuard } from "../agency_routing_permission.guard";
import { QuestionComponent } from "./question/question.component";
import { AddKeywordComponent } from "../keyword/add-keyword/add-keyword.component";
import { CareCategoryComponent } from "../keyword/carecategory/carecategory.component";
import { AddCareCategoryComponent } from "../keyword/add-carecategory/add-carecategory.component";
import { KeywordComponent } from "../keyword/keywords/keyword.component";
import { InsuranceCompanyDetailsComponent } from "./insurance-company-details/insurance-company-details.component";
import { CatogeryMasterComponent } from "./catogery-master/catogery-master.component";
import { TestMasterComponent } from "./test-master/test-master.component";
import { IcdCodeModalComponent } from "./icd-codes/icd-code-modal/icd-code-modal.component";
import { ImmunizationDetailsComponent } from "./immunization-details/immunization-details.component";
import { PrescriptionDrugDetailsComponent } from "./prescription-drug-details/prescription-drug-details.component";
import { MasterAllergiesDetailsComponent } from "./master-allergies-details/master-allergies-details.component";
import { MasterSecurityquestionsComponent } from "./master-securityquestions/master-securityquestions.component";

const routes: Routes = [
  {
    path: "appointment-type",
    canActivate: [AgencyPermissionGuard],
    component: AppointmentTypeComponent
  },
  {
    path: "service-code",
    canActivate: [AgencyPermissionGuard],
    component: ServiceCodesComponent
  },
  {
    path: "diagnosis-code",
    canActivate: [AgencyPermissionGuard],
    component: IcdCodesComponent
  },
  {
    path: "user-role",
    canActivate: [AgencyPermissionGuard],
    component: UserRolesComponent
  },
  {
    path: "tag",
    canActivate: [AgencyPermissionGuard],
    component: TagsComponent
  },
  {
    path: "security-question",
    canActivate: [AgencyPermissionGuard],
    component: SecurityQuestionComponent
  },
  {
    path: "custom-fields",
  canActivate: [AgencyPermissionGuard],
    component: CustomFieldsComponent
  },
  {
    path: "insurance-type",
    canActivate: [AgencyPermissionGuard],
    component: InsuranceTypeComponent
  },
  {
    path: "role-permissions",
    canActivate: [AgencyPermissionGuard],
    component: RolePermissionsComponent
  },
  {
    path: "location-master",
    canActivate: [AgencyPermissionGuard],
    component: LocationMasterComponent
  },
  {
    path: "rounding-rule",
    canActivate: [AgencyPermissionGuard],
    component: RoundingRulesComponent
  },
  {
    path: "agency-details",
    canActivate: [AgencyPermissionGuard],
    component: AgencyDetailComponent
  },
  {
    path: "question",
    canActivate: [AgencyPermissionGuard],
    component: QuestionComponent
  },
  {
    path: "master-services",
    canActivate: [AgencyPermissionGuard],
    component: ServiceComponent
  },
  {
    path: "template",
    loadChildren:
      () => import('../../formio-template/formio-template.module').then(m => m.FormioTemplateModule)
  },
  {
    path: "speciality",
    canActivate: [AgencyPermissionGuard],
    component: SpecialityComponent
  },
  {
    path: 'addkeyword',
   // canActivate: [AgencyPermissionGuard],
    component: AddKeywordComponent,
  },
  {
    path: 'add-keyword',
  //  canActivate: [AgencyPermissionGuard],
    component: KeywordComponent,
  },
  {
    path: 'Insurance-CompanyDetails',
    //canActivate: [AgencyPermissionGuard],
    component: InsuranceCompanyDetailsComponent,
  },
  {
    path: 'Catogery-Master',
    //canActivate: [AgencyPermissionGuard],
    component: CatogeryMasterComponent,
  },
  {
    path: 'Test-Master',
    //canActivate: [AgencyPermissionGuard],
    component: TestMasterComponent,
  },
  {
    path: 'carecategorylisting',
    component: CareCategoryComponent,
  },
  {
    path: 'addcarecategory',
    component: AddCareCategoryComponent,
  },
  {
    path: 'Icd-masterdata',
    component: IcdCodesComponent,
  },
  {
    path: 'Immunization-details',
    component: ImmunizationDetailsComponent,
  },
  {
    path: 'PrescriptionDrugDetailsComponent-details',
    component: PrescriptionDrugDetailsComponent,
  },
  {
    path: 'MasterAllergiesDetailsComponent-details',
    component: MasterAllergiesDetailsComponent,
  },
  {
    path: 'MasterSecurityquestionsComponent-details',
    component: MasterSecurityquestionsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersRoutingModule {}




