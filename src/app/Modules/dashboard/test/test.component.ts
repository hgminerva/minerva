import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ToastrService } from 'ngx-toastr';

import { UrlDetailComponent } from './url-detail/url-detail.component';

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
    {
      type:'GET', 
      url:'https://gorest.co.in/public/v1/users',
      queries:null,
      headers: '{"Accept": "application/json", "Content-Type":"application/json" }',
      auth:null,
      body:null
    },
    {
      type:'POST', 
      url:'https://gorest.co.in/public/v1/users',
      queries:null,
      headers: '{"Accept": "application/json", "Content-Type":"application/json", "Authorization": "Bearer d7344c4dfd99ead02dd46e6cf0ef8e2eafaaa9e472b7fa970b46b85b3c7dd55b" }',
      auth:null,
      body:'{"name":"Richard Gomez", "gender":"male", "email":"richard@gmail.com", "status":"active"}'
    },
    {
      type:'PUT', 
      url:'https://gorest.co.in/public/v1/users/1426',
      queries:null,
      headers: '{"Accept": "application/json", "Content-Type":"application/json", "Authorization": "Bearer d7344c4dfd99ead02dd46e6cf0ef8e2eafaaa9e472b7fa970b46b85b3c7dd55b" }',
      auth:null,
      body:'{"name":"Richard Gomez", "gender":"male", "email":"richard@gmail.com", "status":"active"}'
    },
    {
      type:'DELETE', 
      url:'https://gorest.co.in/public/v1/users/123',
      queries:null,
      headers: '{"Accept": "application/json", "Content-Type":"application/json", "Authorization": "Bearer d7344c4dfd99ead02dd46e6cf0ef8e2eafaaa9e472b7fa970b46b85b3c7dd55b" }',
      auth:null,
      body:null
    },
  ];
  urlDataColumns: string[] = [
    'id',
    'type',
    'url'
  ];


  urlModel: UrlModel;

  running: boolean = false;
  start_running_label: string = "Run Test";
  timerRef: any;
  timerCounter: number = 0;

  users:number =  5;
  duration: number = 5;
  ramp: number = 1;

  urls: any = [];

  constructor(
    private urlDialog: MatDialog,
    private http: HttpClient,
    private toastr: ToastrService,
  ) { }

  getUrls(): void {
    this.urlDataSource = new MatTableDataSource(this.urlData);
  }

  buttonAdd(): void {
    this.urlModel = new UrlModel();

    this.urlModel.type = 'GET';

    const openDialog = this.urlDialog.open(UrlDetailComponent, {
      width: '500px',
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
    this.running = !this.running;
    if(this.running) {
      let batch: number = 0;
      let batch_counter: number = 0;
      let number_of_users_per_batch: number = 0;

      batch = this.duration / this.ramp;
      number_of_users_per_batch = this.users / batch;

      if(this.ramp > 0 && batch > 0 && this.duration % this.ramp == 0 && this.users % batch == 0)  {
        this.urls = [];
        const startTime = Date.now() - (this.timerCounter || 0);
        this.timerRef = setInterval(() => {
          this.timerCounter = Date.now() - startTime;
          this.start_running_label = "Stop Test - " + this.displayMilliseconds(this.timerCounter);
          if(batch_counter == 0) {
            this.insertUrlToTest(number_of_users_per_batch, batch_counter);
            batch_counter++;
          } else { 
            let currentTime: number = Math.floor(this.timerCounter / 60000);
            let timeCheck: number = batch_counter * this.ramp;
            if(currentTime == timeCheck) {
              this.insertUrlToTest(number_of_users_per_batch, batch_counter);
              batch_counter++;
              if(batch_counter >batch) {
                this.toastr.success("Test finished")
                this.start_running_label = "Run Test";
                this.timerCounter = 0;
                clearInterval(this.timerRef);
              }
            }
          }
        });
      } else {
        this.running = !this.running;
        this.toastr.error("Test is not allowed");
        this.start_running_label = "Run Test";
        this.timerCounter = 0;
        clearInterval(this.timerRef);
      }

    } else {
      this.start_running_label = "Run Test";
      this.timerCounter = 0;
      clearInterval(this.timerRef);
    }
  }
  insertUrlToTest(users: number, batch_counter: number) {
    for(let u=0;u<users;u++) {
      for(let i=0;i<this.urlData.length;i++) {
        this.urls.unshift({
          batch:batch_counter+1, 
          user: u+1, 
          url_counter: i+1, 
          url: this.urlData[i], 
          status: null,
          time_in:new Date, 
          total_seconds: 0
        })
      }
    }

    let start_index = (users * this.urlData.length) - 1;  
    let end_index = 0; 

    for(let i=start_index;i>=end_index;i--) {
      this.executeTest(this.urls[i]).subscribe(event => {
        if (event.type === HttpEventType.DownloadProgress) {
          this.urls[i].time_in = new Date();
          this.urls[i].status = "on-going";
        }
        if (event.type === HttpEventType.Response) {
          let endDate = new Date();
          this.urls[i].total_seconds = (endDate.getTime()-this.urls[i].time_in.getTime()) / 1000;
          this.urls[i].status = event.status;
        }      
      }, error => {
        this.urls[i].total_seconds = 0;
        this.urls[i].status = "Error";
      })
    }
  }
  executeTest(url: UrlModel): Observable<HttpEvent<any>> {
    let urlEndPoint: string = "";
    let response: any;

    try {
      // Query Parameters
      let queryParameters = url.url['queries'];
      if(queryParameters != null) {
        queryParameters = JSON.parse(url.url['queries']);
        let param = Object.keys(queryParameters).map(key => key + '=' + queryParameters[key]).join('&');
        urlEndPoint = url.url['url'] + "?" + param;
      } else {
        urlEndPoint = url.url['url'];
      }
      // Headers
      let httpHeaders = new HttpHeaders(); 
      if(url.url['headers'] != null) {
        let headers = JSON.parse(url.url['headers']);
        httpHeaders = new HttpHeaders(headers); 
      } 
      // Body / Load
      let body = url.url['body']
      if(body != null) {
        body = JSON.stringify(JSON.parse(url.url['body']));
      }

      if(url.url['type'] == 'GET') {
        response = this.http.get( urlEndPoint, { 
                                responseType: "json", 
                                reportProgress: true, 
                                observe: "events", 
                                headers: httpHeaders
                              });
      } else  if(url.url['type'] == 'POST') {
        response = this.http.post( urlEndPoint, body, { 
                                responseType: "json", 
                                reportProgress: true, 
                                observe: "events", 
                                headers: httpHeaders 
                              });
      } else  if(url.url['type'] == 'PUT') {
        response = this.http.put( urlEndPoint, body, { 
                                responseType: "json", 
                                reportProgress: true, 
                                observe: "events", 
                                headers: httpHeaders
                              });
      } else  if(url.url['type'] == 'DELETE') {
        response = this.http.delete( urlEndPoint, { 
                                responseType: "json", 
                                reportProgress: true, 
                                observe: "events", 
                                headers: httpHeaders
                              });
      } else {
        response = null;
      }
    } catch(e) {
      this.toastr.error("Error performing test.  Test cancelled.")
      this.start_running_label = "Run Test";
      this.timerCounter = 0;
      clearInterval(this.timerRef);

      return null;
    }
    return response;
  }
  testDurationStatement(): string {
    let batch: number = 0;
    let number_of_users_per_batch: number = 0;
    let statement: string = "";

    batch = this.duration / this.ramp;
    number_of_users_per_batch = this.users / batch;

    if(this.ramp > 0 && batch > 0 && this.duration % this.ramp == 0 && this.users % batch == 0) {
      statement = "Note: The system will test " + number_of_users_per_batch + " user(s) every " + this.ramp + " minute(s) for the duration of " + this.duration + " minute(s)."
    } else {
      statement = "Note: Test is not allowed."
    }

    return statement;
  }

  editRow(row: UrlModel, index: number): void {
    this.urlModel = row;
    const openDialog = this.urlDialog.open(UrlDetailComponent, {
      width: '500px',
      data: {
        dataType: "UPDATE",
        urlModel: this.urlModel
      },
      disableClose: true
    });

    openDialog.afterClosed().subscribe(result => {
      if (result == "UPDATE") {
        this.getUrls();
      }  else if (result == "DELETE") { 
        this.urlData.splice(index, 1);
        this.getUrls();
      }else {
      } 
    });
  }

  ngOnInit(): void {
    this.getUrls();
  }

  displayMilliseconds(ms: number): string {
    var d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;
    h += d * 24;
    return h + ':' + m + ':' + s;
  }

}
