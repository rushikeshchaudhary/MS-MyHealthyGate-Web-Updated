import {
  Component,
  OnInit,
  ComponentFactoryResolver,
  ViewContainerRef,
  ViewChild,
  ComponentRef,
  Input,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AddPrescriptionComponent } from "./prescription-addprescription/prescription-addprescription.component";
import { SentPrescriptionComponent } from "./prescription-sentprescription/prescription-sentprescription.component";
import { CommonService } from "../../../core/services";

@Component({
  selector: "app-prescription",
  templateUrl: "./prescription.component.html",
  styleUrls: ["./prescription.component.css"],
})
export class PrescriptionComponent implements OnInit {
  @Input() encryptedPatientId:any;
  @Input() appointmentId: number = 0;
  // @ViewChild("tabContent", { read: ViewContainerRef })
  // tabContent!: ViewContainerRef;
  @ViewChild('tabContent', { read: ViewContainerRef, static: true }) tabContent!: ViewContainerRef;

  timesheetTabs: any;
  masterStaffs: Array<any> = [];
  loadingMasterData: boolean = false;
  staffId!: number;
  selectedIndex: number = 0;
  clientId!: number;
  header: string = "Client Prescription";
  constructor(
    private activatedRoute: ActivatedRoute,
    private cfr: ComponentFactoryResolver,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    debugger
    if (this.encryptedPatientId == undefined) {
      const apptId = this.activatedRoute.snapshot.paramMap.get("id");
      this.activatedRoute.queryParams.subscribe((params) => {
        this.clientId =
          params["id"] == undefined
            ? this.commonService.encryptValue(apptId, false)
            : this.commonService.encryptValue(params["id"], false); //
      });
    } else {
      this.clientId = this.commonService.encryptValue(
        this.encryptedPatientId,
        false
      );
    }

    this.timesheetTabs = ["Add Prescription", "Sent Prescriptions"];
    this.loadChild("Add Prescription");
    //  this.timesheetTabs = [ "Sent Prescriptions"];
    //  this.loadChild("Sent Prescriptions");
  }
  // , "Sent Prescriptions"
  loadComponent(eventType: any): any {
    if (this.clientId) this.loadChild(eventType.tab.textLabel);
  }
  loadChild(childName: string) {
    let factory: any;
    if (childName == "Add Prescription") {
      factory = this.cfr.resolveComponentFactory(AddPrescriptionComponent);
    } else if (childName == "Sent Prescriptions") {
      factory = this.cfr.resolveComponentFactory(SentPrescriptionComponent);
    }
    this.tabContent.clear();

    if (childName == "Add Prescription") {
      let comp: ComponentRef<AddPrescriptionComponent> =
        this.tabContent.createComponent(factory);
      comp.instance.showbuttons = true;
      debugger
      comp.instance.encryptedPatientId = this.encryptedPatientId;
      comp.instance.appointmentId = this.appointmentId;
    } else if (childName == "Sent Prescriptions") {
      let comp: ComponentRef<SentPrescriptionComponent> =
        this.tabContent.createComponent(factory);
        debugger
      comp.instance.encryptedPatientId = this.encryptedPatientId;
    }
  }
}
