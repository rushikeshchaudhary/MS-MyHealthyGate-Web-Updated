import { ClientsService } from "./../../clients.service";
import { Metadata } from "./../../../../../super-admin-portal/core/modals/common-model";
import { NotifierService } from "angular-notifier";
import { Component, OnInit } from "@angular/core";
import { FilterModel } from "src/app/platform/modules/core/modals/common-model";
import { MatDialog } from "@angular/material/dialog";
import { AddCardDialogComponent } from "../add-card-dialog/add-card-dialog.component";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-payment-history",
  templateUrl: "./card-history.component.html",
  styleUrls: ["./card-history.component.css"],
})
export class CardHistoryComponent implements OnInit {
  metaData: Metadata;
  filterModel: FilterModel;
  UserSavedCardList: Array<any> = [];
  type: any = "";
  displayedColumns: Array<any> = [
    {
      displayName: "name_on_card",
      key: "nameOnCard",
      class: "",
      isSort: true,
    },
    {
      displayName: "card_number",
      key: "cardNumber",
      class: "",
      isSort: true,
    },
    {
      displayName: "card_expiry",
      key: "expiryDate",
      class: "",
    },

    { displayName: "actions", key: "Actions", class: "" },
  ];
  actionButtons: Array<any> = [
   // { displayName: "Edit", key: "edit", class: "fa fa-pencil" },
    { displayName: "Delete", key: "delete", class: "fa fa-times" },
  ];

  constructor(
    private dialogModal: MatDialog,
    private notifier: NotifierService,
    private clientService: ClientsService,
    private translate: TranslateService
  ) {
    this.filterModel = new FilterModel();
    this.metaData = new Metadata();
    translate.setDefaultLang(localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
  }
  ngOnInit() {
    this.getUserSavedCard();
  }

  getUserSavedCard = () => {
    this.clientService.GetUserSavedCard(this.filterModel).subscribe((res) => {
      if (res.statusCode == 200) {
        this.UserSavedCardList = res.data;
        this.metaData = res.meta;
      } else {
        this.UserSavedCardList = [];
      }
      this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];
    });
  };
  deleteSavedCard = (cardId:any) => {
    this.clientService.DeleteUsercard(cardId).subscribe((res) => {
      if (res.statusCode == 200) {
        this.notifier.notify("success", res.message);
        this.getUserSavedCard();
      } else {
        this.notifier.notify("error", res.message);
      }
    });
  };

  addCard = (type: string, data: any) => {
    let addCard;

    addCard = this.dialogModal.open(AddCardDialogComponent, {
      data: {
        type: type,
        data: data,
      },
    });
    addCard.afterClosed().subscribe((result: string) => {
      if (result == "close") {
      } else {
        this.getUserSavedCard();
      }
    });
  };

  onPageOrSortChange = (actionObj:any) => {
    console.log(actionObj);
    this.filterModel.pageNumber = actionObj.pageNumber;
    this.filterModel.pageSize = actionObj.pageSize;
    this.filterModel.sortColumn = actionObj.sort;
    this.filterModel.sortOrder = actionObj.order;
    this.getUserSavedCard();
  };
  onTableActionClick = (e:any) => {
    console.log(e);
    if (e.action == "delete") {
      this.deleteSavedCard(e.data.id);
    } else if (e.action == "edit") {
      this.addCard("edit", e.data);
    } else {
      console.log(e);
    }
  };
}
