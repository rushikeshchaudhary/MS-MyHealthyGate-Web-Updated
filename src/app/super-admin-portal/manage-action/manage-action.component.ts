import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NotifierService } from "angular-notifier";
import { ManageProvidersService } from "../manage-providers/manage-providers.service";

@Component({
  selector: "app-manage-action",
  templateUrl: "./manage-action.component.html",
  styleUrls: ["./manage-action.component.css"],
})
export class ManageActionComponent implements OnInit {
  userStatus = "Active";
  constructor(
    public dialogPopup: MatDialogRef<ManageActionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private providerService: ManageProvidersService,
    private notifier: NotifierService
  ) {


    console.log(data)
    if (data.isActive == true) {
      this.userStatus = "Active";
    } else if (data.isDelete == true) {
      this.userStatus = "Deleted";
    } else {
      this.userStatus = "Block";
    }
  }

  ngOnInit() {
  }

  onActionClick = (action: string) => {
    let formData = {
      isDelete: action == "delete" ? true : false,
      isActivate: action == "activate" ? true : false,
      isBlock: action == "block" ? true : false,
      userId: this.data.userID?this.data.userID:this.data.userId,
    };

    this.providerService.superAdminActionOnUser(formData).subscribe((res) => {
      if (res.statusCode == 200) {
        this.notifier.notify("success", res.message);
        this.closeDialog('save')
      } else {
        this.notifier.notify("error", res.message);
      }
    });
  };

  closeDialog(action: string): void {
    this.dialogPopup.close(action);
  }
}
