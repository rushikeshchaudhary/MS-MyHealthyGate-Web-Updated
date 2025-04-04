import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { format } from "date-fns";
import { Metadata } from "../../../core/modals/common-model";
import { CommonService } from "../../../core/services";
import { EncounterService } from "../../encounter/encounter.service";

@Component({
  selector: "app-icd",
  templateUrl: "./icd.component.html",
  styleUrls: ["./icd.component.css"],
})
export class IcdComponent implements OnInit {
  patientDiagnosisList: any = [];
  metaData: Metadata = new Metadata;
  patientID: any;

  patientDiagnosisColumns = [
    {
      displayName: "icd_code",
      key: "code",
    },
    {
      displayName: "diagnose_with",
      key: "diagnosis",
    },
    {
      displayName: "diagnose_date",
      key: "diagnosisDate",
      type:'date'
    },
    {
      displayName: "doctor_remark",
      key: "descriptions",
    },
  ];
  withoutFilterList: any = [];
  @Input() encryptedPatientId:any;

  constructor(
    private encounterService: EncounterService,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    if (this.encryptedPatientId == undefined) {
      const apptId = this.activatedRoute.snapshot.paramMap.get("id");
      this.activatedRoute.queryParams.subscribe((params) => {
        this.patientID =
          params["id"] == undefined
            ? this.commonService.encryptValue(apptId, false)
            : this.commonService.encryptValue(params["id"], false);
      });

      this.getPatientPreviousDiagnosis();
    } else {
      this.patientID = this.commonService.encryptValue(
        this.encryptedPatientId,
        false
      );
      this.getPatientPreviousDiagnosis();
    }

    // this.activatedRoute.queryParams.subscribe((params) => {
    //   this.patientID =
    //     params.id == undefined
    //       ? null
    //       : this.commonService.encryptValue(params.id, false);

    //   this.getPatientPreviousDiagnosis(); //
    // });
  }

  getPatientPreviousDiagnosis = () => {
    this.encounterService
      .getPatientDiagnosis(this.patientID)
      .subscribe((res) => {
        res.data.map((item:any) => {
          item.diagnosisDate = format(item.diagnosisDate, "MM-dd-yyyy");
        });
        this.patientDiagnosisList = res.data;
        this.withoutFilterList = JSON.parse(JSON.stringify(res.data));
      });
  };
  sortHandler = (type: string) => {
    if (type === "atoz") {
      this.patientDiagnosisList = this.patientDiagnosisList.sort((a: { diagnosis: string; }, b: { diagnosis: any; }) => a.diagnosis.localeCompare(b.diagnosis));
      console.log('after sorting', this.patientDiagnosisList);
      this.patientDiagnosisList = [...this.patientDiagnosisList];
    } else if (type === "ztoa") {
      this.patientDiagnosisList = this.patientDiagnosisList.sort((a: { diagnosis: any; }, b: { diagnosis: string; }) => b.diagnosis.localeCompare(a.diagnosis));
      this.patientDiagnosisList = [...this.patientDiagnosisList];
    } else if (type === "oldest") {
      this.patientDiagnosisList = this.patientDiagnosisList.sort((a: { diagnosisDate: string | number | Date; }, b: { diagnosisDate: string | number | Date; }) => new Date(a.diagnosisDate).getTime() - new Date(b.diagnosisDate).getTime());
      this.patientDiagnosisList = [...this.patientDiagnosisList];
    } else if (type === "latest") {
      this.patientDiagnosisList = this.patientDiagnosisList.sort((a: { diagnosisDate: string | number | Date; }, b: { diagnosisDate: string | number | Date; }) => new Date(b.diagnosisDate).getTime() - new Date(a.diagnosisDate).getTime());
      this.patientDiagnosisList = [...this.patientDiagnosisList];
    } else {
      this.patientDiagnosisList = this.withoutFilterList;
    }
  };

}
