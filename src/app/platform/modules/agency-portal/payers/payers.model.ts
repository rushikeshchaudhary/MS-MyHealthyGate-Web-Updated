export class PayerModel {
    id!: number;
    name!: string;
    insuranceTypeId!: number;
    address!: string;
    city!: string;
    stateID!: number;
    countryID!: number;
    fax!: string;
    zip!: string;
    phone!: string;
    email!: string;
    carrierPayerID!: string;
    dayClubByProvider: boolean = false;
    tplCode!: string;
    isEDIPayer: boolean = false;
    isPractitionerIsRenderingProvider: boolean = false;
    form1500PrintFormat!: number;
    latitude!: number;
    longitude!: number;
    apartmentNumber!: string;
    isActive: boolean = false;
    totalRecords!: number;
    additionalClaimInfo!: string;
}

export class PayerListingModel {
    id!: number;
    name!: string;
    insuranceTypeId!: number;
    insType!: string;
    stateID!: number;
    email!: string;
    dayClubByProvider: boolean = false;
    isEDIPayer: boolean = false;
    isPractitionerIsRenderingProvider: boolean = false;
    form1500PrintFormat!: number;
    isActive: boolean = false;
    totalRecords!: number;
}

export class PayerServiceCodeModel {
    masterServiceCodeId!: number;
    payerServiceCodeId!: number;
    serviceCode!: string;
    description!: string;
    unitDuration!: number;
    unitTypeID!: number;
    ratePerUnit!: number;
    isBillable: boolean = false;
    ruleID!: number;
    isRequiredAuthorization: boolean = false;
    ruleName!: string;
    unitTypeName!: string;
    payerId!: number;
    serviceCodeId!: number;
    totalRecords!: number;
    isEditable: boolean = false;
}

export class PayerServiceCodeModifierModel {
    id!: number;
    rowNo!: number;
    modifier!: string;
    rate!: number;
    payerServiceCodeId!: number;
    key!: string;
    value!: string;
    isUsedModifier: boolean = false;
}

export class PayerServiceCodeWithModifierModel {
    id?: number;
    serviceCode?: string;
    type?: string;
    description?: string;
    unitDuration?: number;
    unitType?: number;
    ratePerUnit?: number;
    isBillable?: boolean;
    ruleID?: number;
    isRequiredAuthorization?: boolean;
    ruleName?: string;
    unitTypeName?: string;
    payerId?: number;
    effectiveDate?: Date;
    newRatePerUnit?: number;
    serviceCodeId?: number;
    totalRecords?: number;
    payerModifierModel: PayerServiceCodeModifierModel[] = [];
}
export class PayerActivityModel {
    appointmentTypeID!: number;
    name!: string;
    isActive: boolean = false;
    totalRecords!: number;
}
export class PayerActivityServiceCodesModel {
    id!: number;
    serviceCodeId!: number;
    payerServiceCodeId!: number;
    serviceCode!: string;
    description!: string;
    unitDuration!: number;
    unitTypeName!: string;
    ratePerUnit!: number;
    isBillable: boolean = false;
    isRequiredAuthorization: boolean = false;
    totalRecords!: number;
    attachedModifiers!: string;
}

export class PayerActivityServiceCodeModel {
    id!: number;
    description?: string;
    appointmentTypeId!: number;
    unitDuration?: number;
    unitType?: number;
    ratePerUnit!: number;
    isBillable?: boolean;
    ruleID?: number;
    isRequiredAuthorization?: boolean;
    payerId!: number;
    serviceCodeId?: number;
    payerServiceCodeId!: number;
    modifier1!: string;
    modifier2!: string;
    modifier3!: string;
    modifier4!: string;
    totalRecords?: number;
}
export class ActivityCodeModifierUpdateModel {
    id!: number;
    modifier1!: string;
    modifier2!: string;
    modifier3!: string;
    modifier4!: string;
    ratePerUnit!: string;
}

export class KeywordModel {
    id!: number;
    keywordName!: string;
    careCategoryId!: number;
    healthCareCategoryKeywords?: HealthCareCategoryKeywordsModel[];
}

export class KeywordListingModel {
    id!: number;
    KeywordName!: string;
    CareCategoryId!: number;
    totalRecords!: number;
    CareCategoryName!: string;
}

export class HealthCareCategoryKeywordsModel {
    id?: number;
    careCategoryId?: number;
    keywordName?: string;
    
}

export class ProviderCareCategoryModel {
    id!: number;
    careCategoryName!: string;
   
}
export class QuestionnaireFilterModel {
    pageNumber: number = 1;
    pageSize: number = 5;
    sortColumn: string = "";
    sortOrder: string = "";
    searchText: string = "";
    QuestionnaireId!: number;
  }