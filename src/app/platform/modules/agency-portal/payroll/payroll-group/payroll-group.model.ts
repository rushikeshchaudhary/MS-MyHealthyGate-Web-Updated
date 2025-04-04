export class PayrollGroupModel {
    id: number = 0;
    groupName: string = "";
    payPeriodId!: number;
    workWeekId!: number;
    dailyLimit!: number;
    weeklyLimit!: number;
    overTime!: number;
    doubleOverTime: number = 0;
    isCaliforniaRule: boolean = false;
    payPeriodName: string = "";
    workWeekName: string = "";
    totalRecords!: number;
    payrollBreakTimeId!: number;
}