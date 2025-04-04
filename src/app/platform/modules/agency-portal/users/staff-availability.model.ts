export class StaffAvailabilityModel {
    dayId!: number;
    date?:string;
    dayName?: string;
    endTime?: string;
    id?: number;
    isActive?: boolean;
    isDeleted?: boolean;
    locationId?: number;
    staffAvailabilityTypeID?: number;
    staffID?: number;
    startTime?: string;
}
export class LabAvailabilityModel {
    dayId!: number;
    date?:string;
    dayName?: string;
    endTime?: string;
    id?: number;
    isActive?: boolean;
    isDeleted?: boolean;
    locationId?: number=101;
    labAvailabilityTypeID?: number;
    labId?: number;
    startTime?: string;
}