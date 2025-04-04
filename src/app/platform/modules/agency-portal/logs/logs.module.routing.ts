import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { AuditLogComponent } from "./audit-log/audit-log.component";
import { LoginLogComponent } from "./login-log/login-log.component";
import { AgencyPermissionGuard } from "../agency_routing_permission.guard";

const routes: Routes = [
  {
    path: 'audit-log',
    canActivate: [AgencyPermissionGuard],
    component: AuditLogComponent,
  },
  {
    path: 'login-log',
    canActivate: [AgencyPermissionGuard],
    component: LoginLogComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogsRoutingModule { }
