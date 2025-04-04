import { Injectable } from '@angular/core';
import { CommonService } from '../core/services';

@Injectable({
  providedIn: 'root'
})
export class PharmacyService {
  private GetPharmacyByIdUrl = "Pharmacy/GetPharmacyById";
  private UpdatePharmacyProfileUrl = "Pharmacy/UpdatePharmacyProfile";
  private UpdatePharmacyAddressUrl = "Pharmacy/UpdatePharmacyAddress";
  private DeletePharmacyAddressUrl = "Pharmacy/DeletePharmacyAddress"


  constructor(private commonService: CommonService) { }

  GetPharmacyById(id:any) {
    return this.commonService.get(this.GetPharmacyByIdUrl + `?Id=${id}`);
  }
  UpdatePharmacyProfile(data:any) {
    return this.commonService.post(this.UpdatePharmacyProfileUrl, data);
  }
  UpdatePharmacyAddress(data:any) {
    return this.commonService.post(this.UpdatePharmacyAddressUrl, data);
  }
  deletePharmacyAddress(data:any){
    return this.commonService.post(this.DeletePharmacyAddressUrl, data);
  }





}
