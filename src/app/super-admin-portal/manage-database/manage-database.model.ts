export class ManageDatabaseModel {
    databaseDetailID: number=0;
    noOfOrg: number=0;
    databaseName: string="";
    password: string="";
    serverName: string="";
    userName: string="";
    createdBy: number=0;
    createdDate: string="";
    isActive!: boolean;
    isCentralised!: boolean;
    isDeleted!: boolean;
    rowNumber!: number;
    totalRecords!: number;
    totalPages!: number;
    updatedBy?: number;
    updatedDate?: string;
    organizations?: string;
}