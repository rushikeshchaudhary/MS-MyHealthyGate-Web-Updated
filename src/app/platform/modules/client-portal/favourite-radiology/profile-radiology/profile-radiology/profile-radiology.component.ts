import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { format } from "date-fns";
import { LabService } from 'src/app/platform/modules/lab/lab.service';
import { ResponseModel } from 'src/app/super-admin-portal/core/modals/common-model';

@Component({
  selector: 'app-profile-radiology',
  templateUrl: './profile-radiology.component.html',
  styleUrls: ['./profile-radiology.component.css']
})
export class ProfileRadiologyComponent implements OnInit {
  RadiologyInfo: any;
  radiologyId:any;

  constructor(
    private activateRoute: ActivatedRoute,
    private radiologyService: LabService
  ) {}

  ngOnInit() {
    this.radiologyId = parseInt(this.activateRoute.snapshot.paramMap.get("id")!);
    this.getRadiologyData();
  }

  getRadiologyData = () => {
    this.radiologyService.GetRadiologyById(this.radiologyId)
    .subscribe((response: ResponseModel) => {
      console.log(response)
      if (response != null && response.data != null) {
        this.RadiologyInfo = response.data;
      }
    });
}
}

