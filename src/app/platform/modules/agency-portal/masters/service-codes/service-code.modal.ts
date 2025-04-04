export class ServiceCodeModal {
  id?: number = 0;
  serviceCode?: string = "";
  ruleID?: number;
  unitDuration?: number;
  unitTypeID?: number;
  ratePerUnit?: number;
  description?: string = "";
  modifierModel?: Modifier[];
  isBillable?: boolean = false;
  isRequiredAuthorization?: boolean = false;
  type?: string = "";
  totalRecords?: number;
  isBillableStatus?: string = "";
  reqAuthStatus?: string = "";
  serviceCodeId?: number = 0;
}

export class Modifier {
  modifier?: string = "";
  rate?: number;
}
