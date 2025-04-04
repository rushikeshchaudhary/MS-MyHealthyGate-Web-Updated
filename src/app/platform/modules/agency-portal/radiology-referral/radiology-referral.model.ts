export class RadiologyReferralModel {
    public labId!: number;
    public patientId!: number;
    public appointmentId!: number;
    public testId!: number;
    public Status!: string;
    public ProviderId!: number;
    public FileName: string = "";
    public UploadedPath: string = "";
    public CreatedBy!: number;
    public notes: string = "";
    public signature!: string;
    public logoBase64!: string;
    public stampBase64!: string;
    public referTo!: string;
}