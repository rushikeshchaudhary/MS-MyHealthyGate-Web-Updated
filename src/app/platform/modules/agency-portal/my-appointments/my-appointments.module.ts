import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyAppointmentsService } from './my-appointments.service';
import { SharedModule } from '../../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlatformMaterialModule } from '../../../platform.material.module';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MyAppointmentsComponent } from './my-appointment/my-appointments.component';
import { MyAppointmentsRoutingModule } from './my-appointments.routing.module';
import { ContextMenuModule } from 'ngx-contextmenu';
import { MatMenuModule } from '@angular/material/menu';
@NgModule({
  imports: [
    CommonModule,
    MatMenuModule,
    ContextMenuModule.forRoot({
      useBootstrap4: true,
    }),
    MyAppointmentsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    PlatformMaterialModule,
  ],
  // entryComponents:[MyAppointmentsComponent],
  providers:[MyAppointmentsService,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true, disableClose: true, minWidth: '55%',maxWidth: '90%' } }
  ],
  declarations: [MyAppointmentsComponent]
})
export class MyAppointmentsModule { }
