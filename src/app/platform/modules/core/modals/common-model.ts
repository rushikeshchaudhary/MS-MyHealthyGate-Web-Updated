
export class FilterDate{
  fromDate?: string;
  toDate?: string;
}

export class FilterModel extends FilterDate {
  pageNumber: number = 1;
  pageSize: number = 5;
  sortColumn: string = "";
  sortOrder: string = "";
  searchText: string = "";
}



export class FilterModelCreatedBy {
  pageNumber: number = 1;
  pageSize: number = 5;
  sortColumn: string = "";
  sortOrder: string = "";
  searchText: string = "";
  createdBy: number = 0;
}

export class DynamicFilterModel {
  pageNumber: number = 1;
  pageSize: number = 5;
  sortColumn: string = "";
  sortOrder: string = "";
  searchText: string = "";
  isActiveRequired!:boolean;
}

export class ReportModel {
  pageNumber: number = 1;
  pageSize: number = 10;
  sortColumn: string = "";
  sortOrder: string = "";
  searchText: string = "";
}


export class ResponseModel {
  data: any = [];
  statusCode: number=0;
  message: string = "";
  appError: string = "";
  meta: Metadata = new Metadata;
}
export class Metadata {
  totalRecords!: number;
  currentPage!: number;
  pageSize!: number;
  defaultPageSize!: number;
  totalPages!: number;
  pageSizeOptions:number[]=[];
}
export class LabFilterModel {
  pageNumber: number = 1;
  pageSize: number = 2000;
  sortColumn: string = "";
  sortOrder: string = "";
  searchText: string = "";
}
export class PharmacyFilterModel {
  pageNumber: number = 1;
  pageSize: number = 2000;
  sortColumn: string = "";
  sortOrder: string = "";
  searchText: string = "";
}

export class ProviderListFilterModel {
  pageNumber: number = 1;
  pageSize: number = 10;
  sortColumn: string = "";
  sortOrder: string = "";
  searchText: string = "";
}

export class ProviderSearchFilterModel extends ProviderListFilterModel {
  Date: string="";
  Locations: string="";
  Taxonomies: string="";
  // Genders: string;
  Gender: string="";
  Specialities: string="";
  Services: string="";
  Rates: string="";
  Language:string="";
  MinRate: string="";
  PatientId? : number;
  ReviewRating: string="";
  SortType:string="";
  ProvidersearchText:string="";
  ProviderId:string="";
  keywords:string="";
}
export class PaymentFilterModel extends FilterModel {
  AppDate: string = "";
  PayDate: string = "";
  PatientName: string = "";
  StaffName: string = "";
  Status: string = "";
  AppointmentType: string = "";
  RangeStartDate: string = "";
  RangeEndDate: string = "";
  BookingMode:string = "";
}
export class RefundFilterModel extends FilterModel {
  AppDate: string = "";
  RefundDate: string = "";
  PatientName: string = "";
  StaffName: string = "";
}

export class PharmacySearchFilterModel extends PharmacyFilterModel {
  FirstName: string = "";
  MiddleName: string = "";
  LastName: string = "";
  PharmacyName: string = "";
  PharmacyId:string="";
  Gender: string="";
  Date: string="";
  Addres:string="";
  Phone:string="";
  SortType:string="";
  keywords:string="";
  PharmacysearchText:string="";
}
export class LabSerachFilterModel extends LabFilterModel {
  FirstName: string = "";
  MiddleName: string = "";
  LastName: string = "";
  LabName: string = "";
  LabId:string="";
  Gender: string="";
  Date: string="";
  Addres:string="";
  Phone:string="";
  SortType:string="";
  keywords:string="";
  LabsearchText:string="";
  RoleId:string="";
}

export class PatientSubscriptionFilterModel {
  pageNumber: number = 1;
  pageSize: number = 10;
  sortColumn: string = "";
  sortOrder: string = "";
  searchText: string = "";
}
export class PatientSubscriptionPlan {
  patientSubscriptionPlanId: number=0;
  subscriptionPlanId:number=0;
  patientId:number=0;
  planType:string="";
  amountPerClient:number=0;
  createdBy!: number;
  createdDate!: Date;
  deletedBy?: number;
  deletedDate?: Date;
  isActive?: boolean = true;
  isDeleted?: boolean = false;
  title: string="";
  descriptions: string="";
  organizationId: number=0;
  phone?: string;
  updatedBy!: number;
  updatedDate!: Date;
  expiryDate?: Date;
  startDate?: Date;
  organizationName:string="";
  email:string="";
  locationId:number=0;
}

export class SoapNoteModel extends FilterModel {
  StaffId?: number;
  PatientId? : number;
  ProviderName: string="";
  patientName:string="";
  CreatedDate?:Date;
  Subjective:string="";
  Objective:string="";
  Assessment:string="";
  Plans:string="";
}
export class InsurancecompanyModel {
  incuranceCompanyId: number = 0;
  companyAddress: string = "";
  isDeleted: string = "";
  companyName:string="";
  phone:string="";
  isActive: boolean = false;
  comapnyEmail:string="";
  totalRecords: number = 0;
}
export class ImmunizationFilterModel {
  pageNumber: number = 1;
  pageSize: number = 5;
  sortColumn: string = "";
  sortOrder: string = "";
  SearchText: string = "";
  VaccineStatus:string="";
}
export class PaymentFilterModelForAdmin extends FilterModel {
  AppDate: string = "";
  PayDate: string = "";
  PatientName: string = "";
  ProviderName:string ="";
  StaffName: string = "";
  Status: string = "";
  AppointmentType: string = "";
  RangeStartDate: string = "";
  RangeEndDate: string = "";
  BookingMode:string = "";
}
export class RefundFilterModelForAdmin extends FilterModel {
  AppDate: string = "";
  RefundDate: string = "";
  PatientName: string = "";
  ProviderName:string ="";
  StaffName: string = "";
}
export class AdminDataFilterModel extends FilterModel {
  // pageNumber: number = 1;
  // pageSize: number = 5;
  // sortColumn: string = "";
  // sortOrder: string = "";
  SearchText: string = "";
  Listof:string="";
  Email:string="";
}
export class SuperAdminDataModel {
  patientID: number = 0;
  FirstName: string = "";
  LastNmae: string = "";
  fullName:string="";
  email:string="";
  IsActive: boolean = false;
  staffID:number=0;
  ProviderFirstName:string="";
  ProviderLastName:string="";
  providerFullName:string="";
  //StaffID:number=0;
  LabFirstName:string="";
  LabLastName:string="";
  labFullName:string="";
  labEmail:string="";
  labID:number=0;
  LabName:string="";
  PharmaFirstName:string="";
  PharmaLastName:string="";
  pharmaFullName:string="";
  pharmaEmail:string="";
  pharmacyID:number=0;
  PharmacyName:string="";
  RadioFirstName:string="";
  RadioLastName:string="";
  radioFullName:string="";
  radioEmail:string="";
  radiologyID:number=0;
  RadiologyName:string="";
  totalRecords: number = 0;
  Subject:string="";
  Reason:string="";
}
// export class FilterLabReferralModel{
//   organizationId: number=128;
//   labId: number=0;
//   searchText: string="";
//   referralDate:any;
//   testDate:any;
//   pageNumber:number=1;
//   pageSize:number=10;
//   sortColumn:string="";
//   sortOrder:string="";
//   status:string="";
// }
export class FilterLabReferralModel {
  organizationId: number = 128;
  labId: number = 0;
  searchText: string| null = null;
  referralDate: any;
  endreferralDate:any;
  testDate: any;
  endtestDate:any;
  pageNumber: number = 1;
  pageSize: number = 10;
  sortColumn: string| null = null;
  sortOrder: string| null = null;
  status: string| null = null;

  constructor(
    organizationId: number,
    labId: number,
    searchText: string,
    referralDate: any,
    endreferralDate:any,
    testDate: any,
    endtestDate:any,
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    status: string
  ) {
    this.organizationId = organizationId;
    this.labId = labId;
    this.searchText = searchText;
    this.referralDate = referralDate;
    this.endreferralDate=endreferralDate;
    this.testDate = testDate;
    this.endtestDate=endtestDate;
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
    this.sortColumn = sortColumn;
    this.sortOrder = sortOrder;
    this.status = status;
  }
}


