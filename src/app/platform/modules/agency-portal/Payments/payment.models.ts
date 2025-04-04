export class CancelationRule {
    uptoHours!: number;
    refundPercentage!: number;
}

export class ManageFeesRefundsModel{
    providers!: number[];
    f2fFee!: number;
    newOnlineFee!: number;
    homevisitFee!: number;
    folowupFees!: number;
    folowupDays!: number;
    ftfFollowUpPayRate!: number;
    ftfFollowUpDays!: number;
    homeVisitFollowUpPayRate!: number;
    homeVisitFollowUpDays!: number;
    cancelationRules : CancelationRule[] =[];
    urgentcareFee!: number;
}

