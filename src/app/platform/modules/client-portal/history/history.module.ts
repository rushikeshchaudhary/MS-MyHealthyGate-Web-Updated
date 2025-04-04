import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { FamilyHistoryComponent } from "./family-history/family-history.component";
import { HistoryRoutingModule } from "./history-routing.module";
import { SocialHistoryComponent } from "./social-history/social-history.component";
import { PlatformMaterialModule } from "src/app/platform/platform.material.module";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { MedicalHistoryComponent } from "./medical-history/medical-history.component";
import { AddEditMedicalHistoryComponent } from './medical-history/add-edit-medical-history/add-edit-medical-history.component';
//import { HistoryContainerComponent } from './history-container/history-container.component';

@NgModule({
  imports: [
    CommonModule,
    HistoryRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    PlatformMaterialModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [
    FamilyHistoryComponent,
    SocialHistoryComponent,
    MedicalHistoryComponent,
    AddEditMedicalHistoryComponent,
  ],
  // entryComponents: [
  //   FamilyHistoryComponent,
  //   SocialHistoryComponent,
  //   MedicalHistoryComponent,
  //   AddEditMedicalHistoryComponent
  // ],
  exports: [
    FamilyHistoryComponent,
    SocialHistoryComponent,
    MedicalHistoryComponent,
    AddEditMedicalHistoryComponent
  ],
})
export class HistoryModule {}
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
