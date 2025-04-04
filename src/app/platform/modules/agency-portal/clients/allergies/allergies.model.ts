export class AllergyModel {
    id!: number;
    patientId!: number;
    allergyTypeId!: number;
    allergyType!: string;
    allergen!: string;
    note!: string;
    reactionID!: number;
    reaction!: string;
    isActive!: boolean;
    createdDate: any;
    totalRecords!: number;
    appointmentId!: number;
    //display cols
    status!: string;
}