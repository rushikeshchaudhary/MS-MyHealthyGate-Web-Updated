import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedPrescriptionComponent } from "./shared-prescription/shared-prescription.component";
import { PharmacyPortalRoutingModule } from "./pharmacy-portal-routing.module";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { PlatformMaterialModule } from "../../platform.material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FormioModule } from '@formio/angular';
import { PharmacyDashboardComponent } from "./pharmacy-dashboard/pharmacy-dashboard.component";
import { PharmacyAppointmentGraphComponent } from "./pharmacy-appointment-graph/pharmacy-appointment-graph.component";
import { SharedModule } from "src/app/shared/shared.module";
import { ScrollbarModule } from 'ngx-scrollbar';
import { PharmacyProfileComponent } from "./pharmacy-profile/pharmacy-profile.component";
import { EditPharmacyProfileComponent } from "./pharmacy-profile/edit-pharmacy-profile/edit-pharmacy-profile.component";
import { PharmacyAddressComponent } from "./pharmacy-profile/edit-pharmacy-profile/pharmacy-address/pharmacy-address.component";
import { PharmacyAvaibilityComponent } from "./pharmacy-profile/edit-pharmacy-profile/pharmacy-avaibility/pharmacy-avaibility.component";
import { PharmacyInformationComponent } from "./pharmacy-profile/edit-pharmacy-profile/pharmacy-information/pharmacy-information.component";
import { PharmacyMyClientComponent } from './pharmacy-my-client/pharmacy-my-client.component';
import { PharmacyClientDetailsComponent } from './pharmacy-my-client/pharmacy-client-details/pharmacy-client-details.component';
import { AddEditPharmacyAddressComponent } from './pharmacy-profile/edit-pharmacy-profile/pharmacy-address/add-edit-pharmacy-address/add-edit-pharmacy-address.component';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient } from "@angular/common/http";
import { PharmacyQualificationnComponent } from './pharmacy-profile/edit-pharmacy-profile/pharmacy-qualificationn/pharmacy-qualificationn.component';
import { AddEditQualificationComponent } from './pharmacy-profile/edit-pharmacy-profile/pharmacy-qualificationn/add-edit-qualification/add-edit-qualification.component';
import { PharmacyExperieceComponent } from './pharmacy-profile/edit-pharmacy-profile/pharmacy-experiece/pharmacy-experiece.component';
import { PharmacyAwardComponent } from './pharmacy-profile/edit-pharmacy-profile/pharmacy-award/pharmacy-award.component';
import { AddEditAwardComponent } from './pharmacy-profile/edit-pharmacy-profile/pharmacy-award/add-edit-award/add-edit-award.component';
import { AddEditExperienceComponent } from './pharmacy-profile/edit-pharmacy-profile/pharmacy-experiece/add-edit-experience/add-edit-experience.component';
import { ClientsModule } from "../agency-portal/clients/clients.module";
import { LabModule } from "../lab/lab.module";
import { PharmacyPrescriptionComponent } from './pharmacy-prescription/pharmacy-prescription.component';


@NgModule({
  imports: [
    CommonModule,
    PharmacyPortalRoutingModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatInputModule,
    PlatformMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FormioModule,
    MatTabsModule,
    MatTableModule,
    SharedModule,
    ScrollbarModule,
    ClientsModule,
    LabModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  })
  ],
  declarations: [
    SharedPrescriptionComponent,
    PharmacyDashboardComponent,
    PharmacyAppointmentGraphComponent,
    PharmacyProfileComponent,
    EditPharmacyProfileComponent,
    PharmacyAddressComponent,
    PharmacyAvaibilityComponent,
    PharmacyInformationComponent,
    PharmacyMyClientComponent,
    PharmacyClientDetailsComponent,
    AddEditPharmacyAddressComponent,
    PharmacyQualificationnComponent,
    AddEditQualificationComponent,
    PharmacyExperieceComponent,
    PharmacyAwardComponent,
    AddEditAwardComponent,
    AddEditExperienceComponent,
    PharmacyPrescriptionComponent,
  ],
  // entryComponents: [
  //   PharmacyAddressComponent,
  //   PharmacyAvaibilityComponent,
  //   PharmacyInformationComponent,
  //   PharmacyClientDetailsComponent,
  //   AddEditPharmacyAddressComponent,
  //   PharmacyQualificationnComponent,
  //   AddEditQualificationComponent, 
  //   PharmacyExperieceComponent,
  //   PharmacyAwardComponent,
  //   AddEditAwardComponent,
  //   AddEditExperienceComponent,
  // ],
})
export class PharmacyPortalModule {}
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
