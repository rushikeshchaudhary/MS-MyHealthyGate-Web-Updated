export class SetReminderModal {
   webRootUrl: string="";
    sessionId: number=0;
    appointmentId: number=0;
    staffId: number=0;
    cancelationRules : CancelationRule[] =[];
  }

  export class CancelationRule {
    hour: number=0;
    reminderDateTime: string="";
}