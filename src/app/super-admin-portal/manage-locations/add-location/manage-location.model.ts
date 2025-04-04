export class ManageLocationModel {
    id?: number;
    locationID: number=0;
    address: string="";
    city?: string;
    countryID: number=0;;
    createdBy: number=0;;
    createdDate!: Date;
    deletedBy?: number;
    deletedDate?: Date;
    isActive?: boolean = true;
    isDeleted?: boolean = false;
    locationDescription: string="";
    locationName: string="";
    organizationId: number=0;
    phone?: string;
    stateID: number=0;
    updatedBy: number=0;;
    updatedDate!: Date;
    zip?: string;
    code?: number;
    billingNPINumber?: number;
    billingTaxId?: number;
    faciltyCode?: number;
    facilityNPINumber?: number;
    facilityProviderNumber?: number;
    officeStartHour?: Date;
    officeEndHour?: Date;
    mileageRate?: number;
    latitude?: number = 0;
    longitude?: number = 0;
    billingProviderInfo?: string;
    apartmentNumber?: number;
    daylightSavingTime?: Date;
    standardTime?: Date;
    isFromSuperAdmin! : boolean;

}
