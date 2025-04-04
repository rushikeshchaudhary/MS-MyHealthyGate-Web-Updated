export class AddressModel
{
    id!: number;
    address1!: string;
    address2!: string;
    apartmentNumber!: string;
    countryId!: number;
    city!: string;
    stateId!: number;
    zip!: string;
    patientLocationId!: number;
    addressTypeId!: number;
    addressTypeName!: string;
    isPrimary: boolean=false;
    isMailingSame: boolean=false;
    patientId!: number;
    latitude!: number;
    longitude!: number;
    isDeleted: boolean=false;
    others!: string;
}

export class PhoneNumberModel
{
    id!: number;
    patientID!: number;
    phoneNumberTypeId!: number;
    phoneNumber!: string;
    preferenceID!: number;
    otherPhoneNumberType!: string;
    isDeleted!: boolean;
}