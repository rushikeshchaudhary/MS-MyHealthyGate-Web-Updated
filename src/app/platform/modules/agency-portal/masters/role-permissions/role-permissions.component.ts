import { Component, OnInit } from '@angular/core';
import { RolePermissionService } from './role-permission.service';
import { FilterModel, ResponseModel } from '../../../core/modals/common-model';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { TranslateService } from "@ngx-translate/core";
import { UserRoleService } from '../user-roles/user-role.service';
@Component({
  selector: 'app-role-permissions',
  templateUrl: './role-permissions.component.html',
  styleUrls: ['./role-permissions.component.css']
})
export class RolePermissionsComponent implements OnInit {
  masterRoles: any;
  modulePermissions: any;
  screenPermissions: any;
  actionPermissions: any;
  rolePermissionForm!: FormGroup;
  items!: FormArray;
  submitted:boolean=false;
  constructor(private rolePermissionService: RolePermissionService, private formBuilder: FormBuilder,private notifier: NotifierService, private translate:TranslateService,private userRoleService:UserRoleService
    ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.masterRoles = [];
    this.modulePermissions = [];
    this.screenPermissions = [];
    this.actionPermissions = []
  }

  ngOnInit() {
    this.rolePermissionForm = this.formBuilder.group({
      roleId: []
    });
    this.getMasterRoles();
    this.getRolePermissions();
  }

  get formControls() { return this.rolePermissionForm.controls }

  onSubmit() {
    if(!this.rolePermissionForm.invalid)
    {
      this.submitted=true;
      let roleId = this.rolePermissionForm.value.roleId;
      //Remove this loop and add roleId on server side.All the loops will be removed from here.
      this.modulePermissions.forEach((element: { roleId: any; }) => {
        element.roleId=roleId;
      });
      this.screenPermissions.forEach((element: { roleId: any; }) => {
        element.roleId=roleId;
      });
      this.actionPermissions.forEach((element: { roleId: any; }) => {
        element.roleId=roleId;
      });      
      let requestData={
        'modulePermissions' : this.modulePermissions,
        'screenPermissions' : this.screenPermissions,
        'actionPermissions' : this.actionPermissions,
      };
      this.rolePermissionService.create(JSON.stringify(requestData)).subscribe((response:ResponseModel)=>{
        this.submitted=false;
        if (response.statusCode == 200) {          
          this.notifier.notify('success', response.message)          
          this.getRolePermissions(roleId);
        } else {
          this.notifier.notify('error', response.message)
        }
      });
    }
  }

  getMasterRoles() {
    debugger
    let filterModel = new FilterModel();
    filterModel.pageSize = 1000;
    filterModel.pageNumber = 1;
    this.userRoleService.getAll(filterModel).subscribe((response) => {
      debugger
        if (response.data != null && response.statusCode==200) {
         
          this.masterRoles = response.data.map((r: { id: { toString: () => any; }; roleName: any; }) => ({
            id: r.id,
            value: r.roleName,
            key: r.id.toString()
          }));
        
          
        } else {
          this.masterRoles = [];

        }
      },
      (error) => {
        console.error('Error fetching roles:', error);
        this.masterRoles = [];
      
      });
    
  }
  getRolePermissions(roleId: number = 0) {
    this.rolePermissionService.getRolePermissions(roleId).subscribe((response: ResponseModel) => {
      this.modulePermissions = response.data.modulePermissions;
      this.screenPermissions = response.data.screenPermissions;
      this.actionPermissions = response.data.actionPermissions;
    });
  }
  setPermission(id: number, type: string) {
    let permission=false;
    if(type=='module')
    { 
       permission=this.modulePermissions.find((x: { moduleId: number; }) => x.moduleId == id).permission;
       this.modulePermissions.find((x: { moduleId: number; }) => x.moduleId == id).permission=permission==false?true:false;

       this.screenPermissions.filter((x: { moduleId: number; })=>x.moduleId==id).forEach((element: { permission: boolean; }) => {
         element.permission=permission==false?true:false;
       });

       this.actionPermissions.filter((x: { moduleId: number; })=>x.moduleId==id).forEach((element: { permission: boolean; }) => {
        element.permission=permission==false?true:false;
      });      
    }
    else if(type=='screen')
    {
      permission= this.screenPermissions.find((x: { screenId: number; }) => x.screenId == id).permission
      this.screenPermissions.find((x: { screenId: number; }) => x.screenId == id).permission=permission==false?true:false;
      
      this.actionPermissions.filter((x: { screenId: number; })=>x.screenId==id).forEach((element: { permission: boolean; }) => {
        element.permission=permission==false?true:false;
      });   
    }
    else if(type=='action')
    {
      permission=this.actionPermissions.find((x: { actionId: number; }) => x.actionId == id).permission
      this.actionPermissions.find((x: { actionId: number; }) => x.actionId == id).permission=permission==false?true:false;
    }
  }
  filterItems(id :number,type:string){
    if(type=='screen')
      return this.screenPermissions.filter((x: { moduleId: number; }) => x.moduleId == id);
    else if(type=='action')
      return this.actionPermissions.filter((x: { screenId: number; }) => x.screenId == id);
}
changeClass(moduleId:number,screenId:number,type:string)
{
  if(type=='module')
  {

    Array.from(document.getElementsByClassName("moduleClass"+moduleId)).forEach(function(item:any) {
      if(item.classList.contains('fa-plus-square')) {
        item.classList.remove('fa-plus-square');
        item.classList.add('fa-minus-square');
      }
      else
      {
        item.classList.add('fa-plus-square');
        item.classList.remove('fa-minus-square');
      }
    });

  Array.from(document.getElementsByClassName("screenClass"+moduleId)).forEach(function(item:any) {
      if(item.classList.contains('screen-show')) {
        item.classList.remove('screen-show');
        item.classList.add('screen-hide');
      } 
      else {
        item.classList.remove('screen-hide');
        item.classList.add('screen-show');
      }
 });
}
else if(type=='screen')
{
  Array.from(document.getElementsByClassName("screenButton"+screenId)).forEach(function(item:any) {
    if(item.classList.contains('fa-plus-square')) {
      item.classList.remove('fa-plus-square');
      item.classList.add('fa-minus-square');
    }
    else
    {
      item.classList.add('fa-plus-square');
      item.classList.remove('fa-minus-square');
    }
  });
  Array.from(document.getElementsByClassName("actionClass"+screenId)).forEach(function(item:any) {
    if(item.classList.contains('screen-show')) {
      item.classList.remove('screen-show')
      item.classList.add('screen-hide')
    } 
    else {
      item.classList.remove('screen-hide')
      item.classList.add('screen-show')
    }
});
}
}
}
