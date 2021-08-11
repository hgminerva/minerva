import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { environment } from "../../environments/environment"

import { SelectionCodeModel } from '../Models/selection-code.model';
import { SelectionCodePagedModel } from '../Models/selection-code-paged.model';
import { SelectionCodePagedParamModel } from '../Models/selection-code-paged-param.model';
import { PaginationModel } from '../Models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class SelectionCodeService {
  
  api_url: string = environment.api_url;
  options: any = { headers: new HttpHeaders({ 
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }) };

  constructor(
    private http: HttpClient
  ) { }

  public getSelectionCodes(param: SelectionCodePagedParamModel): Observable<SelectionCodePagedModel> {
    const o = new Observable<SelectionCodePagedModel>(observer => {
      
      let selectionCodePaged: SelectionCodePagedModel = {
        selection_codes: [],
        pagination: new PaginationModel(),
        page_datail: []
      };

      let format_param = Object.keys(param).map(key => key + '=' + param[key]).join('&');

      this.http.get(this.api_url + "/selection-codes?" + format_param, this.options).subscribe( response => {
        if (response != null) {

          selectionCodePaged.page_datail = response["meta"]
          selectionCodePaged.pagination.first = response["links"]["first"] != null ? response["links"]["first"].split('?')[1] : null;
          selectionCodePaged.pagination.prev = response["links"]["prev"] != null ? response["links"]["prev"].split('?')[1] : null;
          selectionCodePaged.pagination.next = response["links"]["next"] != null ? response["links"]["next"].split('?')[1] : null;
          selectionCodePaged.pagination.last = response["links"]["last"] != null ? response["links"]["last"].split('?')[1] : null;
          
          let data = response["data"];
          if (data["length"] > 0) {
            let selection_codes: SelectionCodeModel[] = [];
            for (let i = 0; i <= data["length"] - 1; i++) {
              selection_codes.push({
                id: data[i].id,
                code: data[i].code,
                value: data[i].value,
                category: data[i].category
              });
            }
            selectionCodePaged.selection_codes = selection_codes;
          }

          observer.next(selectionCodePaged);
          observer.complete();
        } else {
          observer.next(selectionCodePaged);
          observer.complete();
        }
      });

    });

    return o;
  }

  public getSelectionCodesByCategory(category: string): Observable<SelectionCodeModel[]> {
    const o = new Observable<SelectionCodeModel[]>(observer => {
      this.http.get(this.api_url + "/selection-codes/category/" + category, this.options).subscribe( response => {
        let selection_codes: SelectionCodeModel[] = [];

        if (response != null) {
          let data = response["data"];
          if (data["length"] > 0) {
            for (let i = 0; i <= data["length"] - 1; i++) {
              selection_codes.push({
                id: data[i].id,
                code: data[i].code,
                value: data[i].npi,
                category: data[i].npi
              });
            }
          }

          observer.next(selection_codes);
          observer.complete();
        } else {
          observer.next(selection_codes);
          observer.complete();
        }
      });

    });

    return o;
  }

  public getSelectionCode(id: number): Observable<SelectionCodeModel> {
    let selectionCodeModel: SelectionCodeModel = new SelectionCodeModel();
    const o = new Observable<SelectionCodeModel>(observer => {
      this.http.get<any>(this.api_url + "/selection-codes/" + id, this.options).subscribe(
        response => {
          if(response) {
           let data= response["data"];

           selectionCodeModel.id = data.id;
           selectionCodeModel.code = data.code;
           selectionCodeModel.value = data.value;
           selectionCodeModel.category = data.category;

            observer.next(selectionCodeModel);
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

  public updateSelectionCode(selectionCodeModel: SelectionCodeModel): Observable<[boolean, string]> {
    return new Observable<[boolean, string]>((observer) => {
      this.http.put(this.api_url + "/selection-codes/" + selectionCodeModel.id, JSON.stringify(selectionCodeModel), this.options).subscribe(
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

  public addSelectionCode(selectionCodeModel: SelectionCodeModel): Observable<[boolean, string]> {
    return new Observable<[boolean, string]>((observer) => {
      this.http.post(this.api_url + "/selection-codes", JSON.stringify(selectionCodeModel), this.options).subscribe(
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

  public deleteSelectionCode(id: number): Observable<[boolean, string]> {
    return new Observable<[boolean, string]>((observer) => {
      this.http.delete(this.api_url + "/selection-codes/" + id, this.options).subscribe(
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
