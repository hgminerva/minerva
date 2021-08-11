import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { environment } from "../../environments/environment"

import { ProviderAffiliationModel } from '../Models/provider-affiliation.model';
import { ProviderAffiliationPagedModel } from '../Models/provider-affiliation-paged.model';
import { ProviderAffiliationPagedParamModel } from '../Models/provider-affiliation-paged-param.model';
import { PaginationModel } from '../Models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class ProviderAffiliationService {
  
  api_url: string = environment.api_url;
  options: any = { headers: new HttpHeaders({ 
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }) };

  constructor(
    private http: HttpClient
  ) { }

  public getProviderAffiliations(param: ProviderAffiliationPagedParamModel): Observable<ProviderAffiliationPagedModel> {
    const o = new Observable<ProviderAffiliationPagedModel>(observer => {
      
      let providerAffiliationPaged: ProviderAffiliationPagedModel = {
        provider_affiliations: [],
        pagination: new PaginationModel(),
        page_datail: []
      };

      let format_param = Object.keys(param).map(key => key + '=' + param[key]).join('&');

      this.http.get(this.api_url + "/provider-affiliations?" + format_param, this.options).subscribe( response => {
        if (response != null) {

          providerAffiliationPaged.page_datail = response["meta"]
          providerAffiliationPaged.pagination.first = response["links"]["first"] != null ? response["links"]["first"].split('?')[1] : null;
          providerAffiliationPaged.pagination.prev = response["links"]["prev"] != null ? response["links"]["prev"].split('?')[1] : null;
          providerAffiliationPaged.pagination.next = response["links"]["next"] != null ? response["links"]["next"].split('?')[1] : null;
          providerAffiliationPaged.pagination.last = response["links"]["last"] != null ? response["links"]["last"].split('?')[1] : null;
          
          let data = response["data"];
          if (data["length"] > 0) {
            let providerAffiliations: ProviderAffiliationModel[] = [];
            for (let i = 0; i <= data["length"] - 1; i++) {
              providerAffiliations.push({
                id: data[i].id,
                provider_id: data[i].provider_id,
                provider: data[i].provider,
                facility_id: data[i].facility_id,
                facility: data[i].facility,
                primary: data[i].primary
              });
            }
            providerAffiliationPaged.provider_affiliations = providerAffiliations;
          }

          observer.next(providerAffiliationPaged);
          observer.complete();
        } else {
          observer.next(providerAffiliationPaged);
          observer.complete();
        }
      });

    });

    return o;
  }

  public getProviderAffiliationsByProviderId(provider_id: number, param: ProviderAffiliationPagedParamModel): Observable<ProviderAffiliationPagedModel> {
    const o = new Observable<ProviderAffiliationPagedModel>(observer => {
      
      let providerAffiliationPaged: ProviderAffiliationPagedModel = {
        provider_affiliations: [],
        pagination: new PaginationModel(),
        page_datail: []
      };

      let format_param = Object.keys(param).map(key => key + '=' + param[key]).join('&');

      this.http.get(this.api_url + "/provider-affiliations/provider/" + provider_id + "?" + format_param, this.options).subscribe( response => {
        if (response != null) {

          providerAffiliationPaged.page_datail = response["meta"]
          providerAffiliationPaged.pagination.first = response["links"]["first"] != null ? response["links"]["first"].split('?')[1] : null;
          providerAffiliationPaged.pagination.prev = response["links"]["prev"] != null ? response["links"]["prev"].split('?')[1] : null;
          providerAffiliationPaged.pagination.next = response["links"]["next"] != null ? response["links"]["next"].split('?')[1] : null;
          providerAffiliationPaged.pagination.last = response["links"]["last"] != null ? response["links"]["last"].split('?')[1] : null;
          
          let data = response["data"];
          if (data["length"] > 0) {
            let providerAffiliations: ProviderAffiliationModel[] = [];
            for (let i = 0; i <= data["length"] - 1; i++) {
              providerAffiliations.push({
                id: data[i].id,
                provider_id: data[i].provider_id,
                provider: data[i].provider,
                facility_id: data[i].facility_id,
                facility: data[i].facility,
                primary: data[i].primary
              });
            }
            providerAffiliationPaged.provider_affiliations = providerAffiliations;
          }

          observer.next(providerAffiliationPaged);
          observer.complete();
        } else {
          observer.next(providerAffiliationPaged);
          observer.complete();
        }
      });

    });

    return o;
  }

  public getProviderAffiliation(id: number): Observable<ProviderAffiliationModel> {
    let providerAffiliationModel: ProviderAffiliationModel = new ProviderAffiliationModel();
    const o = new Observable<ProviderAffiliationModel>(observer => {
      this.http.put<any>(this.api_url + "/provider-affiliations/" + id, this.options).subscribe(
        response => {
          if(response) {
           let data= response.data;

           providerAffiliationModel.id = data.id;
           providerAffiliationModel.provider = data.provider;
           providerAffiliationModel.provider_id = data.provider_id;
           providerAffiliationModel.facility = data.facility;
           providerAffiliationModel.facility_id = data.facility_id;
           providerAffiliationModel.primary = data.primary;

            observer.next(providerAffiliationModel);
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

  public updateProviderAffiliation(providerAffiliationModel: ProviderAffiliationModel): Observable<[boolean, string]> {
    return new Observable<[boolean, string]>((observer) => {
      this.http.put(this.api_url + "/provider-affiliations/" + providerAffiliationModel.id, JSON.stringify(providerAffiliationModel), this.options).subscribe(
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

  public addProviderAffiliation(providerAffiliationModel: ProviderAffiliationModel): Observable<[boolean, string]> {
    return new Observable<[boolean, string]>((observer) => {
      this.http.post(this.api_url + "/provider-affiliations", JSON.stringify(providerAffiliationModel), this.options).subscribe(
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

  public deleteProviderAffiliation(id: number): Observable<[boolean, string]> {
    return new Observable<[boolean, string]>((observer) => {
      this.http.delete(this.api_url + "/provider-affiliations/" + id, this.options).subscribe(
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
