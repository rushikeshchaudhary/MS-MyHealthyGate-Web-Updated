import { CommonService } from "src/app/platform/modules/core/services";
import { debug } from "util";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable, Subject, BehaviorSubject } from "rxjs";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { FilterModel } from "src/app/platform/modules/core/modals/common-model";
@Injectable({
  providedIn: "root",
})
export class HomeService {
  private loginSubject = new BehaviorSubject<boolean>(false);
  specialityIcon: any;
  loginState = this.loginSubject.asObservable();
  private loadingStateSubject = new Subject<boolean>();
  public loadingState = this.loadingStateSubject.asObservable();
  private getMasterDataUrl: string = "Home/MasterDataByName";
  private getLabListUrl: string = "Home/LabApprovedList";
  private getPharmacyListUrl: string = "Home/PharmacyApprovedList";
  private getProviderListUrl: string = "Home/ProviderAvailableList";
  private getRadiolodyListUrl: string = "Home/RadiologyAvailableList";
  private getSortedProviderListUrl: string = "Home/SortedProviderAvailableList";
  private getsearchtextProviderListUrl: string =
    "Home/SearchTextProviderAvailableList";
  private getAdsURL: string = "Pharmacy/GetAdsOnHome";
  //private getProviderListUrl: string = "Payers/ProviderAvailableListForMobile";
  private getProviderDetailUrl: string = "Home/ProviderProfile?id=";
  private getRatingReviewsUrl: string =
    "ReviewRatings/ReviewRatingByStaffId?id=";
  private getReviewRatingByStaffIdInProfileUrl: string ="ReviewRatings/ReviewRatingByStaffIdInProfile?id=";
  private getAllSubscriptionPlansUrl: string =
    "SubcriptionPlan/GetAllSubscriptionPlans";
  private getProviderLocationsAndAvailibilityDetailUrl: string =
    "Home/GetStaffLocationWithAvailability?id=";
  private checkIsValidAppointmentURL =
    "Home/CheckIsValidAppointmentWithLocation";
  private getOrganizationDetailUrl = "Home/GetOrganizationDetail";
  private getOTSessionUrl: string = "Home/GetOTSession?invitationId=";
  private getAverageRatingDetailUrl: string =
    "ReviewRatings/ReviewRatingAverage?id=";
  private getVideoArchiveDetailUrl: string =
    "Home/GetVideoRecording?archiveId=";
  private getByGlobalCodeIdURL: String =
    "Home/GetMasterServicesByGlobalCodeId?globalCodeId=";
  private getUrgentCareProviderListUrl: string =
    "Home/UrgentCareProviderAvailableList";
  private getsearchtextUrgentCareProviderListUrl: string =
    "Home/SearchTextUrgentCareProviderAvailableList";
  private getSortedUrgentCareProviderListUrl: string =
    "Home/SortedUrgentCareProviderAvailableList";
  private getAllTestimonialURL = "Home/GetAllTestimonial";
  getTopProviderURL: string = "Staffs/GetTopProviders";

  constructor(private http: HttpClient, private commonService: CommonService) {
    //this.loadingStateSubject=this.loadingStateSubject;
  }
  checkLoginState(value: boolean) {
    this.loginSubject.next(value);
  }
  getAllTestimonial(filterModel: FilterModel) {
    let url = `${this.getAllTestimonialURL}?pageNumber=1&pageSize=50&sortColumn=name`;
    return this.commonService.getAll(url, {});
  }
  getMasterData(value: string = "",isLoading: boolean = true,globalCodeId: any[] = []): Observable<any> {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token")|| "",
    });
    isLoading && this.loadingStateSubject.next(true);
    return this.http
      .post<any>(
        `${environment.api_url}/${
          this.getMasterDataUrl + "?globalCodeId=" + globalCodeId
        }`,
        { masterdata: value },
        { headers: headers }
      )
      .pipe(
        map((res) => {
          isLoading && this.loadingStateSubject.next(false);
          return res;
        })
      );

  }
  getProviderList(postData: any, isLoading: boolean = true): Observable<any> {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token")|| "",
    });
    isLoading && this.loadingStateSubject.next(true);
    return this.http
      .post<any>(
        `${environment.api_url}/${this.getProviderListUrl}`,
        postData,
        { headers: headers }
      )
      .pipe(
        map((res) => {
          isLoading && this.loadingStateSubject.next(false);
          return res;
        })
      );
  }
  getLabList(postData: any, isLoading: boolean = true): Observable<any> {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token")|| "",
    });
    isLoading && this.loadingStateSubject.next(true);
    return this.http
      .post<any>(`${environment.api_url}/${this.getLabListUrl}`, postData, {
        headers: headers,
      })
      .pipe(
        map((res) => {
          isLoading && this.loadingStateSubject.next(false);
          return res;
        })
      );
  }
  getRadiologyList(postData: any, isLoading: boolean = true): Observable<any> {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token")|| "",
    });
    isLoading && this.loadingStateSubject.next(true);
    return this.http
      .post<any>(
        `${environment.api_url}/${this.getRadiolodyListUrl}`,
        postData,
        { headers: headers }
      )
      .pipe(
        map((res) => {
          isLoading && this.loadingStateSubject.next(false);
          return res;
        })
      );
  }
  getTopProviders(filterModel: FilterModel) {
    let url: string = `${this.getTopProviderURL}?pageNumber=${filterModel.pageNumber}&pageSize=10&sortColumn=${filterModel.sortColumn}&sortOrder=${filterModel.sortOrder}&searchText=${filterModel.searchText}`;
    return this.commonService.getAll(url, {});
  }
  getPharmacyList(postData: any, isLoading: boolean = true): Observable<any> {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token")|| "",
    });
    isLoading && this.loadingStateSubject.next(true);
    return this.http
      .post<any>(
        `${environment.api_url}/${this.getPharmacyListUrl}`,
        postData,
        { headers: headers }
      )
      .pipe(
        map((res) => {
          isLoading && this.loadingStateSubject.next(false);
          return res;
        })
      );
  }
  getSortProviderList(
    postData: any,
    isLoading: boolean = true
  ): Observable<any> {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token")|| "",
    });
    isLoading && this.loadingStateSubject.next(true);
    return this.http
      .post<any>(
        `${environment.api_url}/${this.getSortedProviderListUrl}`,
        postData,
        { headers: headers }
      )
      .pipe(
        map((res) => {
          isLoading && this.loadingStateSubject.next(false);
          return res;
        })
      );
  }

  getSortLabList(postData: any, isLoading: boolean = true): Observable<any> {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token")!,
    });
    isLoading && this.loadingStateSubject.next(true);
    return this.http
      .post<any>(
        `${environment.api_url}/${this.getSortedProviderListUrl}`,
        postData,
        { headers: headers }
      )
      .pipe(
        map((res) => {
          isLoading && this.loadingStateSubject.next(false);
          return res;
        })
      );
  }
  getSortPharmacyList(
    postData: any,
    isLoading: boolean = true
  ): Observable<any> {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token") || "",
    });
    isLoading && this.loadingStateSubject.next(true);
    return this.http
      .post<any>(
        `${environment.api_url}/${this.getSortedProviderListUrl}`,
        postData,
        { headers: headers }
      )
      .pipe(
        map((res) => {
          isLoading && this.loadingStateSubject.next(false);
          return res;
        })
      );
  }

  getsearchtextProviderList(
    postData: any,
    isLoading: boolean = true
  ): Observable<any> {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token")|| "",
    });
    isLoading && this.loadingStateSubject.next(true);
    return this.http
      .post<any>(
        `${environment.api_url}/${this.getsearchtextProviderListUrl}`,
        postData,
        { headers: headers }
      )
      .pipe(
        map((res) => {
          isLoading && this.loadingStateSubject.next(false);
          return res;
        })
      );
  }

  getsearchtextLabList(
    postData: any,
    isLoading: boolean = true
  ): Observable<any> {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token")!,
    });
    isLoading && this.loadingStateSubject.next(true);
    return this.http
      .post<any>(
        `${environment.api_url}/${this.getsearchtextProviderListUrl}`,
        postData,
        { headers: headers }
      )
      .pipe(
        map((res) => {
          isLoading && this.loadingStateSubject.next(false);
          return res;
        })
      );
  }
  getsearchtextPharmacyList(
    postData: any,
    isLoading: boolean = true
  ): Observable<any> {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token")!,
    });
    isLoading && this.loadingStateSubject.next(true);
    return this.http
      .post<any>(
        `${environment.api_url}/${this.getsearchtextProviderListUrl}`,
        postData,
        { headers: headers }
      )
      .pipe(
        map((res) => {
          isLoading && this.loadingStateSubject.next(false);
          return res;
        })
      );
  }
  getUrgentCareProviderList(
    postData: any,
    isLoading: boolean = true
  ): Observable<any> {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token")!,
    });
    isLoading && this.loadingStateSubject.next(true);
    return this.http
      .post<any>(
        `${environment.api_url}/${this.getUrgentCareProviderListUrl}`,
        postData,
        { headers: headers }
      )
      .pipe(
        map((res) => {
          isLoading && this.loadingStateSubject.next(false);
          return res;
        })
      );
  }

  getsearchtextUrgentCareProviderList(
    postData: any,
    isLoading: boolean = true
  ): Observable<any> {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token") || "",
    });
    isLoading && this.loadingStateSubject.next(true);
    return this.http
      .post<any>(
        `${environment.api_url}/${this.getsearchtextUrgentCareProviderListUrl}`,
        postData,
        { headers: headers }
      )
      .pipe(
        map((res) => {
          isLoading && this.loadingStateSubject.next(false);
          return res;
        })
      );
  }

  getSortUrgentCareProviderList(
    postData: any,
    isLoading: boolean = true
  ): Observable<any> {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token")|| "",
    });
    isLoading && this.loadingStateSubject.next(true);
    return this.http
      .post<any>(
        `${environment.api_url}/${this.getSortedUrgentCareProviderListUrl}`,
        postData,
        { headers: headers }
      )
      .pipe(
        map((res) => {
          isLoading && this.loadingStateSubject.next(false);
          return res;
        })
      );
  }
  getAdsHome(isLoading: boolean = true): Observable<any> {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token")|| "",
    });
    isLoading && this.loadingStateSubject.next(true);
    return this.http
      .get<any>(`${environment.api_url}/${this.getAdsURL}`, {
        headers: headers,
      })
      .pipe(
        map((res) => {
          isLoading && this.loadingStateSubject.next(false);
          return res;
        })
      );
  }

  getProviderDetail(id: string, isLoading: boolean = true): Observable<any> {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token")|| "",
    });
    isLoading && this.loadingStateSubject.next(true);
    return this.http
      .get<any>(`${environment.api_url}/${this.getProviderDetailUrl}${id}`, {
        headers: headers,
      })
      .pipe(
        map((res) => {
          isLoading && this.loadingStateSubject.next(false);
          return res;
        })
      );
  }
  getAverageRating(id: string, isLoading: boolean = true): Observable<any> {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token")|| "",
    });
    isLoading && this.loadingStateSubject.next(true);
    return this.http
      .get<any>(
        `${environment.api_url}/${this.getAverageRatingDetailUrl}${id}`,
        {
          headers: headers,
        }
      )
      .pipe(
        map((res) => {
          isLoading && this.loadingStateSubject.next(false);
          return res;
        })
      );
  }
  getProviderLocationAndAvailibilityDetail(
    id: string,
    isLoading: boolean = true
  ): Observable<any> {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token")|| "",
    });
    isLoading && this.loadingStateSubject.next(true);
    return this.http
      .get<any>(
        `${environment.api_url}/${this.getProviderLocationsAndAvailibilityDetailUrl}${id}`,
        {
          headers: headers,
        }
      )
      .pipe(
        map((res) => {
          isLoading && this.loadingStateSubject.next(false);
          return res;
        })
      );
  }
  checkIsValidAppointment(
    appointmentData: any,
    isLoading: boolean = true
  ): Observable<any> {
    const postJson = appointmentData;
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token")|| "",
    });
    isLoading && this.loadingStateSubject.next(true);
    return this.http
      .post<any>(
        `${environment.api_url}/${this.checkIsValidAppointmentURL}`,
        postJson,
        {
          headers: headers,
        }
      )
      .pipe(
        map((res) => {
          isLoading && this.loadingStateSubject.next(false);
          return res;
        })
      );
  }

  getOrganizationDetail(isLoading: boolean = true): Observable<any> {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token")|| "",
    });
    isLoading && this.loadingStateSubject.next(true);
    return this.http
      .get<any>(`${environment.api_url}/${this.getOrganizationDetailUrl}`, {
        headers: headers,
      })
      .pipe(
        map((res) => {
          isLoading && this.loadingStateSubject.next(false);
          return res;
        })
      );
  }

  getOTSessionDetail(
    invitationId: string,
    isLoading: boolean = true
  ): Observable<any> {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token")|| "",
    });
    isLoading && this.loadingStateSubject.next(true);
    return this.http
      .get<any>(
        `${environment.api_url}/${this.getOTSessionUrl}${invitationId}`,
        {
          headers: headers,
        }
      )
      .pipe(
        map((res) => {
          isLoading && this.loadingStateSubject.next(false);
          return res;
        })
      );
  }


  getRatingReviews(
    id: string,
    isLoading: boolean = true,
    pageNumber: number,
    pageSize: number
  ): Observable<any> {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token")|| "",
    });
    isLoading && this.loadingStateSubject.next(true);
    return this.http
      .get<any>(
        `${environment.api_url}/${this.getRatingReviewsUrl}${id}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
        {
          headers: headers,
        }
      )
      .pipe(
        map((res) => {
          isLoading && this.loadingStateSubject.next(false);
          return res;
        })
      );
  }

  getRatingReviewsInProfile(
    id: string,
    isLoading: boolean = true,
    pageNumber: number,
    pageSize: number
  ): Observable<any> {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token")|| "",
    });
    isLoading && this.loadingStateSubject.next(true);
    return this.http
      .get<any>(
        `${environment.api_url}/${this.getReviewRatingByStaffIdInProfileUrl}${id}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
        {
          headers: headers,
        }
      )
      .pipe(
        map((res) => {
          isLoading && this.loadingStateSubject.next(false);
          return res;
        })
      );
  }

  getVideoArchiveDetail(
    archiveId: string = "",
    isLoading: boolean = true
  ): Observable<any> {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token")|| "",
    });
    isLoading && this.loadingStateSubject.next(true);
    return this.http
      .get<any>(
        `${environment.api_url}/${this.getVideoArchiveDetailUrl}${archiveId}`,
        {
          headers: headers,
        }
      )
      .pipe(
        map((res) => {
          isLoading && this.loadingStateSubject.next(false);
          return res;
        })
      );
  }

  getAllSubscriptionPlans(isLoading: boolean = true) {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token")|| "",
    });
    isLoading && this.loadingStateSubject.next(true);
    return this.http
      .get<any>(
        `${environment.api_url}/${this.getAllSubscriptionPlansUrl}`,
        // postData,
        { headers: headers }
      )
      .pipe(
        map((res) => {
          isLoading && this.loadingStateSubject.next(false);
          return res;
        })
      );
  }
}
