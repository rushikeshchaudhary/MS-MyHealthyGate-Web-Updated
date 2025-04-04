
export class ReviewRatingModel {
    id!: number;
    startTime!: string; 
    endTime!: string;
    slotDate!: string;
    recurringType!: number;
    slotType!: number;
    dateRange:any;
    visitType!: number;
    providerAvailibilitySlots: any[] = [];
    startDate!: string;
    endDate!: string;
}
export interface CalendarEvent<MetaType = any> {
    id?: string | number;
    start: Date;
    end?: Date;
    title: string;
    color?: EventColor;
    actions?: EventAction[];
    allDay?: boolean;
    cssClass?: string;
    resizable?: {
        beforeStart?: boolean;
        afterEnd?: boolean;
    };
    draggable?: boolean;
    meta?: MetaType;
    visitType?:number;
    logo?:string;
    bookingType?:string;
    bookingMode?:string;
}


export interface EventColor {
    primary: string;
    secondary: string;
}

export interface EventAction {
    label: string;
    cssClass?: string;
    onClick({ event }: {
        event: CalendarEvent;
    }): any;
}