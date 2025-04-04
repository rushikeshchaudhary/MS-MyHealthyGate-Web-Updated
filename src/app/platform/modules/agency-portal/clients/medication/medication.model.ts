export class MedicationModel {
  id: number=0;
  patientId: number=0;
  appointmentId?: number;
  medicine: string="";
  dose: string="";
  strength: string="";
  startDate: any;
  endDate: any;
  frequencyID: number=0;
  globalCodeName: string="";
  frequency: string="";
  frequencyName?:string

}
export class FilterModel {
  pageNumber: number = 1;
  pageSize: number = 5;
  sortColumn: string = "";
  sortOrder: string = "";
  searchText: string = "";
  roleId: number=0;
}
