import { FilterModel } from "../../core/modals/common-model";

export class ClientList {
    dob!: string;
    firstName!: string;
    isActive: boolean = false;
    isBlock: boolean = false;
    lastName!: string;
    mrn!: string;
    email!: string;
    phone!: number;
    patientId!: number;
    photoThumbnailPath!: string;
}

export class StaffClientRequestModel extends FilterModel {
    staffId!: number;
}
