export class ManageSubscriptionplans {
    id?: number;
    subcriptionPlanID: number=0;
    planType: string="";
    amountPerClient: number=0;;
    createdBy: number=0;;
    createdDate!: Date;
    deletedBy?: number;
    deletedDate?: Date;
    isActive?: boolean = true;
    isDeleted?: boolean = false;
    title: string="";;
    descriptions: string="";;
    organizationId: number=0;;
    phone?: string;
    subscriberName: string="";;
    updatedBy: number=0;;
    updatedDate!: Date;
    expiryDate?: Date;
    startDate?: Date;
    isFromSuperAdmin! : boolean;
}
