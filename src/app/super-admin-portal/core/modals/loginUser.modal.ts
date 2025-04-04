export interface LoginUser {
    access_token: string;
    appConfigurations: Array<any>;
    data: any;
    expires_in: number| null; 
    firstTimeLogin: boolean;
    notifications: object;
    passwordExpiryStatus: object;
    statusCode: number| null; 
    userLocations: Array<any>;
    userPermission: any;
}
