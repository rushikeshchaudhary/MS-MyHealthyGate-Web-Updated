import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { CommonService } from '../platform/modules/core/services';
import { GetTicketRequestModel } from '../super-admin-portal/core/modals/common-model';

@Injectable()
export class SharedService {
    //Patient Raised Ticket URL
  private uploadTicket="ticketRaise/RaiseTicket"
  private getUserAllRaisedTickets="ticketRaise/GetUserRaisedTicket"
  private deleteTicketById="ticketRaise/DeleteRaisedTicketById/"
  private getTicketRaiseCategories="ticketRaise/categories"
  private getAllConversation="ticketRaise/GetTicketChatMessage"
  private sendTicketChatMessage="ticketRaise/PostTicketChatMessage"
  private sendNewMessageNotification="ticketRaise/NewMessageNotification"
  
    private sidenav!: MatSidenav ;
     
    constructor(private commonService:CommonService){}

    public setSidenav(sidenav: MatSidenav ) {
        this.sidenav = sidenav;
    }

    public open() {
        return this.sidenav.open();
    }


    public close() {
        return this.sidenav.close();
    }

    public toggle(): void {
    this.sidenav.toggle();
   }

   UploadTicket(data:any, isLoading=true){
    return this.commonService.post(this.uploadTicket,data,true);
  }


    GetAllUserRaisedTickets(getTicketreqModel:GetTicketRequestModel, isLoading=true){
    let url = `?SearchText=${getTicketreqModel.searchText}&PageNumber=${getTicketreqModel.pageNumber}&PageSize=${getTicketreqModel.pageSize}&SortColumn=${getTicketreqModel.sortColumn}&SortOrder=${getTicketreqModel.sortOrder}`;

   
    if (getTicketreqModel && getTicketreqModel.fromDate) {
      
        url += `&FromDate=${getTicketreqModel.fromDate}`;
    }

    
    if (getTicketreqModel && getTicketreqModel.toDate) {
   
        url += `&ToDate=${getTicketreqModel.toDate}`;
    }

     return this.commonService.get(this.getUserAllRaisedTickets+url);
  }

  DeleteUserRaisedTicketById( ticketId:number, isLoading=true){
      return this.commonService.delete(this.deleteTicketById+ticketId);
  }

  GetTicketRaiseCategories(){
    return this.commonService.get(this.getTicketRaiseCategories)
  }

  GetAllConversation(ticketId:number){
    return this.commonService.get(`${this.getAllConversation}?ticketId=${ticketId}`,false);
  }

  SendTicketChatMessage(msg:any){
    return this.commonService.post(this.sendTicketChatMessage,msg,false);
  }

  SendNewMessageNotification(ticketId:any){
    return this.commonService.post(this.sendNewMessageNotification,ticketId,false);
  }

  OnUpdateTicket(ticket: any) {
    return this.commonService.post(
      "ticketRaise/UpdateRaisedTicketById",
      ticket
    );
  }
}
