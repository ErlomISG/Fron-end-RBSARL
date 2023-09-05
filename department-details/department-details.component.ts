import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployeeResponsePayload } from 'src/app/model/employee-response.payload';
import { DepartmentService } from 'src/app/service/department.service';
import { EmployeeService } from 'src/app/service/employee.service';

@Component({
  selector: 'app-department-details',
  templateUrl: './department-details.component.html',
  styleUrls: ['./department-details.component.css']
})
export class DepartmentDetailsComponent implements OnInit{

  id!: number;
  departmentName!: string;
  shortName!: string;
  quantity!: number;
  employees!: EmployeeResponsePayload[];
  total!: number;
  page!: any;

  constructor(private departmentService: DepartmentService, private employeeService: EmployeeService,
    private activatedRoute: ActivatedRoute, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.getDepartmentById();
  }

  public getDepartmentById() {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    this.departmentService.getDepartmentById(id).subscribe(response => {
      this.id = response.id;
      this.departmentName = response.name;
      this.shortName = response.shortName;
      this.quantity = response.employeeQuantity;
      this.getEmployeeByDepartmentName(response.name);
    }, error => {
      this.toastr.error('There was an error loading department details!');
      console.error(error);
    })
  }

  public getEmployeeByDepartmentName(name: any) {
    this.employeeService.getAllEmployeeByDepartment(name).subscribe(response => {
      this.employees = response;
    }, error => {
      this.toastr.error('An error occurred while loading the list of department employees!');
      console.error(error);
    })
  }
}
