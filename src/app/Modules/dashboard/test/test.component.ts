import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ToastrService } from 'ngx-toastr';

import { UrlDetailComponent } from './url-detail/url-detail.component';

import { UrlQueryModel } from '../../../Models/url-query.model';
import { UrlHeaderModel } from '../../../Models/url-header.model';
import { UrlModel } from '../../../Models/url.model';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  stillProcessing: boolean = false;

  urlDataSource: MatTableDataSource<UrlModel>;
  urlData: UrlModel[] = [
    {type:'GET', url:'https://fir-realtime-db-sample-6856c.firebaseio.com/products/-MCfzHI8zxl8m-6p5a6w.json',queries:null,headers:null,auth_type:null,auth_value:null,body:null},
    {type:'GET', url:'https://fir-realtime-db-sample-6856c.firebaseio.com/categories/-MCfyFwdqEa0ZyXkN6Y0.json',queries:null,headers:null,auth_type:null,auth_value:null,body:null},
  ];
  urlDataColumns: string[] = [
    'id',
    'type',
    'url'
  ];

  urlModel: UrlModel;

  users:number =  5;
  iterations: number = 1;

  urls: any = [];

  constructor(
    private urlDialog: MatDialog,
    private http: HttpClient
  ) { }

  getUrls(): void {
    this.urlDataSource = new MatTableDataSource(this.urlData);
  }

  buttonAdd(): void {
    this.urlModel = new UrlModel();
    const openDialog = this.urlDialog.open(UrlDetailComponent, {
      width: '400px',
      data: {
        dataType: "SAVE",
        urlModel: this.urlModel
      },
      disableClose: true
    });

    openDialog.afterClosed().subscribe(result => {
      if (result == "SAVE") {
        this.urlData.push(this.urlModel);
        this.getUrls();
      }  else {
      } 
    });
  }
  buttonImport(): void {
    
  }
  buttonExport(): void {
    
  }
  buttonRunTest(): void {
    this.urls = [];
    for(let u=0;u<this.users;u++) {
      for(let i=0;i<this.urlData.length;i++) {
        this.urls.push({user: u+1, url: this.urlData[i].url, status: null,time_in:new Date, total_seconds: 0})
      }
    }

    for(let i=0;i<this.urls.length;i++) {
      this.executeTest(this.urls[i].url).subscribe(event => {
        if (event.type === HttpEventType.DownloadProgress) {
          this.urls[i].time_in = new Date();
          this.urls[i].status = "on-going";
        }
        if (event.type === HttpEventType.Response) {
          let endDate = new Date();
          this.urls[i].total_seconds = (endDate.getTime()-this.urls[i].time_in.getTime()) / 1000;
          this.urls[i].status = "completed";
        }      
      })
    }
  }
  executeTest(url: string): Observable<HttpEvent<any>> {
    return this.http.get( url , { responseType: "json", reportProgress: true, observe: "events", headers: new HttpHeaders() } );
  }

  editRow(row: UrlModel): void {
    this.urlModel = row;
    const openDialog = this.urlDialog.open(UrlDetailComponent, {
      width: '400px',
      data: {
        dataType: "UPDATE",
        urlModel: this.urlModel
      },
      disableClose: true
    });

    openDialog.afterClosed().subscribe(result => {
      if (result == "UPDATE") {
        this.getUrls();
      }  else {
      } 
    });
  }

  ngOnInit(): void {
    this.getUrls();
  }

}
