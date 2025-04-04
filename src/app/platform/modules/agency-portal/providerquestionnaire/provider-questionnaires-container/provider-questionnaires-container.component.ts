import { Component, OnInit, ViewChild } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../core/services';
import { DialogService } from '../../../../../shared/layout/dialog/dialog.service';
import { ProviderquestionnaireService } from '../providerquestionnaire.service';
import { FormControl, Validators } from '@angular/forms';
import { ProviderQuestionnaireControlModel, QuestionnareTypeModel, SwapOrderModel } from '../providerquestionnaire.model';
import { MatDialog } from '@angular/material/dialog';
import { AddQuestionComponent } from '../add-question/add-question.component';
import { FilterModel, ResponseModel, Metadata } from '../../../core/modals/common-model';
import { Observable, of } from 'rxjs';
import { ControlBase, ControlTypesHelper } from 'src/app/shared/dynamic-form/dynamic-form-models';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-provider-questionnaires-container',
  templateUrl: './provider-questionnaires-container.component.html',
  styleUrls: ['./provider-questionnaires-container.component.scss']
})
export class ProviderQuestionnairesContainerComponent implements OnInit {


  questionnaireTypes: QuestionnareTypeModel[] = [];
  selectedType = new FormControl(0,[Validators.required]);
  selectedTabIndex: number = 0;
  providerQuestionnaires: ProviderQuestionnaireControlModel[] = [];
  searchText = "";
  filterModel: FilterModel = new FilterModel;
  metaData = new Metadata();
  controls$: ControlBase<any>[] = [];


  displayedColumns: Array<any> = [
    { displayName: 'order_no', key: 'order', isSort: true, class: '', width: '12%' },
    { displayName: 'question', key: 'questionText', isSort: true, class: '' },
    { displayName: 'control_name', key: 'controlName', isSort: true, class: '', width: '15%' },
    { displayName: 'options', key: 'optionsString', isSort: true, class: '' },
    { displayName: 'status', key: 'isActive', isSort: true, class: '', width: '6%',type: ['Active', 'Inactive']  },
    { displayName: 'is_required', key: 'isRequiredString', isSort: true, class: '', width: '14%'  },
    { displayName: 'actions', key: 'Actions', class: '', width: '11%' }

  ];

  actionButtons: Array<any> = [
    { displayName: 'Move Order Up', key: 'move-order-up', class: 'fa fa-arrow-up' },
    { displayName: 'Move Order Down', key: 'move-order-down', class: 'fa fa-arrow-down' },
    { displayName: 'Edit', key: 'edit', class: 'fa fa-pencil' },
    { displayName: 'Delete', key: 'delete', class: 'fa fa-times' },
  ];

  controls:any;
  isApproved: boolean = false;
  constructor(
    private addQuestionDailog: MatDialog,
    private notifier: NotifierService,
    private providerquestionnaireService: ProviderquestionnaireService,
    private dialogService: DialogService,
    private commonService: CommonService,
    private translate:TranslateService
    
  ) {  
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
  }

  ngOnInit() {


    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        console.log(user);
        this.isApproved=user.isApprove

        // if (user.isApprove == false) {
        //   // this.notifier.notify(
        //   //   "error",
        //   //   "You are not authorized to set avaibility!"
        //   // );
        //   //this._location.back();
        //   //this.route.navigate(["web/clientlist"]);
        // }

        
      }
    });


    this.getMasterQuestionnaireTypes();
    this.selectedType.valueChanges.subscribe((type:any) => {
      this.fetchQuestions(type?.id);
    })

  }

  onPageOrSortChange(changeState?: any) {
    
    this.setPaginatorModel(changeState.pageIndex + 1, this.filterModel.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);

  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {    
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }

  onTableActionClick(actionObj?: any) {

    switch ((actionObj.action || '').toUpperCase()) {
      case 'EDIT':
        this.createAddEditQuestionModel(actionObj.data);
        break;

      case 'DELETE':
        {
          
          this.deleteControl(actionObj.data.questionId)
        }
        break;
      case 'MOVE-ORDER-UP':
        this.changeOrder(actionObj.data, actionObj.action);
        break;
      case 'MOVE-ORDER-DOWN':
        this.changeOrder(actionObj.data, actionObj.action);
        break;
      default:
        break;
    }
  }

  private deleteControl(id: any) {
    this.notifier.hideAll();
    this.dialogService.confirm(`Are you sure you want to delete this questionnaire?`).subscribe((result: any) => {
      if (result == true) {
        this.providerquestionnaireService.deleteProviderQuestionnaireControl(id).subscribe((response: ResponseModel) => {
          if (response.statusCode == 200) {
            this.notifier.notify('success', "Questionnaire has been deleted successfully")
            this.fetchQuestions(null);
          } else {
            this.notifier.notify('error', response.message)
          }
        });
      }
    })
  }

  getMasterQuestionnaireTypes() {
    this.commonService.loadingStateSubject.next(true);
    this.providerquestionnaireService.getMasterData("MASTERQUESTIONNAIRETYPES").subscribe(res => {
      this.commonService.loadingStateSubject.next(false);
      this.questionnaireTypes = res.masterQuestionnaireTypes;
      if (this.questionnaireTypes && this.questionnaireTypes.length > 0)
        //this.selectedType.setValue(this.questionnaireTypes[0]);
        this.selectedType.setValue(this.questionnaireTypes[0].id);
    });
  }

  applyFilter(searchText: string = '') {
    if (searchText == '' || searchText.length > 2) {
      this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, searchText);
      //this.getPayersList();
    }
  }

  clearFilters() {
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, '');
  }


  onTabChange(selectedTabIndex: any) {
    this.fetchQuestions(this.questionnaireTypes[selectedTabIndex].id);
  }

  fetchQuestions(type:any) {
    //type = type ? type : this.selectedType.value ? this.selectedType.value.id : undefined;
    if (type) {
      this.commonService.loadingStateSubject.next(true);
      this.providerquestionnaireService.getProvidersQuestionnaireControlsByType(type).subscribe(res => {
      if(res.data){
        
        this.providerQuestionnaires = res.data;
        this.providerQuestionnaires.map(m => {
          
          m.isRequiredString = m.isRequired ? "Yes" : "No"
          return m;
        });
      }
        
        this.commonService.loadingStateSubject.next(false);
      });
    }
  }
  isUpdate = false;
  createAddEditQuestionModel(_questionControl: any) {
    if (this.selectedType.invalid) {
      return;
    }
    if(_questionControl) this.isUpdate= true;
    debugger
    const type = this.selectedType.value as unknown as QuestionnareTypeModel;
    const modalPopup = this.addQuestionDailog.open(
      AddQuestionComponent,
      {
        hasBackdrop: true,
        data: { type: type, questionControl: _questionControl, isUpdate: _questionControl ? true : false },
        width:"55%"
      }
    );

    modalPopup.afterClosed().subscribe((result) => {
      this.commonService.loadingStateSubject.next(false);
      if (result === "SAVE") {
        this.fetchQuestions(null);
        if (this.isUpdate)
          this.notifier.notify("success", "Questionnaire has been updated successfully");
        else
          this.notifier.notify("success", "Questionnaire has been added successfully");
      }
    });
  }

  changeOrder(quesObj: ProviderQuestionnaireControlModel, direction: string) {
    direction = direction.toUpperCase();
    const toUpdateObject: SwapOrderModel[] = [];
    if (direction == 'MOVE-ORDER-UP') {
      const quesOrder = this.providerQuestionnaires.find(x => x.questionId == quesObj.questionId)!.order;
      if (quesOrder != 1) {
        const swapWithOrder = quesOrder - 1;
        const swapWithObj = this.providerQuestionnaires.find(x => x.order == swapWithOrder);
        toUpdateObject.push({ id: quesObj.questionId, order: swapWithOrder });
        toUpdateObject.push({ id: swapWithObj!.questionId, order: quesOrder });
        this.updateOrder(toUpdateObject);
      }

    }
    else if (direction == 'MOVE-ORDER-DOWN') {
      const quesOrder = this.providerQuestionnaires.find(x => x.questionId == quesObj.questionId)!.order;

      if (quesOrder != (this.providerQuestionnaires.length)) {
        const swapWithOrder = quesOrder + 1;
        const swapWithObj = this.providerQuestionnaires.find(x => x.order == swapWithOrder);
        toUpdateObject.push({ id: quesObj.questionId, order: swapWithOrder });
        toUpdateObject.push({ id: swapWithObj!.questionId, order: quesOrder });
        this.updateOrder(toUpdateObject);
      }
    }
  }

  private updateOrder(list: SwapOrderModel[]) {
    this.commonService.loadingStateSubject.next(true);
    this.providerquestionnaireService.swapQuestionOrder(list).subscribe(res => {
      this.commonService.loadingStateSubject.next(false);
      if (res.data) {
        this.fetchQuestions(null);
      }

    });
  }

}
