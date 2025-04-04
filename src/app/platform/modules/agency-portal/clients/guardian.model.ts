export class GuardianModel
{
    id!: number;
    patientID!: number;
    guardianFirstName: string="";
    guardianLastName: string="";
    guardianMiddleName: string="";
    guardianHomePhone: string="";
    guardianEmail: string="";
    relationshipID!: number;
    isGuarantor: boolean=false;
    isActive: boolean=false;
    totalRecords!: number;
    relationshipName:string=''
}