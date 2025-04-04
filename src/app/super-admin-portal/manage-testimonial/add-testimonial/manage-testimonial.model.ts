export class ManageTestimonialModel {
    id?: number;
    testimonialID: number=0;
    description: string="";
    name: string="";
    organizationName: number=0;
    profilePic: string="";
    createdDate!: Date;
    deletedBy?: string;
    deletedDate?: Date;
    isActive?: boolean = true;
    isDeleted?: boolean = false;
    isFromSuperAdmin! : boolean;

}
