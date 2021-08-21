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
import { SelectionModel } from '@angular/cdk/collections';

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
    this.running = !this.running;
    if(this.running) {
      let batch: number = 0;
      let batch_counter: number = 0;
      let number_of_users_per_batch: number = 0;

      batch = this.duration / this.ramp;
      number_of_users_per_batch = this.users / batch;
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
          }
        }
      });
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
          url: this.urlData[i].url, 
          status: null,
          time_in:new Date, 
          total_seconds: 0
        })
      }
    }

    let start_index = (users * this.urlData.length) - 1;  
    let end_index = 0; 

    for(let i=start_index;i>=end_index;i--) {
      this.executeTest(this.urls[i].url).subscribe(event => {
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
