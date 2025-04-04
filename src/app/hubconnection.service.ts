import { Observable, Subject } from "rxjs";
import { environment } from "../environments/environment";
import * as signalR from '@microsoft/signalr';

export class HubConnection {
  hubConnection!: signalR.HubConnection;
  private notificationSubject = new Subject<any>();
  hubConnectionnotification!: signalR.HubConnection;

  constructor() {
    this.createHubConnection = this.createHubConnection.bind(this);
  }

  createHubConnection = (access_token: string | any) => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.api_url}/chathub`, {
        accessTokenFactory: () => access_token,
      })
      .configureLogging(signalR.LogLevel.Error)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.serverTimeoutInMilliseconds = 600000; // 10 minutes

    return this.hubConnection.start();
  };

  startHubConnectionForNotification() {
    this.hubConnectionnotification = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.api_url}/notificationHub`)
      .configureLogging(signalR.LogLevel.Error)
      .withAutomaticReconnect()
      .build();

    this.hubConnectionnotification.serverTimeoutInMilliseconds = 6000000;
    this.hubConnectionnotification
      .start()
      .then(() => console.log('SignalR connection established for notification'))
      .catch((err: any) => console.error('Error while establishing SignalR connection: ', err));

    this.hubConnectionnotification.on('ReceiveNotification', (message: any) => {
      this.notificationSubject.next(message);
    });
  }

  getNotificationListener(): Observable<any> {
    return this.notificationSubject.asObservable();
  }

  getHubConnection() {
    console.log(this.hubConnection);
    return this.hubConnection;
  }

  restartHubConnection() {
    return new Promise((resolve, reject) => {
      if (this.isDisconnected()) {
        this.hubConnection
          .start()
          .then((hubConnection: any) => {
            resolve(hubConnection);
          })
          .catch((err: any) => {
            console.log("signalr Error", err);
            reject(err);
          });
      }
    });
  }

  isConnected() {
    return this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected;
  }

  isDisconnected() {
    return this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Disconnected;
  }

  ConnectToServerWithUserId(userId: number, roomId: number) {
    return this.hubConnection.invoke("Connect", userId, roomId);
  }

  ConnectWithAccessToken() {
    return this.hubConnection.invoke("ConnectWithAccessToken");
  }

  ConnectWithBussinessToken(userId: number) {
    return this.hubConnection.invoke("ConnectWithBussinessToken", userId);
  }
}