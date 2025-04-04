export class ChatHistoryModel {
  id?: number;
  message!: string;
  isSeen?: boolean;
  fromUserId?: number;
  toUserId?: number;
  chatDate?: string;
  isRecieved?: boolean;
  fileType!: string;
  messageType!: number;
}
