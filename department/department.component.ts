import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DepartmentRequest } from 'src/app/model/department-request.payload';
import { Department } from 'src/app/model/department.payload';
import { SearchRequest } from 'src/app/model/search-request.payload';
import { DepartmentService } from 'src/app/service/department.service';

@Component({
  selector: 'app-deparment',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {

  departments!: Department[];
  departmentRequest!: DepartmentRequest;
  departmentForm!: FormGroup;
  departmentId!: Number;
  searchForm!: FormGroup;
  searchRequest!: SearchRequest;
  name!: string;
  page!: number;
  total!: number;

  constructor(private departmentService: DepartmentService, private toastr: ToastrService) {
    this.departmentRequest = {
      name: '',
      shortName: ''
    };
  }

  ngOnInit(): void {
    this.getAllDepartments();
    this.departmentForm = new FormGroup({
      id: new FormControl({ value: '', disabled: true }),
      name: new FormControl('', Validators.required),
      shortName: new FormControl('', Validators.required)
    });

    this.searchForm = new FormGroup({
      departmentName: new FormControl('')
    });
  }

  public createDepartment() {
    this.departmentId = this.departmentForm.controls['id'].value;
    if (this.departmentForm.valid) {
      if (this.departmentId != null && this.departmentId.toString().length != 0) {
        this.departmentService.updateDepartment(this.departmentId, this.mapToRequest()).subscribe(data => {
          this.toastr.success(data.responseMessage);
          this.getAllDepartments();
          this.cleanForm();
        },
          error => {
            this.toastr.error('An error occurred while updating department');
            console.error(error.message);
          })
      } else {
        this.departmentService.createDepartment(this.mapToRequest()).subscribe(data => {
          this.toastr.success(data.responseMessage);
          this.getAllDepartments();
          this.cleanForm()
        },
          error => {
            this.toastr.error('An error occurred while saving department!')
            console.error(error);
          }
        )
      }
    } else {
      this.toastr.warning('Duly fill in the form')
    }
  }

  public getAllDepartments() {
    this.departmentService.getAllDepartments(0).subscribe(response => {
      this.departments = response.content;
      this.total = response.totalElements;
    }, error => {
      this.toastr.error('An error occurred while loading the list of departments!');
      console.error(error.message)
    })
  }

  public searchDepartmentByName() {
    this.name = this.searchForm.get('departmentName')?.value;
    if (this.name == null || this.name == '') {
      this.getAllDepartments();
    } else {
      this.departmentService.getAllDepartmentByName(this.name, 0).subscribe(response => {
        this.departments = response.content;
        this.total = response.totalElements;
      }, error => {
        this.toastr.error('Occurred when searching for departments!');
        console.error(error.message);

      })
    }
  }

  public deleteDepartment(id: any) {
    this.departmentId = id;
    if (this.departmentId != null && this.departmentId.toString().length != 0) {
      this.departmentService.deleteDepartment(this.departmentId).subscribe(response => {
        this.toastr.success(response);
        this.getAllDepartments();
      }, error => {
        this.toastr.error('You cannot delete a department with employees!');
        console.error(error.message);
      })
    }
  }

  public loadPage(page: any) {
    this.name = this.searchForm.get('departmentName')?.value;
    if (this.name == null || this.name == '') {
      this.departmentService.getAllDepartments(page - 1).subscribe(response => {
        this.departments = response.content;
        this.total = response.totalElements;
      })
    } else {
      this.departmentService.getAllDepartmentByName(this.name, page).subscribe(response => {
        this.departments = response.content;
        this.total = response.totalElements;
      })
    }
  }

  public fillForm(id: any) {
    if (id !== null) {
      this.departmentService.getDepartmentById(id).subscribe(response => {
        this.departmentForm = new FormGroup({
          id: new FormControl({ value: response.id, disabled: true }),
          name: new FormControl(response.name, Validators.required),
          shortName: new FormControl(response.shortName, Validators.required)
        })
      }, error => {
        console.error(error);
      })
    }
  }

  public cleanForm() {
    this.departmentForm.reset();
  }

  private mapToRequest(): DepartmentRequest {
    this.departmentRequest.name = this.departmentForm.get('name')?.value;
    this.departmentRequest.shortName = this.departmentForm.get('shortName')?.value;
    return this.departmentRequest;
  }

}
