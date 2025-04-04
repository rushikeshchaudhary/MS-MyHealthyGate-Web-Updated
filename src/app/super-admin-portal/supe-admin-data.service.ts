import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class SupeAdminDataService {
  userType: string="Users";
  value:string="";

  constructor() {}

  saveUserType = (type: string) => {
    this.userType = type;
    this.value=type;
  };
  getUserType = () => {
    return this.userType,this.value;
  };
}
