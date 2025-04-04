export class PatientMedicalFamilyHistoryModel {
    id: number = 0;
    patientID!: number;
    firstName: string = '';
    lastName: string = '';
    genderID!: number;
    gender: string = '';
    dob!: Date;
    relationshipID!: number;
    relationShipName: string = '';
    dateOfDeath!: Date;
    causeOfDeath: string = '';
    observation: string = '';
    patientMedicalFamilyHistoryDiseases?: PatientMedicalFamilyHistoryDiseaseModel[];
}

export class PatientMedicalFamilyHistoryDiseaseModel {
    id?: number ;
    patientID?: number ;
    medicalFamilyHistoryId?: number;
    //diseaseID?: number = null;
    diseaseStatus?: boolean;
    disease?:string='';
    ageOfDiagnosis?: number;
}