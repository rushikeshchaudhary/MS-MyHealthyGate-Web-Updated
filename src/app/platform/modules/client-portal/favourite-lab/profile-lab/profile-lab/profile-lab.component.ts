import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LabService } from 'src/app/platform/modules/lab/lab.service';
import { ResponseModel } from 'src/app/super-admin-portal/core/modals/common-model';

@Component({
  selector: 'app-profile-lab',
  templateUrl: './profile-lab.component.html',
  styleUrls: ['./profile-lab.component.css']
})
export class ProfileLabComponent implements OnInit {
  labInfo: Array<any> = [];
  labAddressesModel: Array<any> = [];
  labId!: number;

  constructor(
    private activateRoute: ActivatedRoute,
    private labService: LabService
  ) { }

  ngOnInit() {
    this.labId = parseInt(this.activateRoute.snapshot.paramMap.get("id")!);
    this.getLabData();
  }

  getLabData = () => {
  this.labService.GetLabById(this.labId).subscribe((response) => {
    console.log(response.data);
    this.labInfo = response.data.labInfo;
    this.labAddressesModel = response.data.labAddressesModel;
  });
}
}

