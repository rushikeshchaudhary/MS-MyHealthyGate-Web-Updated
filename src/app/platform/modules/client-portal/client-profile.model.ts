import * as internal from "assert";
import { PatientMedicalFamilyHistoryDiseaseModel } from "../agency-portal/clients/family-history/family-history.model";
import { FilterModel } from "../core/modals/common-model";

export class Metadata {
  totalRecords!: number;
  currentPage!: number;
  pageSize!: number;
  defaultPageSize!: number;
  totalPages!: number;
  pageSizeOptions:number[]=[];
}

export class PatientInfo {
    patientID!: number;
    name!: string;
    dob!: Date;
    age!: number;
    gender!: string;
    ssn!: string;
    mrn!: string;
    status!: string;
    phone!: string;
    email!: string;
    address!: string;
    photoPath!: string;
    photoThumbnailPath: string = '';
    isPortalActivate: boolean = false;
    isBlock: boolean = false;
    isActive: boolean = false;
    userID!: number;
    city!: string;
    countryName!: string;
    ethnicity!: string;
    firstName!: string;
    lastName!: string;
    raceName!: string;
    stateName!: string;
    zip!: string;
    note!: string;
    isPortalRequired: boolean = false;
    renderingProviderId?: number;
    renderingProviderName?: string;
    renderingProviderThumbnail?: string;
}

export class PatientVital {
    patientVitalID!: number;
    heartRate!: number;
    bmi!: number;
    bpDiastolic!: number;
    bpSystolic!: number;
    pulse!: number;
    respiration!: number;
    temperature!: number;
    heightIn!: number;
    weightLbs!: number;
    vitalDate!: Date;
}

export class PatientDiagnosisDetail {
    code!: string;
    description!: string;
    isPrimary: boolean = false;
    diagnosisDate!: Date;
}

export class PhoneNumberModel {
    phoneNumberId!: number;
    phoneNumber!: string;
    phoneNumberTypeId!: number;
    phoneNumberType!: string;
    preferenceID!: number;
    preference!: string;
    otherPhoneNumberType!: string;
}

export class PatientTagsModel {
    patientTagID!: number;
    tagID!: number;
    tag!: string;
    colorCode!: string;
    colorName!: string;
    roleTypeID!: number;
    fontColorCode!: string;
    isDeleted: boolean = false;
}

export class PatientAddressesModel {
    addressID!: number;
    isMailingSame: boolean = false;
    address1!: string;
    address2!: string;
    city!: string;
    stateID!: number;
    stateName!: string;
    stateAbbr!: string;
    countryID!: number;
    countryName!: string;
    zip!: string;
    addressTypeID!: number;
    addressType!: string;
    isPrimary: boolean = false;
    others!: string;
}

export class PatientAllergyModel {
    patientAllergyId!: number;
    allergen!: string;
    allergyTypeId!: number;
    allergyType!: string;
    reactionID!: number;
    reaction!: string;
    note!: string;
    createdDate!: Date;
    isActive: boolean = false;
}
export class PatientInsuranceModel {
    id!: number;
    patientID!: number;
    insuranceCompanyID!: number;
    insuranceCompanyAddress: string ='';
    insuranceIDNumber: string ='';
    insuranceGroupName: string ='';
    insurancePlanName: string ='';
    insurancePlanTypeID!: number;
    cardIssueDate!: Date;
    notes: string ='';
    insurancePhotoPathFront: string ='';
    insurancePhotoPathThumbFront: string ='';
    insurancePhotoPathBack: string ='';
    insurancePhotoPathThumbBack: string ='';
    insurancePersonSameAsPatient: boolean = false;
    carrierPayerID: string ='';
    isDeleted: boolean =false;
    insuranceCompanyName: string ='';
}
export class PatientMedicalFamilyHistoryModel {
    medicalFamilyHistoryId!: number;
    patientID!: number;
    dob!: Date;
    dateOfDeath!: Date;
    causeOfDeath: string = '';
    firstName: string ='';
    genderID!: number;
    gender: string = '';
    lastName: string = '';
    observation!: string;
    relationShipID!: number;
    relationshipName: string ='';
    patientMedicalFamilyHistoryDiseases?: PatientMedicalFamilyHistoryDiseaseModel[];
}

export class PatientMedicationModel {
    patientMedicationId!: number;
    dose!: string;
    endDate!: Date;
    startDate!: Date;
    frequencyID!: number;
    frequency!: string;
    medicine!: string;
    strength!: string;
}

export class PatientSocialHistory {
    id!: number;
    patientID!: number;
    alcohalID!: number;
    tobaccoID!: number;
    drugID!: number;
    occupation!: string;
    travelID!: number;
    isActive: boolean = false;
    isDeleted: boolean = false;
    createdBy!: number;
    createdDate!: Date;
    updatedDate!: Date;
    updatedBy!: number;
}

export class PatientImmunization {
    id!: number;
    patientID!: number;
    orderBy!: number;
    vfcid!: number;
    administeredDate!: Date;
    immunization!: number;
    amountAdministered!: number;
    manufactureID!: number;
    expireDate!: Date;
    vaccineLotNumber: string ='';
    administrationSiteID!: number;
    routeOfAdministrationID!: number;
    administeredBy!: number;
    immunityStatusID!: number;
    rejectedImmunization: boolean = false;
    rejectionReasonID!: number;
    rejectionReasonNote: string='';
    manufacturerName: string='';
    isActive: boolean = false;
    isDeleted: boolean = false;
    createdBy!: number;
    createdDate!: Date;
}

export class Organization {
    id!: number;
    organizationName!: string;
    businessName!: string;
    value!: string;
    description!: string;
    address1!: string;
    city!: string;
    stateName!: string;
    zip!: string;
    phone!: string;
    fax!: string;
    email!: string;
    logo!: string;
    favicon!: string;
    contactPersonFirstName!: string;
    contactPersonLastName!: string;
    contactPersonPhoneNumber!: string;
    contactPersonMaritalStatus!: number;
    databaseDetailId!: number;
    isActive: boolean = false;
    createdDate!: Date;
    isDeleted: boolean = false;
    createdBy!: number;
    updatedDate!: Date;
    latitude!: number;
    longitude!: number;
    apartmentNumber!: string;
    vendorIdDirect!: string;
    vendorIdIndirect!: string;
    vendorNameDirect!: string;
    vendorNameIndirect!: string;
    payrollStartWeekDay!: string;
    payrollEndWeekDay!: string;
}

export class ClientProfileModel {
    patientInfo = new Array<PatientInfo>();
    patientVitals = new Array<PatientVital>();
    lastAppointmentDetails: any[] = [];
    upcomingAppointmentDetails: any[] = [];
    patientDiagnosisDetails = new Array<PatientDiagnosisDetail>();
    phoneNumberModel = new Array<PhoneNumberModel>();
    patientTagsModel:any = new Array<PatientTagsModel>();
    patientAddressesModel = new Array<PatientAddressesModel>()
    patientAllergyModel = new Array<PatientAllergyModel>();
    patientLabTestModel: any[] = [];
    patientMedicalFamilyHistoryModel = new Array<PatientMedicalFamilyHistoryModel>();
    patientCustomLabelModel: any[] = [];
    patientMedicationModel = new Array<PatientMedicationModel>();
    staffs: any[] = [];
    patientSocialHistory = new Array<PatientSocialHistory>();
    patientEncounter: any[] = [];
    patientImmunization = new Array<PatientImmunization>();
    organization = new Array<Organization>();
    claimServiceLine: any[] = [];
}
export class PatientAppointmentListModel {
    patientAppointmentId!: number;
    startDateTime!: Date;
    endDateTime!: Date;
    appointmentTypeName!: string;
    appointmentTypeID!: number;
    color!: string;
    fontColor!: string;
    defaultDuration!: number;
    isBillable: boolean = false;
    patientName!: string;
    patientID!: number;
    patientEncounterId!: number;
    claimId!: number;
    canEdit: boolean = false;
    patientAddressID!: number;
    serviceLocationID!: number;
    appointmentStaffs: AppointmentStaff[] = [];
    isClientRequired: boolean = false;
    isRecurrence: boolean = false;
    offSet!: number;
    allowMultipleStaff: boolean = false;
    cancelTypeId!: number;
    isExcludedFromMileage: boolean = false;
    isDirectService: boolean = false;
    patientPhotoThumbnailPath!: string;
    statusId!: number;
    statusName!: string;
    address!: string;
    latitude!: number;
    longitude!: number;
    isTelehealthAppointment: boolean = false;
    customAddress!: string;
    customAddressID?: number;
    notes!: string;
    officeAddressID?: number;
    recurrenceRule!: string;
    parentAppointmentId?: number;
}
export class AppointmentStaff {
    staffId!: number;
    staffName!: string;
    isDeleted: boolean = false;
}
export class PatientAuthorizationModel {
    authorizationId!: number;
    authorizationNumber!: string;
    startDate!: Date;
    endDate!: Date;
    payerName!: string;
    payerPreference!: string;
    totalCount!: number;
    patientInsuranceId!: number;
    authorizationTitle!: string;
    notes!: string;
    payerId!: number;
    isExpired: boolean = false;
}
//chat
export class ChatHistoryModel {
    id?: number;
    message!: string;
    isSeen?: boolean;
    fromUserId?: number;
    toUserId?: number;
    chatDate?: string;
    isRecieved?: boolean;
}

export class LabListModel {
    labId?: Number;
    labName!: string;
    labPhotoThumbnailPath!: string;
}

export class Subscriptionplan {
    patientSubscriptionPlanId!: number;
    subscriptionPlanId!: number;
    patientId!: number;
    planType!: string;
    amountPerClient!: number;
    createdBy!: number;
    createdDate!: Date;
    deletedBy?: number;
    deletedDate?: Date;
    isActive?: boolean = true;
    isDeleted?: boolean = false;
    title!: string;
    descriptions!: string;
    organizationId!: number;
    phone?: string;
    updatedBy!: number;
    updatedDate!: Date;
    expiryDate?: Date;
    startDate?: Date;
    organizationName!: string;
    email!: string;
    locationId!: number;
}
export class UserDocumentReq extends FilterModel{
    userId!: number;
    documentType?:number | any;
    searchCriteria:string="";
    override fromDate!: any;
    override toDate!: any;
    CreatedBy!: string;
    FirstCall:boolean=true;
}


export interface Ticket {
    id?: string;
    category: string;
    priority: string;
    description: string;
    files?: File[];
    status: string;
    remarks?: string;
  }
  

  export interface GetRaisedTicketByIdResponceModel {
    ticketId: number;
    category: string;
    status: string;
    remarks?: string;
    priority: string;
    description: string;
    key?: string;
    creatorName: string;
    createdDate?: Date;
    files?: GetRaisedTicketResponceModelFiles[];
  }
  
  export interface GetRaisedTicketResponceModelFiles {
    fileId: number;
    ticketId: number;
    base64: string;
    fileName: string;
  }
  
