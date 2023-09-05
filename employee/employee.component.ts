import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EmployeeResponsePayload } from 'src/app/model/employee-response.payload';
import { SearchRequest } from 'src/app/model/search-request.payload';
import { EmployeeService } from 'src/app/service/employee.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  employees!: EmployeeResponsePayload[];
  searchForm!: FormGroup;
  searchRequest!: SearchRequest;
  name!: string;
  total!: number;
  page!: any;

  constructor(private employeeService: EmployeeService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.getAllEmployees();
    this.searchForm = new FormGroup({
      firstname: new FormControl('')
    })
  }

  public getAllEmployees() {
    this.employeeService.getAllEmployee().subscribe(response => {
        this.employees = response.content;
        this.total = response.totalElements;
      },
      (error: HttpErrorResponse) => {
        this.toastr.error("There was an error loading the list of employees!")
        console.info(error.message);
      }
    );
  }

  public loadPage(page: any) {
    this.name = this.searchForm.get('firstname')?.value;
    if (this.name == null || this.name == '') {
      this.employeeService.getAllEmployeePerPage(page - 1).subscribe(response => {
        this.employees = response.content;
        this.total = response.totalElements;
      })
    } else {
      this.employeeService.getEmployeeByFirstnamePerPage(this.name, page - 1).subscribe(response => {
        this.employees = response.content;
        this.total = response.totalElements;
      })
    }
  }

  public searchEmployeeByFirstname() {
    this.name = this.searchForm.get('firstname')?.value;
    if (this.name == null || this.name == '') {
      this.employeeService.getAllEmployeePerPage(0).subscribe(response => {
        this.employees = response.content;
        this.total = response.totalElements;
      })

    } else {
      this.employeeService.getEmployeeByFirstname(this.name).subscribe(response => {
        this.employees = response.content;
        this.total = response.totalElements;
      }, error => {
        this.toastr.error("An error occurred while searching for employee!");
        console.error(error.message);
      })
    }
  }

  public deleteEmployee(id: Number, index: any) {
    this.employeeService.deleteEmployee(id).subscribe(data => {
      this.employees.splice(index, 1);
      this.toastr.success(data);
    })
  }

}
