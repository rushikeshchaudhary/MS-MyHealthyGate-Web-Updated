import { ClientProfileModel } from "../../agency-portal/clients/client-profile.model";

export class AppointmentModel {
    'patientAppointmentId': number = 0;
    'appointmentTypeID': number = 0;
    'appointmentStaffs': AppointmentStaff[];
    'patientID': number = 0;
    'patientName': string = '';
    'serviceLocationID': number = 0;
    'officeAddressID': number = 0;
    'patientAddressID': number = 0;
    'customAddressID': number = 0;
    'customAddress': string = '';
    'latitude': number = 0;
    'longitude': number = 0;
    'startDateTime': Date = new Date();
    'endDateTime': Date = new Date();
    'notes': string = '';
    'isTelehealthAppointment': boolean = false;
    'isRecurrence': boolean = false;
    'isClientRequired': boolean = false;
    'isBillableAppointment': boolean = false;
    'isBillable': boolean = false;
    'offset': number = 0;
    'timezone': string = '';
    'isExcludedFromMileage': boolean = false;
    'isDirectService': boolean = false;
    'mileage': number = 0;
    'driveTime': string = '';
    // some extra keys ...
    'patientEncounterId': number = 0;
    'parentAppointmentId': number = 0;
    'claimId': number = 0;
    'cancelTypeId': number = 0;
    'statusName': string = '';
    'mode': string = '';
    'type': string = '';
     'PatientInfoDetails':ClientProfileModel;
     'patientInfoDetails':ClientProfileModel;
     'patientPhotoThumbnailPath':string = '';
     'rating': number = 0;
     'reviewRatingId': number = 0;
     'review':string = '';
}

export class AppointmentStaff {
    'staffId'?: number = 0;
    'isDeleted'?: boolean = false;
    'staffName'?: string = '';
}

export class RecurrenceAppointmentModel {
    'startDateTime': Date = new Date();
    'endDateTime': Date = new Date();
    'startDate': string = '';
    'startTime': string = '';
    'endTime': string = '';
    'message': string = '';
}

export class CancelAppointmentModel {
    'cancelTypeId': number = 0;
    'cancelReason': string = '';
    'ids': number[];
}

