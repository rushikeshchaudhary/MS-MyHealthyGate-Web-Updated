import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClientComponent } from "./client/client.component";
import { ClientsRoutingModule } from "./clients.module.routing";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpLoaderFactory, SharedModule } from "../../../../shared/shared.module";
import { PlatformMaterialModule } from "../../../platform.material.module";
import { DemographicInfoComponent } from "./demographic-info/demographic-info.component";
import { AddressComponent } from "./address/address.component";
import { ClientsService } from "./clients.service";
import { MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material/dialog";
import { ChartsModule } from 'ng2-charts';
import { ClientPermissionComponent } from './client-permission/client-permission.component';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";

@NgModule({
  imports: [
    CommonModule,
    ClientsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PlatformMaterialModule,
    ChartsModule
  ],
  providers: [
    ClientsService,
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        disableClose: true,
        minWidth: "55%",
        maxWidth: "90%"
      }
    }
  ],
  // entryComponents: [
  //   DemographicInfoComponent,
  //   AddressComponent,
  //   ClientPermissionComponent,
  // ],
  declarations: [
    ClientComponent,
    DemographicInfoComponent,
    AddressComponent,
    ClientPermissionComponent,
   
  ]
  //exports: [DiagnosisModalComponent]
})
export class ClientsModule {}
