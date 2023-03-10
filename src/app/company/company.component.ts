import { Component, OnInit, ViewChild } from '@angular/core';
import { companymodel } from '../Model/companymodel';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PopupComponent } from '../popup/popup.component';
import { ApiService } from '../shared/api.service';
import * as alertify from 'alertifyjs';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css'],
})
export class CompanyComponent implements OnInit {
  constructor(private dialog: MatDialog, private api: ApiService) {}
  @ViewChild(MatPaginator) _paginator!: MatPaginator;
  @ViewChild(MatSort) _sort!: MatSort;
  companydata!: companymodel[];
  finaldata: any;

  ngOnInit(): void {
    this.LoadCompany();
  }

  displayColums: string[] = [
    'id',
    'name',
    'empcount',
    'revenue',
    'address',
    'isactive',
    'action',
  ];

  Openpopup(id: any) {
    const _popup = this.dialog.open(PopupComponent, {
      width: '500px',
      data: {
        id: id,
      },
    });
    _popup.afterClosed().subscribe((r) => {
      this.LoadCompany();
    });
  }

  LoadCompany() {
    this.api.Getallcomapny().subscribe((response) => {
      this.companydata = response;
      this.finaldata = new MatTableDataSource<companymodel>(this.companydata);
      this.finaldata.paginator = this._paginator;
      this.finaldata.sort = this._sort;
    });
  }

  EditCompany(id: any) {
    this.Openpopup(id);
  }

  RemoveCompany(id: any) {
    alertify.confirm(
      'Remove Company',
      'do you want remove this company?',
      () => {
        this.api.RemoveCompanybycode(id).subscribe((r) => {
          this.LoadCompany();
        });
      },
      function () {}
    );
  }
}
