import { Component, OnInit } from '@angular/core';

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
    'type',
    'url'
  ];

  urlModel: UrlModel;

  constructor(
    private urlDialog: MatDialog
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
