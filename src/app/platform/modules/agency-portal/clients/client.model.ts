
export class ClientModel {
    id!: number;
    dob!: string;
    gender!: number;
    ssn!: string;
    mrn!: string;
    email!: string;
    photoPath!: string;
    photoThumbnailPath!: string;
    isPortalActivate!: boolean;
    isBlock!: boolean;
    isActive!: boolean;
    userID!: number;
    firstName!: string;
    lastName!: string;
    middleName!: string;
    carrierId!: string;
    note!: string;
    locationID!: number;
    optOut!: boolean;
     race!: number;
     secondaryRaceID!: number;
    renderingProviderID!: number;
    userName!: string;
    icdid!: number;
    isPortalRequired: boolean=false;
    patientDiagnosis!: PatientDiagnosis[];
    patientTags!: PatientTag[];
    tag!: number[];
     ethnicity!: number;
    primaryProvider!: string;
    emergencyContactRelationship!: number;
    emergencyContactFirstName!: string;
    emergencyContactLastName!: string;
    emergencyContactPhone!: string;
    PhotoBase64!: string;
    phone!: string;
    nationalID?:string;
    nationality?:string;
}
export class PatientDiagnosis {
    id?: number;
    patientID?: number;
    icdid?: number;
    isPrimary?: boolean;
}

export class PatientTag {
    id?: number;
    patientID?: number;
    tagID?: number;
    isDeleted!: boolean;
}

export class SocialHistoryModel
{
    id!: number;
    alcohalID!: number;
    drugID!: number;
    patientID!: number;
    occupation!: string;
    tobaccoID!: number;
    travelID!: number;
}

export class AddUserDocumentModel {
    base64!: any[];
    documentTitle!: string;
    expiration!: string;
    documentTypeIdStaff!: number;
    documentTypeId!: number;
    otherDocumentType!: string;
    key!: string;
    userId!: number;
}

export class UserDocumentModel {
    id!: number;
    userId!: number;
    documentTitle!: string;
    url!: string;
    documentTypeIdStaff!: number;
    documentTypeNameStaff!: string;
    expiration!: Date;
    extenstion!: string;
    otherDocumentType!: string;
    createdDate!: Date;
    key!: string;
    documentTypeName!: string;
}