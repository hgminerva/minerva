import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { environment } from "../../environments/environment"

import { ProviderModel } from '../Models/provider.model';
import { ProviderPagedModel } from '../Models/provider-paged.model';
import { ProviderPagedParamModel } from '../Models/provider-paged-param.model';
import { PaginationModel } from '../Models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  
  api_url: string = environment.api_url;
  storage_url: string = environment.storage_url;
  options: any = { headers: new HttpHeaders({ 
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }) };
  image_options: any = { headers: new HttpHeaders({ 
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }) };

  constructor(
    private http: HttpClient
  ) { }

  public getProviders(param: ProviderPagedParamModel): Observable<ProviderPagedModel> {
    const o = new Observable<ProviderPagedModel>(observer => {
      
      let providerPaged: ProviderPagedModel = {
        providers: [],
        pagination: new PaginationModel(),
        page_datail: []
      };

      let format_param = Object.keys(param).map(key => key + '=' + param[key]).join('&');

      this.http.get(this.api_url + "/providers?" + format_param, this.options).subscribe( response => {
        if (response != null) {

          providerPaged.page_datail = response["meta"]
          providerPaged.pagination.first = response["links"]["first"] != null ? response["links"]["first"].split('?')[1] : null;
          providerPaged.pagination.prev = response["links"]["prev"] != null ? response["links"]["prev"].split('?')[1] : null;
          providerPaged.pagination.next = response["links"]["next"] != null ? response["links"]["next"].split('?')[1] : null;
          providerPaged.pagination.last = response["links"]["last"] != null ? response["links"]["last"].split('?')[1] : null;
          
          let data = response["data"];
          if (data["length"] > 0) {
            let providers: ProviderModel[] = [];
            for (let i = 0; i <= data["length"] - 1; i++) {
              providers.push({
                id: data[i].id,
                provider_number: data[i].provider_number,
                npi: data[i].npi,
                first_name: data[i].first_name,
                middle_name: data[i].middle_name,
                last_name: data[i].last_name,
                extension_name: data[i].extension_name,
                qualifications: data[i].qualifications,
                gender: data[i].gender,
                main_phone: data[i].main_phone,
                direct_dial: data[i].direct_dial,
                fax: data[i].fax,
                email: data[i].email,
                web_url: data[i].web_url,
                facility_id: data[i].facility_id,
                facility: data[i].facility,
                profession: data[i].profession,
                speciality1: data[i].speciality1,
                speciality2: data[i].speciality2,
                title1: data[i].title1,
                title2: data[i].title2,
                title3: data[i].title3,
                title4: data[i].title4,
                title5: data[i].title5,
                status: data[i].status,
                date_last_modified: data[i].date_last_modified,
                modified_by: data[i].modified_by,
                image_url: data[i].image_url
              });
            }
            providerPaged.providers = providers;
          }

          observer.next(providerPaged);
          observer.complete();
        } else {
          observer.next(providerPaged);
          observer.complete();
        }
      });

    });

    return o;
  }

  public getProvider(id: number): Observable<ProviderModel> {
    let providerModel: ProviderModel = new ProviderModel();
    const o = new Observable<ProviderModel>(observer => {
      this.http.get<any>(this.api_url + "/providers/" + id, this.options).subscribe(
        response => {
          if(response) {
           let data= response["data"];

           providerModel.id = data.id;
           providerModel.provider_number = data.provider_number;
           providerModel.npi = data.npi;
           providerModel.first_name = data.first_name;
           providerModel.middle_name = data.middle_name;
           providerModel.last_name = data.last_name;
           providerModel.extension_name = data.extension_name;
           providerModel.qualifications = data.qualifications;
           providerModel.gender = data.gender;
           providerModel.main_phone = data.main_phone;
           providerModel.direct_dial = data.direct_dial;
           providerModel.fax = data.fax;
           providerModel.email = data.email;
           providerModel.web_url = data.web_url;
           providerModel.facility_id = data.facility_id;
           providerModel.facility = data.facility;
           providerModel.profession = data.profession;
           providerModel.speciality1 = data.speciality1;
           providerModel.speciality2 = data.speciality2;
           providerModel.title1 = data.title1;
           providerModel.title2 = data.title2;
           providerModel.title3 = data.title3;
           providerModel.title4 = data.title4;
           providerModel.title5 = data.title5;
           providerModel.status = data.status;
           providerModel.date_last_modified = data.date_last_modified;
           providerModel.modified_by = data.modified_by;
           providerModel.image_url = data.image_url;

            observer.next(providerModel);
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

  public updateProvider(providerModel: ProviderModel): Observable<[boolean, string]> {
    return new Observable<[boolean, string]>((observer) => {
      this.http.put(this.api_url + "/providers/" + providerModel.id, JSON.stringify(providerModel), this.options).subscribe(
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

  public addProvider(providerModel: ProviderModel): Observable<[boolean, string]> {
    return new Observable<[boolean, string]>((observer) => {
      this.http.post(this.api_url + "/providers", JSON.stringify(providerModel), this.options).subscribe(
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

  public deleteProvider(id: number): Observable<[boolean, string]> {
    return new Observable<[boolean, string]>((observer) => {
      this.http.delete(this.api_url + "/providers/" + id, this.options).subscribe(
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

  public uploadImage(file: File, fileName: string) {

    var formData: FormData = new FormData();
    formData.append('image', file);

    return new Observable<any>((observer) => {
      this.http.post(this.api_url + "/providers/image/upload", formData, this.image_options).subscribe(
        response => {
          var data = response["url"];

          var n = data.lastIndexOf('/');
          var result = data.substring(n + 1);

          observer.next([true,this.storage_url + "/storage/images/" + result]);
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
