import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';

import { UrlQueryModel } from '../../../../Models/url-query.model';
import { UrlHeaderModel } from '../../../../Models/url-header.model';
import { UrlModel } from '../../../../Models/url.model';

@Component({
  selector: 'app-url-detail',
  templateUrl: './url-detail.component.html',
  styleUrls: ['./url-detail.component.scss']
})
export class UrlDetailComponent implements OnInit {

  urlModel: UrlModel = new UrlModel();

  types = ["GET", "POST", "PUT", "DELETE"];

  dataType: string = "";

  constructor(
    @Inject(MAT_DIALOG_DATA) private dialogData: any,
    private dialog: MatDialogRef<UrlDetailComponent>,
    private toastr: ToastrService,
  ) { }

  buttonSave(): void {
    if(this.urlModel.type==null || this.urlModel.url==null) {
      this.toastr.error("Invalid URL");
    } else {
      this.dialog.close(this.dataType);
    }
  }
  buttonCancel(): void {
    this.dialog.close("CANCEL");
  }

  ngOnInit(): void {
    this.urlModel = this.dialogData.urlModel;
    this.dataType =  this.dialogData.dataType;
  }

}
