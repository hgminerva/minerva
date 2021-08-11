import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { environment } from "../../environments/environment"

import { FacilityModel } from '../Models/facility.model';
import { FacilityPagedModel } from '../Models/facility-paged.model';
import { FacilityPagedParamModel } from '../Models/facility-paged-param.model';
import { PaginationModel } from '../Models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class FacilityService {
  
  api_url: string = environment.api_url;
  options: any = { headers: new HttpHeaders({ 
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }) };

  constructor(
    private http: HttpClient
  ) { }

  public getFacilities(param: FacilityPagedParamModel): Observable<FacilityPagedModel> {
    const o = new Observable<FacilityPagedModel>(observer => {
      
      let facilityPaged: FacilityPagedModel = {
        facilities: [],
        pagination: new PaginationModel(),
        page_datail: []
      };

      let format_param = Object.keys(param).map(key => key + '=' + param[key]).join('&');

      this.http.get(this.api_url + "/facilities?" + format_param, this.options).subscribe( response => {
        if (response != null) {

          facilityPaged.page_datail = response["meta"]
          facilityPaged.pagination.first = response["links"]["first"] != null ? response["links"]["first"].split('?')[1] : null;
          facilityPaged.pagination.prev = response["links"]["prev"] != null ? response["links"]["prev"].split('?')[1] : null;
          facilityPaged.pagination.next = response["links"]["next"] != null ? response["links"]["next"].split('?')[1] : null;
          facilityPaged.pagination.last = response["links"]["last"] != null ? response["links"]["last"].split('?')[1] : null;
          
          let data = response["data"];
          if (data["length"] > 0) {
            let facilities: FacilityModel[] = [];
            for (let i = 0; i <= data["length"] - 1; i++) {
              facilities.push({
                id: data[i].id,
                facility_number: data[i].facility_number,
                facility: data[i].facility,
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
            facilityPaged.facilities = facilities;
          }

          observer.next(facilityPaged);
          observer.complete();
        } else {
          observer.next(facilityPaged);
          observer.complete();
        }
      });

    });

    return o;
  }

  public getFacility(id: number): Observable<FacilityModel> {
    let facilityModel: FacilityModel = new FacilityModel();
    const o = new Observable<FacilityModel>(observer => {
      this.http.get<any>(this.api_url + "/facilities/" + id, this.options).subscribe(
        response => {
          if(response) {
           let data= response['data'];

           facilityModel.id = data.id;
           facilityModel.facility_number = data.facility_number;
           facilityModel.facility = data.facility;
           facilityModel.address1 = data.address1;
           facilityModel.address2 = data.address2;
           facilityModel.city = data.city;
           facilityModel.state = data.state;
           facilityModel.phone1 = data.phone1;
           facilityModel.phone2 = data.phone2;
           facilityModel.fax = data.fax;
           facilityModel.web_url = data.web_url;

            observer.next(facilityModel);
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

  public updateFacility(facilityModel: FacilityModel): Observable<[boolean, string]> {
    return new Observable<[boolean, string]>((observer) => {
      this.http.put(this.api_url + "/facilities/" + facilityModel.id, JSON.stringify(facilityModel), this.options).subscribe(
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

  public addFacility(facilityModel: FacilityModel): Observable<[boolean, string]> {
    return new Observable<[boolean, string]>((observer) => {
      this.http.post(this.api_url + "/facilities", JSON.stringify(facilityModel), this.options).subscribe(
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

  public deleteFacility(id: number): Observable<[boolean, string]> {
    return new Observable<[boolean, string]>((observer) => {
      this.http.delete(this.api_url + "/facilities/" + id, this.options).subscribe(
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
