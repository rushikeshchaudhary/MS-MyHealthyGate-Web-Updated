import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { CommonService } from "src/app/platform/modules/core/services/common.service";
import { SharedService } from "../shared.service";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { NotifierService } from "angular-notifier";
import { MatDialog } from "@angular/material/dialog";
import { SuperadminupdateraiseticketComponent } from "src/app/super-admin-portal/raiseTicket/superadminraiseticket/superadminupdateraiseticket/superadminupdateraiseticket.component";
import { SuperadminRaiseticketService } from "src/app/super-admin-portal/raiseTicket/superadminraiseticket/superadmin-raiseticket.service";
import { GetRaisedTicketByIdResponceModel } from "src/app/platform/modules/client-portal/client-profile.model";

export interface TicketMessage {
  ticketId: number;
  // senderId: number;
  messageText: string;
  base64: any[];
}

@Component({
  selector: "app-raised-ticket-details",
  templateUrl: "./raised-ticket-details.component.html",
  styleUrls: ["./raised-ticket-details.component.css"],
})
export class RaisedTicketDetailsComponent implements OnInit {
  ticketId: any;
  ticketMessageForm!: FormGroup;
  fileList: any = [];
  userId!: number;
  showSendNotificationButton: boolean = true;
  userRole: any;
  allConversation: any;
  profilepic: string = "../../../assets/doctor-img-1.png";
  statusColor: string = "red";
  @ViewChild("chatContainer")
  private chatContainer!: ElementRef;
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: "15rem",
    minHeight: "5rem",
    placeholder: "Enter text here...",
    translate: "no",
    defaultParagraphSeparator: "p",
    defaultFontName: "Arial",

    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: "redText",
        class: "redText",
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ],
  };
  // allConversation: any[] = [
  //   {
  //     userId: 12,
  //     userName: "Shashank Yadav",
  //     message: "Hello how are you",
  //     doc: "",
  //     profilePic: "../../../assets/doctor-img-1.png",
  //   },
  //   {
  //     userId: 11,
  //     userName: "Shashank ",
  //     message: "Fine",
  //     doc: "",
  //     profilePic: "../../../assets/admin-logo.png",
  //   },
  //   {
  //     userId: 12,
  //     userName: "Shashank Yadav",
  //     message: "Hello how are you",
  //     doc: "",
  //     profilePic: "../../../assets/doctor-img-1.png",
  //   },
  //   {
  //     userId: 11,
  //     userName: "Shashank ",
  //     message: "Hello how are you",
  //     doc: "",
  //     profilePic: "../../../assets/admin-logo.png",
  //   },
  //   {
  //     userId: 12,
  //     userName: "Shashank Yadav",
  //     message: "Hello how are you",
  //     doc: "",
  //     profilePic: "../../../assets/doctor-img-1.png",
  //   },
  //   {
  //     userId: 11,
  //     userName: "Shashank ",
  //     message: "Hello how are you",
  //     doc: "",
  //     profilePic: "../../../assets/admin-logo.png",
  //   },
  //   {
  //     userId: 12,
  //     userName: "Shashank Yadav",
  //     message: "Hello how are you",
  //     doc: "",
  //     profilePic: "../../../assets/doctor-img-1.png",
  //   },
  //   {
  //     userId: 11,
  //     userName: "Shashank ",
  //     message: "Hello how are you",
  //     doc: "",
  //     profilePic: "../../../assets/admin-logo.png",
  //   },
  //   {
  //     userId: 12,
  //     userName: "Shashank Yadav",
  //     message: "Hello how are you",
  //     doc: "",
  //     profilePic: "../../../assets/doctor-img-1.png",
  //   },
  // ];
  constructor(
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private fb: FormBuilder,
    private sharedService: SharedService,
    private notifier: NotifierService,
    private dialog: MatDialog,
    private ticketRaiseService: SuperadminRaiseticketService
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.ticketId = this.commonService.encryptValue(params["ticketid"], false);
    });
  }

  ngOnInit() {
    console.log(this.ticketId);
    this.checkPatientLogIn();
    this.getAllConversation();
    this.initializeForm();
  }

  checkPatientLogIn() {
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        // this.currentLoginUserId = user.id;
        this.userId = user.userID;
        debugger;
        this.userRole = user && user.users3 && user.users3.userRoles.userType;
        this.showSendNotificationButton = !(
          this.userRole === "CLIENT" || this.userRole === "PROVIDER"
        );
      }
    });
  }

  // ngAfterViewChecked() {
  //   this.scrollToBottom();
  // }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop =
        this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.log(err);
    }
  }

  initializeForm(): void {
    this.ticketMessageForm = this.fb.group({
      message: "",
    });
  }

  ticketRaiseMessageResponseModel: any;
  getAllConversation() {
    this.sharedService.GetAllConversation(this.ticketId).subscribe((res) => {
      this.allConversation = res.data;
      this.ticketRaiseMessageResponseModel =
        res.data.ticketRaiseMessageResponseModel;
      let ticketstatus = res.data.status;
      if (ticketstatus == "Pending") {
        this.statusColor = "red";
      }
      if (ticketstatus === "Resolved") {
        this.statusColor = "green";
      }
      if (ticketstatus == "In Progress") {
        this.statusColor = "yellowgreen";
      }

      setTimeout(() => {
        this.scrollToBottom();
      }, 1000);
    });
  }

  handleImageChange(e:any) {
    const input = e.target as HTMLInputElement;
    const file_data = input.files;
    console.log("file_data", file_data);
    if (file_data && file_data.length > 0) {
      const readFile = (file:any) => {
        return new Promise((resolve, reject) => {
          let fileExtension = file.name.split(".").pop().toLowerCase();
          let reader = new FileReader();
          reader.onload = () => {
            resolve({
              data: reader.result,
              ext: fileExtension,
              fileName: file.name,
            });
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      };

      Promise.all(Array.from(file_data).map((file) => readFile(file)))
        .then((fileList) => {
          this.fileList.push(...fileList);
          input.value = "";
        })
        .catch((error) => {
          console.error("Error reading files:", error);
        });
    }
  }

  removeFile(index: number) {
    this.fileList.splice(index, 1);
  }

  refreshMessage = () => {
    this.getAllConversation();
  };

  sendMessage = () => {
    const messageText = this.ticketMessageForm.get("message")?.value;
    if (
      this.fileList.length > 0 ||
      (messageText.trim() !== "" && messageText !== null)
    ) {
      const message: TicketMessage = {
        ticketId: this.ticketId,
        messageText: messageText !== "" ? messageText : null,
        base64: this.fileList != null ? this.fileList : null,
      };
      let dic: any[] = []
      console.log(message.base64);
      if (message.base64 != null) {
        message.base64.forEach((element, index) => {
          dic.push(
            `"${element.data.replace(
              /^data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,/,
              ""
            )}": "${element.ext}":"${element.fileName}"`
          );
        });
        let newObj = dic.reduce((acc, cur, index) => {
          acc[index] = cur;
          return acc;
        }, {});
        console.log(newObj);
        message.base64 = newObj;
      }
      this.sharedService.SendTicketChatMessage(message).subscribe({
        next: (res) => {
          if (res.statusCode === 200) {
            this.ticketMessageForm.setValue({ message: "" });
            this.fileList = [];
            this.refreshMessage();
          } else {
          }
        },
        error: (error) => {
          console.error("Internal server error");
        },
      });
    }
  };

  // getFileType(fileName: string): string {
  //   const extension = fileName.split('.').pop().toLowerCase();
  //   const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
  //   const documentExtensions = ['txt', 'docx', 'doc', 'xlsx', 'pptx'];
  //   const audioExtensions = ['mp3', 'wav', 'ogg'];
  //   const videoExtensions = ['mp4', 'avi', 'mov', 'mkv'];

  //   if (imageExtensions.includes(extension)) {
  //     return 'image';
  //   } else if (extension === 'pdf') {
  //     return 'pdf';
  //   } else if (documentExtensions.includes(extension)) {
  //     return 'document';
  //   } else if (audioExtensions.includes(extension)) {
  //     return 'audio';
  //   } else if (videoExtensions.includes(extension)) {
  //     return 'video';
  //   } else {
  //     return 'other';
  //   }
  // }
  getFileType(fileName: string): string {
    const parts = fileName.split(".");
    let extension = "";

    if (parts.length > 1) {
      const potentialExtension = parts.pop();
      extension = potentialExtension ? potentialExtension.toLowerCase() : "";
    }

    switch (extension) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "image";
      case "mp4":
      case "mov":
      case "avi":
        return "video";
      case "mp3":
      case "wav":
      case "m4a":
        return "audio";
      case "pdf":
        return "document";
      case "doc":
      case "docx":
        return "document";
      case "xls":
      case "xlsx":
        return "document";
      default:
        return "other";
    }
  }

  getImageType(fileName: string): string {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "jpg":
      case "jpeg":
        return "jpeg";
      case "png":
        return "png";
      case "gif":
        return "gif";
      case "bmp":
        return "bmp";
      default:
        return "png";
    }
  }

  openFile(file: any) {
    console.log(file);

    var a = document.createElement("a");
    document.body.appendChild(a);
    a.target = "_blank";
    a.href = file.base64;
    // a.download = fileName;
    a.click();
    a.remove();
    // const fileType = this.getFileType(fileName);
    // const newWindow = window.open();

    // switch (fileType) {
    //   case 'image':
    //     newWindow.document.write(`<img src="data:image/${this.getImageType(fileName)};base64,${base64}" />`);
    //     break;
    //   case 'pdf':
    //     newWindow.document.write(`<iframe src="data:application/pdf;base64,${base64}" style="width: 100%; height: 100%;"></iframe>`);
    //     break;
    //   case 'document':
    //     this.downloadFile(base64, fileName);
    //     break;
    //   case 'audio':
    //     newWindow.document.write(`<audio controls autoplay><source src="data:audio/${fileName.split('.').pop()};base64,${base64}" type="audio/${fileName.split('.').pop()}"></audio>`);
    //     break;
    //   case 'video':
    //     newWindow.document.write(`<video controls autoplay><source src="data:video/${fileName.split('.').pop()};base64,${base64}" type="video/${fileName.split('.').pop()}"></video>`);
    //     break;
    //   default:
    //     this.downloadFile(base64, fileName);
    //     break;
    // }
  }

  downloadFile(base64: string, fileName: string) {
    const link = document.createElement("a");
    link.href = `data:application/octet-stream;base64,${base64}`;
    link.download = fileName;
    link.click();
  }
  SendNewMessageNotificationToUser() {
    const ticketId = this.allConversation.ticketId;
    this.sharedService.SendNewMessageNotification(ticketId).subscribe((res) => {
      if (res.statusCode === 200) {
        this.notifier.notify(
          "success",
          "Notification Email has been sent to user about a new message"
        );
      } else {
        this.notifier.notify("error", "Error sending email");
      }
    });
  }
  changeStatusOfTicket = () => {
    if(this.showSendNotificationButton){
      const dialogRef = this.dialog.open(SuperadminupdateraiseticketComponent, {
        data: { Ticket: this.allConversation },
      });
      dialogRef
        .afterClosed()
        .subscribe((updatedTicket: GetRaisedTicketByIdResponceModel) => {
          if (updatedTicket) {
            this.sharedService
              .OnUpdateTicket({
                userId: 1,
                ticketId: updatedTicket.ticketId,
                status: updatedTicket.status,
                remarks: updatedTicket.remarks,
              })
              .subscribe(
                (response) => {
                  if (response.statusCode === 200 && response.data) {
                    this.notifier.notify("success", response.message);
                    this.getAllConversation();
                  } else {
                    this.notifier.notify("error", response.message);
                  }
                },
                (error) => {
                  console.error("Error:", error);
                }
              );
          }
        });
    }
  };
}
