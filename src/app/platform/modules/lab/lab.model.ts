import { FilterModel } from "../core/modals/common-model";

export class LabDetailModel {
  dob: string = "";
  doj: string = "";
  email: string = "";
  firstName: string = "";
  gender: string = "";
  isActive: boolean = false;
  labId!: number;
  labName: string = "";
  lastName: string = "";
  middleName:string="";
  photoPath: string = "";
  photoThumbnailPath: string = "";
  userID!: number;
  imgBase64!: string;
}

export class RadiologyDetailModel {
  dob: string = "";
  doj: string = "";
  email: string = "";
  firstName: string = "";
  gender: string = "";
  isActive: boolean = false;
  radiologyId!: number;
  radiologyName: string = "";
  lastName: string = "";
  middleName:string="";
  photoPath: string = "";
  photoThumbnailPath: string = "";
  userID!: number;
  imgBase64!: string;
}

export class LabClientFilter{
  labId!: number;
  searchText:string="";
  pageNumber:number=1;
  pageSize:number=5;
  sortColumn:string="";
  sortOrder:string="";
}

export class LabPaymentModel extends FilterModel {
  AppDate: string = "";
  PayDate: string = "";
  PatientName: string = "";
  LabId!: number;
  Status: string = "";
  AppointmentType: string = "";
  RangeStartDate: string = "";
  RangeEndDate: string = "";
  BookingMode:string = "";
}
export class LabFeeAndCancellation{
  labId!: number;
  f2fFee!: number;
  folowupDays!: number;
  folowupFees!: number;
  homevisitFee!: number;
  newOnlineFee!: number;
  urgentcareFee!: number;
  labCancelationRuleModel!: Array<LabCancelationRuleModel>;

}
export class LabCancelationRuleModel{
  uptoHours!: number;
  refundPercentage!: number;
}


export class DashboardDetails{
  labReferral!: LabReferral;
  labAppointment!: LabAppointment;
}
export class LabReferral{
  thisMonth!: number;
  lastMonth!: number;
  todays!: number;
  total!: number;
}
export class LabAppointment{
  thisMonth!: number;
  lastMonth!: number;
  todays!: number;
  total!: number;
}

