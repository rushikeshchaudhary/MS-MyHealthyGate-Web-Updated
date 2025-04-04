import { NavItem } from './navItem';

export interface SidebarInfo {
  navigations: NavItem[];
}

export interface PatientRadioData {
  patientRadiologyDocumentUrlList?: any[];
  patientResultRadiologyDicomDocumentList: any[],
  radilogyDocRes: any[];
}
