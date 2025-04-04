import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Inject,
  ViewEncapsulation,
  ViewChild,
  AfterViewInit
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CommonService } from "../../platform/modules/core/services";
import { ChatHistoryModel } from "../../platform/modules/agency-portal/clients/profile/chat-history.model";
import { HubConnection } from "../../hubconnection.service";
import { ScrollbarComponent } from "ngx-scrollbar";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-chat-widget",
  templateUrl: "./chat-widget.component.html",
  styleUrls: ["./chat-widget.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class ChatWidgetComponent implements OnInit, AfterViewInit {
  @Input() fromUserId!: number;
  @Input() toUserId!: number;
  @Input() allMessageArray!: Array<ChatHistoryModel>;
  @Input() imgSource: string = "";
  @Input() badge: number=0;
  @Input() title: string = "";
  @Input() subTitle: string = "";
  @Input() showCloseButton: boolean = false;
  @Input() autoFocus: boolean = true;
  message: string;
  hubConnection: HubConnection;
  @ViewChild("scrollbar") scrollbarRef!: ScrollbarComponent;

  showChatModal: boolean;

  constructor(private translate:TranslateService) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.showChatModal = false;
    this.message = "";
    this.hubConnection = new HubConnection();
  }

  onToggleChatModal() {
    this.showChatModal = !this.showChatModal;
  }

  ngOnInit() {
    this.createHubConnection();
  }

  createHubConnection() {
    if (this.hubConnection) {
      var token = JSON.parse(localStorage.getItem("access_token")!);
      this.hubConnection.createHubConnection(token).then(() => {
        this.hubConnection.getHubConnection().onclose(() => {
          this.ReconnectOnClose(this.fromUserId);
        });
        this.hubConnection
          .ConnectToServerWithUserId(this.fromUserId, 1)
          .then(() => {
            this.getMessageNotifications();
          });
      });
    }
  }

  ngAfterViewInit() {
    // this.scrollbarRef.scrollState.subscribe(e => console.log(e))
  }
  sendMessage():any {
    if (!this.message || !this.message.trim()) return false;
    this.handleNewUserMessage(this.message);
    // const messageObj: ChatHistoryModel = {
    //   message: this.message,
    //   isRecieved: false
    // };
    // this.allMessageArray.push(messageObj);
    this.message = "";
    return;
  }
  handleNewUserMessage(message: string = ""):any {
    if (this.hubConnection.isConnected()) {
      this.hubConnection
        .getHubConnection()
        .invoke("SendMessage", message, this.fromUserId, this.toUserId)
        .catch((err: any) => console.error(err, "ReceiveMessageReceiveMessageerror"));
      return message;
    } else {
      this.hubConnection.restartHubConnection().then(() => {
        this.hubConnection
          .getHubConnection()
          .invoke("SendMessage", message, this.fromUserId, this.toUserId)
          .catch((err: any) =>
            console.error(err, "ReceiveMessageReceiveMessageerror")
          );
        return message;
      });
    }
    return;
  }
  getMessageNotifications() {
    this.hubConnection
      .getHubConnection()
      .on("ReceiveMessage", (result: any, fromUserId: number) => {
        console.log("message from server", result, fromUserId, this.toUserId);
        if (fromUserId == this.toUserId) {
          // const messageObj: ChatHistoryModel = {
          //   message: result,
          //   isRecieved: true
          // };
          // this.allMessageArray.push(messageObj);
        }
      });
  }
  ReconnectOnClose(fromUserId: number) {
    setTimeout(() => {
      this.hubConnection.restartHubConnection().then(() => {
        this.hubConnection.ConnectToServerWithUserId(fromUserId, 1).then(() => {
          // console.log('Restart Connection: user id sent to server : ' + fromUserId);
        });
      });
    }, 5000);
  }
}
