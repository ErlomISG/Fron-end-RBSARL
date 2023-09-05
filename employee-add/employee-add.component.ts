import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Department } from 'src/app/model/department.payload';
import { EmployeeRequestPayload } from 'src/app/model/employee-request.payload';
import { PositionPayload } from 'src/app/model/position.payload';
import { DepartmentService } from 'src/app/service/department.service';
import { EmployeeService } from 'src/app/service/employee.service';

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.css']
})
export class EmployeeAddComponent implements OnInit {

  employeeForm!: FormGroup;
  employeeRequest!: EmployeeRequestPayload;
  departments!: Department[];
  employeeId!: Number;
  positions!: PositionPayload[];

  constructor(private employeeService: EmployeeService, private departmentService: DepartmentService,
    private activatedRoute: ActivatedRoute, private toastr: ToastrService, private router: Router,) {
    this.employeeRequest = {
      firstname: '',
      lastname: '',
      email: '',
      birthdate: '',
      salary: '',
      department: '',
      position: '',
      street: '',
      houseNumber: '',
      zipCode: ''
    };
  }

  ngOnInit(): void {
    this.fillForm();
    this.getAllPositions();
    this.getAllDepartments();
    this.employeeForm = new FormGroup({
      id: new FormControl({ value: '', disabled: true }),
      employeeIdentifier: new FormControl({ value: '', disabled: true }),
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      birthdate: new FormControl('', Validators.required),
      salary: new FormControl('', Validators.required),
      department: new FormControl('', Validators.required),
      position: new FormControl('', Validators.required),
      street: new FormControl('', Validators.required),
      houseNumber: new FormControl('', Validators.required),
      zipCode: new FormControl('', Validators.required)
    })
  }

  public createEmployee() {

    this.employeeId = this.employeeForm.controls['id'].value;
    if (this.employeeId != null && this.employeeId.toString().length != 0) {
      if (this.employeeForm.valid) {

        this.employeeService.updateEmployee(this.employeeId, this.mapToRequest()).subscribe(data => {
          this.toastr.success(data.responseMessage);
          this.cleanForm();

        }, error => {
          this.toastr.error('An error occurred while updating employee!');
          console.error(error.message);
        })
      } else {
        this.toastr.warning('Duly fill in the form!')
      }
    } else
      if (this.employeeForm.valid) {

        this.employeeService.createEmployee(this.mapToRequest()).subscribe(data => {
          this.toastr.success(data.responseMessage);
          this.cleanForm();
        },
          error => {
            this.toastr.error('There was an error saving employee, please try again!');
            console.error(error.message);
          }
        )
      } else {
        this.toastr.warning('Duly fill in the form!')
      }

  }

  public getAllDepartments() {
    this.departmentService.getAllDepartment().subscribe((response) => {
      this.departments = response;
    }, error => {
      this.toastr.error('An error occurred while loading the department list!');
      console.error(error);
    })
  }

  public getAllPositions() {
    this.employeeService.getAllPosition().subscribe(response => {
      this.positions = response;
    }, error => {
      this.toastr.error('An internal error occurred while loading the job list!');
      console.error(error);
    })
  }

  public fillForm() {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== null) {
      this.employeeService.getEmployeeById(id).subscribe(response => {
        this.employeeForm = new FormGroup({
          id: new FormControl({ value: response.id, disabled: true }),
          employeeIdentifier: new FormControl({ value: response.employeeIdentifier, disabled: true }),
          firstname: new FormControl(response.firstname, Validators.required),
          lastname: new FormControl(response.lastname, Validators.required),
          email: new FormControl(response.email, [Validators.required, Validators.email]),
          birthdate: new FormControl(formatDate(new Date(response.birthdate).toISOString(),'YYYY-MM-dd', 'en-US'), Validators.required),
          salary: new FormControl(response.salary, Validators.required),
          department: new FormControl(response.department.name, Validators.required),
          position: new FormControl(response.positionResponse.positionName, Validators.required),
          street: new FormControl(response.address.street, Validators.required),
          houseNumber: new FormControl(response.address.houseNumber, Validators.required),
          zipCode: new FormControl(response.address.zipCode, Validators.required)
        })
      })
    }
  }

  private mapToRequest(): EmployeeRequestPayload {
    this.employeeRequest.firstname = this.employeeForm.get('firstname')?.value;
    this.employeeRequest.lastname = this.employeeForm.get('lastname')?.value;
    this.employeeRequest.email = this.employeeForm.get('email')?.value;
    this.employeeRequest.birthdate = this.employeeForm.get('birthdate')?.value;
    this.employeeRequest.salary = this.employeeForm.get('salary')?.value;
    this.employeeRequest.department = this.employeeForm.get('department')?.value;
    this.employeeRequest.position = this.employeeForm.get('position')?.value;
    this.employeeRequest.street = this.employeeForm.get('street')?.value;
    this.employeeRequest.houseNumber = this.employeeForm.get('houseNumber')?.value;
    this.employeeRequest.zipCode = this.employeeForm.get('zipCode')?.value;
    return this.employeeRequest;
  }

  public cleanForm() {
    this.employeeForm.reset();
    this.router.navigate(['employeeAdd']);
  }

}
