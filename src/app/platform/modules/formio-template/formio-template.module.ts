import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormRendererComponent } from './form-renderer/form-renderer.component';
import { FormBuilderComponent } from './form-builder/form-builder.component';
import { FormContainerComponent } from './form-container/form-container.component';
// import { FormioModule } from ''@formio/angular'';
import { FormioModule } from '@formio/angular';
import { TemplateService } from './template.service';
import { TemplateRoutingModule } from './template-routing.module';
import { TemplateListingComponent } from './template-listing/template-listing.component';
import { SharedModule } from '../../../shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormioModule,
    TemplateRoutingModule,
    SharedModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  declarations: [
    FormRendererComponent,
    // FormBuilderComponent,
    FormContainerComponent,
    // TemplateListingComponent
  ],
  providers: [
    TemplateService
  ]
})
export class FormioTemplateModule { }
