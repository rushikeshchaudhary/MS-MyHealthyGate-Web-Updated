import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { format } from 'date-fns';
import { PharmacyService } from 'src/app/platform/modules/pharmacy-portal/pharmacy.service';

@Component({
  selector: 'app-sup-pharmacy-profile',
  templateUrl: './sup-pharmacy-profile.component.html',
  styleUrls: ['./sup-pharmacy-profile.component.css']
})
export class SupPharmacyProfileComponent implements OnInit {

  loginData: any;
  PharmacyInfo: Array<any> = [];
  PharmacyAddress: Array<any> = [];
  pharmacyId:any;

  constructor(
    private activateRoute: ActivatedRoute,
    private pharmacyService: PharmacyService
  ) { }

  ngOnInit() {
    this.pharmacyId = Number(this.activateRoute.snapshot.paramMap.get("id"));
    this.getPharmacyData();
  }
  getPharmacyData = () => {
    this.pharmacyService.GetPharmacyById(this.pharmacyId).subscribe((res) => {
      console.log(res.data);
      this.PharmacyInfo = res.data.pharmacyInfo;
      this.PharmacyInfo = this.PharmacyInfo.map((x) => {
        x.dob = format(x.dob, 'MM/dd/yyyy');
        return x;
      });
      this.PharmacyInfo = this.PharmacyInfo.map((x) => {
        x.registerDate = format(x.registerDate, 'MM/dd/yyyy');
        return x;
      });

      this.PharmacyAddress = res.data.pharmacyAddressInfo;
    });
  };

}
