import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { FilterModel } from "src/app/platform/modules/core/modals/common-model";
import { ResponseModel } from "../core/modals/common-model";
import { ManageTestimonialService } from "./manage-testimonial.service";

@Component({
  selector: "app-manage-testimonial",
  templateUrl: "./manage-testimonial.component.html",
  styleUrls: ["./manage-testimonial.component.css"],
})
export class ManageTestimonialComponent implements OnInit {
  filterModel!: FilterModel;
  allTestimonial!: any[];
  metaData: any;
  searchText: string = "";

  displayColumns: Array<any> = [
    { displayName: "Testimonial", key: "name", isSort: true, class: "", width: "15%" },
    { displayName: "Description", key: "description", isSort: true, class: "", width: "30%" },
    { displayName: "Org Name", key: "organizationName", isSort: true, class: "", width: "35%" },
    { displayName: 'Actions', key: 'Actions', isSort: true, class: "", width: "10%" },
  ];
  actionButtons: Array<any> = [
    { displayName: "Edit", key: "edit", class: "fa fa-pencil" },
  ];
  constructor(private Testimonialervice: ManageTestimonialService, private TestimonialDialogModal: MatDialog, private router: Router) {

  }

  ngOnInit() {
    this.filterModel = new FilterModel();
    this.getAllTestimonial();
  }
  getAllTestimonial() {
    this.Testimonialervice
      .getAllTestimonial(this.filterModel)
      .subscribe((response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.allTestimonial = response.data;
          this.metaData = response.meta;
        } else {
          this.allTestimonial = [];
          this.metaData = [];
        }
        this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];
      });
  }
  clearFilters() {
    this.searchText = "";
    this.filterModel.searchText ="";
    this.setPaginateorModel(
      1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, this.filterModel.searchText);
      this.getAllTestimonial();
  }
  onPageOrSortChange(changeState?: any) {
    console.log(changeState);
    this.setPaginateorModel(changeState.pageIndex + 1, changeState.pageSize, changeState.sort, changeState.Order, changeState.searchText);
    this.getAllTestimonial();
  }
  setPaginateorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder != undefined ? sortOrder : "";
    this.filterModel.sortColumn = sortColumn != undefined ? sortColumn : "";
    this.filterModel.searchText = searchText != undefined ? searchText : "";
  }
  applyFilter(searchText: string = "") {
    this.setPaginateorModel(
      1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, this.searchText);
    if (this.searchText.trim() == "" || this.searchText.trim().length >= 3)
      this.getAllTestimonial();
  }
  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.id;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'EDIT':
        this.addTestimonial(id);
        break;
      default:
        break;
    }
  }
  /*openDialog(id?: number) {
    if (id != null && id > 0) {
      this.Testimonialervice.getById(id).subscribe((response: any) => {
        if (response != null && response.data != null) {
          this.createModel(response.data);
        }
      });
    } else {
      this.createModel(new TestimonialModel());
    }
  }
  createModel(TestimonialModel: TestimonialModel) {
    let TestimonialModal;
    TestimonialModal = this.TestimonialDialogModal.open(TestimonialModalComponent, { hasBackdrop: true, data: TestimonialModel });
    TestimonialModal.afterClosed().subscribe((result: string) => {
      if (result == "save")
        this.getAllTestimonial();
    });
  }
  */
  addTestimonial(organizationId?: number) {
    this.router.navigate(["/webadmin/testimonial-setup"], { queryParams: { id: organizationId } });
  }
}
