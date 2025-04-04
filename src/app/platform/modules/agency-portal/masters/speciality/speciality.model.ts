export class SpecialityModel {
  id: string = "";
  globalCodeName: string = "";
  globalCodeValue: string = "";
  globalCodeCategoryID!: number;
  displayOrder: number = 0
  isActive!: boolean;
  totalRecords: number = 0;
  specialityIcon!: string;
  photoPath: string = "";
  photoThumbnailPath: string = "";
}
