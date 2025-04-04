import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainContainerComponent } from './modules/main-container/main-container.component';
import { AgencyAuthGuard } from './auth.guard';
import { AgencyNoAuthGuard } from './noAuth.guard';
import { PageNotAllowedComponent } from './modules/page-not-allowed/page-not-allowed.component';
import { InviteCallJoinComponent } from '../shared/invite-call-join/invite-call-join.component';
const routes: Routes = [
  {
    path: '',
    canActivate: [AgencyAuthGuard],
    component: MainContainerComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./modules/agency-portal/agency-portal.module').then(m => m.AgencyPortalModule)
      },
      {
        path: 'client',
        loadChildren: () => import('./modules/client-portal/client-portal.module').then(m => m.ClientPortalModule)
      },
      {
        path:'lab',
        loadChildren:() => import('./modules/lab/lab.module').then(m => m.LabModule)
      },
      {  
        path: 'pharmacy',
        loadChildren: () => import('./modules/pharmacy-portal/pharmacy-portal.module').then(m => m.PharmacyPortalModule)
      },
      {  
        path: 'radiology',
        loadChildren: () => import('./modules/radiology-portal/radiology-portal.module').then(m => m.RadiologyPortalModule)
      },
      {
        path: 'not-allowed',
        component: PageNotAllowedComponent
      }
    ]
  },
  {
    path: 'videocall/:token',
    component: InviteCallJoinComponent
  },
  {
    path: '',
    canActivate: [AgencyNoAuthGuard],
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },
  // otherwise redirect to home
  { path: '**', redirectTo: '/web' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlatformRoutingModule { }
