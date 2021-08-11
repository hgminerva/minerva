import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { environment } from "../../environments/environment"

import { ProviderOfficeModel } from '../Models/provider-office.model';
import { ProviderOfficePagedModel } from '../Models/provider-office-paged.model';
import { ProviderOfficePagedParamModel } from '../Models/provider-office-paged-param.model';
import { PaginationModel } from '../Models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class ProviderOfficeService {
  
  api_url: string = environment.api_url;
  options: any = { headers: new HttpHeaders({ 
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }) };

  constructor(
    private http: HttpClient
  ) { }

  public getProviderOffices(param: ProviderOfficePagedParamModel): Observable<ProviderOfficePagedModel> {
    const o = new Observable<ProviderOfficePagedModel>(observer => {
      
      let providerOfficePaged: ProviderOfficePagedModel = {
        provider_offices: [],
        pagination: new PaginationModel(),
        page_datail: []
      };

      let format_param = Object.keys(param).map(key => key + '=' + param[key]).join('&');

      this.http.get(this.api_url + "/provider-offices?" + format_param, this.options).subscribe( response => {
        if (response != null) {

          providerOfficePaged.page_datail = response["meta"]
          providerOfficePaged.pagination.first = response["links"]["first"] != null ? response["links"]["first"].split('?')[1] : null;
          providerOfficePaged.pagination.prev = response["links"]["prev"] != null ? response["links"]["prev"].split('?')[1] : null;
          providerOfficePaged.pagination.next = response["links"]["next"] != null ? response["links"]["next"].split('?')[1] : null;
          providerOfficePaged.pagination.last = response["links"]["last"] != null ? response["links"]["last"].split('?')[1] : null;
          
          let data = response["data"];
          if (data["length"] > 0) {
            let providerOffices: ProviderOfficeModel[] = [];
            for (let i = 0; i <= data["length"] - 1; i++) {
              providerOffices.push({
                id: data[i].id,
                provider_id: data[i].provider_id,
                provider: data[i].provider,
                office: data[i].office,
                office_contact: data[i].office_contact,
                address1: data[i].address1,
                address2: data[i].address2,
                city: data[i].city,
                state: data[i].state,
                phone1: data[i].phone1,
                phone2: data[i].phone2,
                fax: data[i].fax,
                web_url: data[i].web_url
              });
            }
            providerOfficePaged.provider_offices = providerOffices;
          }

          observer.next(providerOfficePaged);
          observer.complete();
        } else {
          observer.next(providerOfficePaged);
          observer.complete();
        }
      });

    });

    return o;
  }

  public getProviderOfficesByProviderId(provider_id: number, param: ProviderOfficePagedParamModel): Observable<ProviderOfficePagedModel> {
    const o = new Observable<ProviderOfficePagedModel>(observer => {
      
      let providerOfficePaged: ProviderOfficePagedModel = {
        provider_offices: [],
        pagination: new PaginationModel(),
        page_datail: []
      };

      let format_param = Object.keys(param).map(key => key + '=' + param[key]).join('&');

      this.http.get(this.api_url + "/provider-offices/provider/" + provider_id + "?" + format_param, this.options).subscribe( response => {
        if (response != null) {

          providerOfficePaged.page_datail = response["meta"]
          providerOfficePaged.pagination.first = response["links"]["first"] != null ? response["links"]["first"].split('?')[1] : null;
          providerOfficePaged.pagination.prev = response["links"]["prev"] != null ? response["links"]["prev"].split('?')[1] : null;
          providerOfficePaged.pagination.next = response["links"]["next"] != null ? response["links"]["next"].split('?')[1] : null;
          providerOfficePaged.pagination.last = response["links"]["last"] != null ? response["links"]["last"].split('?')[1] : null;
          
          let data = response["data"];
          if (data["length"] > 0) {
            let providerOffices: ProviderOfficeModel[] = [];
            for (let i = 0; i <= data["length"] - 1; i++) {
              providerOffices.push({
                id: data[i].id,
                provider_id: data[i].provider_id,
                provider: data[i].provider,
                office: data[i].office,
                office_contact: data[i].office_contact,
                address1: data[i].address1,
                address2: data[i].address2,
                city: data[i].city,
                state: data[i].state,
                phone1: data[i].phone1,
                phone2: data[i].phone2,
                fax: data[i].fax,
                web_url: data[i].web_url
              });
            }
            providerOfficePaged.provider_offices = providerOffices;
          }

          observer.next(providerOfficePaged);
          observer.complete();
        } else {
          observer.next(providerOfficePaged);
          observer.complete();
        }
      });

    });

    return o;
  }

  public getProviderOffice(id: number): Observable<ProviderOfficeModel> {
    let providerOfficeModel: ProviderOfficeModel = new ProviderOfficeModel();
    const o = new Observable<ProviderOfficeModel>(observer => {
      this.http.put<any>(this.api_url + "/provider-offices/" + id, this.options).subscribe(
        response => {
          if(response) {
           let data= response.data;

           providerOfficeModel.id = data.id;
           providerOfficeModel.office = data.office;
           providerOfficeModel.office_contact = data.office_contact;
           providerOfficeModel.address1 = data.address1;
           providerOfficeModel.address2 = data.address2;
           providerOfficeModel.city = data.city;
           providerOfficeModel.state = data.state;
           providerOfficeModel.phone1 = data.phone1;
           providerOfficeModel.phone2 = data.phone2;
           providerOfficeModel.fax = data.fax;
           providerOfficeModel.web_url = data.web_url;

            observer.next(providerOfficeModel);
            observer.complete();
          } else {
            observer.next(null);
            observer.complete();
          }
        },
        error => {
          observer.next(null);
          observer.complete();
        }
      );
    });
    return o;
  }

  public updateProviderOffice(providerOfficeModel: ProviderOfficeModel): Observable<[boolean, string]> {
    return new Observable<[boolean, string]>((observer) => {
      this.http.put(this.api_url + "/provider-offices/" + providerOfficeModel.id, JSON.stringify(providerOfficeModel), this.options).subscribe(
        response => {
          observer.next([true, "Success"]);
          observer.complete();
        },
        error => {
          observer.next([false, error.error]);
          observer.complete();
        }
      );
    });
  }

  public addProviderOffice(providerOfficeModel: ProviderOfficeModel): Observable<[boolean, string]> {
    return new Observable<[boolean, string]>((observer) => {
      this.http.post(this.api_url + "/provider-offices", JSON.stringify(providerOfficeModel), this.options).subscribe(
        response => {
          observer.next([true, "Success"]);
          observer.complete();
        },
        error => {
          observer.next([false, error.error]);
          observer.complete();
        }
      );
    });
  }

  public deleteProviderOffice(id: number): Observable<[boolean, string]> {
    return new Observable<[boolean, string]>((observer) => {
      this.http.delete(this.api_url + "/provider-offices/" + id, this.options).subscribe(
        response => {
          observer.next([true, "Success"]);
          observer.complete();
        },
        error => {
          observer.next([false, error.error]);
          observer.complete();
        }
      );
    });
  }

}
