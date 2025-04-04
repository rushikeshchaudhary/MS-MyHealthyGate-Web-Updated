export class ImmunizationModel {
    id!: number;
    patientID!: number;
    orderBy!: number;
    vfcid!: string;
    administeredDate!: Date;
    immunization!: string;
    amountAdministered!: number;
    manufactureID!: number;
    expireDate!: Date;
    vaccineLotNumber!: string;
    administrationSiteID!: number;
    routeOfAdministrationID!: number;
    administeredBy!: number;
    immunityStatusID!: number;
    immunityStatus!: string;
    rejectedImmunization!: boolean;
    rejectionReasonID!: number;
    rejectionReason!: string;
    rejectionReasonNote!: string;
    isDeleted!: boolean;
    vaccineName!: string;
    routeOfAdministration!: string;
    administrationSite!: string;
    conceptName!: string;
    immunizationId!: number;
    vfcEligibilityId!: number;
    manufacturerName!: string;
    appointmentId!: number;
}