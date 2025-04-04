export class LocationModel{
    id:number=0;
    address:string='';
    billingNPINumber!: number;
    billingTaxId!: number;
    daylightOffset:number=0;
    facilityNPINumber!: number;
    facilityProviderNumber!: number;
    facilityType:string='';
    locationDescription:string='';
    locationName:string='';
    standardOffset:number=0;
    apartmentNumber:string='';
    billingProviderInfo:string=''; 
    city:string='';
    countryID!: number;    
    facilityCode!: number;  
    daylightSavingTime:number=0; 
    latitude:number=0; 
    longitude:number=0; 
    mileageRate!: number; 
    officeEndHour:string='';
    officeStartHour:string='';
    organizationID:number=0;
    phone:string='';
    standardTime:number=0;
    stateID!: number;
    zip:string='';
}