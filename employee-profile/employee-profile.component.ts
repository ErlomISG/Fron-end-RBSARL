import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployeeResponsePayload } from 'src/app/model/employee-response.payload';
import { MissionResponsePayload } from 'src/app/model/mission-response.payload';
import { EmployeeService } from 'src/app/service/employee.service';
import { ImageService } from 'src/app/service/image.service';
import { MissionService } from 'src/app/service/mission.service';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent implements OnInit {

  id!: Number;
  employeeIdentifier!: string;
  firstname!: string;
  lastname!: string;
  email!: string;
  birthdate!: Date;
  salary!: any;
  department!: string;
  position!: string;
  street!: string;
  houseNumber!: string;
  zipCode!: string;
  missions!: MissionResponsePayload[];
  missionData!: MissionResponsePayload[];
  total!: number;
  page!: any;
  name!: any;
  searchForm!: FormGroup;
  selectedFile!: File;
  base64Data!: any;
  url = "./assets/img/default-profile.png";


  constructor(private employeeService: EmployeeService, private toastr: ToastrService,
    private missionService: MissionService, private activatedRoute: ActivatedRoute, private imageService: ImageService) { }

  ngOnInit(): void {
    this.getEmployeeById();
    this.searchForm = new FormGroup({
      missionName: new FormControl('')
    })
  }

  public getEmployeeById() {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    this.employeeService.getEmployeeById(id).subscribe(response => {
      this.id = response.id;
      this.employeeIdentifier = response.employeeIdentifier;
      this.firstname = response.firstname;
      this.lastname = response.lastname;
      this.email = response.email;
      this.birthdate = response.birthdate;
      this.salary = response.salary;
      this.position = response.positionResponse.positionName;
      this.department = response.department.name;
      this.street = response.address.street;
      this.houseNumber = response.address.houseNumber;
      this.zipCode = response.address.zipCode;
      this.base64Data = response.imageResponse.image;
      this.url = 'data:' + response.imageResponse.fileType + ';base64,' + this.base64Data;
      this.getAllMissionByEmployeeId(response.id);
    }, error => {
      this.toastr.error('There was an error loading employee profile!');
      console.error(error.message);
    })
  }

  public getAllMissionByEmployeeId(employeeId: number) {
    this.missionService.getAllMissionByEmployeeId(employeeId, 0).subscribe(response => {
      this.missions = response.content;
      this.total = response.totalElements;
    })
  }

  public loadPage(employeeId: any, page: any) {
    this.missionService.getAllMissionByEmployeeId(employeeId, page - 1).subscribe(response => {
      this.missions = response.content;
      this.total = response.totalElements;
    })
  }

  public addMissionToEmployee(missionId: number, employeeId: any) {
    this.employeeService.addMissionToEmployee(missionId, employeeId, 0).subscribe(response => {
      this.getAllMissionByEmployeeId(employeeId);
      this.toastr.success(response.responseMessage);
      this.missionData = new Array;
      this.searchForm.reset();
    }, error => {
      this.toastr.error("This employee is already assigned to this project!")
      console.error(error.message);
    })
  }

  public searchAllMissionByName() {
    this.name = this.searchForm.get('missionName')?.value;
    this.missionService.getAllMissionByName(this.name, 0).subscribe(response => {
      this.missionData = response.content;
      this.total = response.totalElements;
    }, error => {
      this.toastr.error("An error occurred while searching for projects!");
      console.error(error);
    })
  }

  public onSelectedFile(event: any) {
    this.selectedFile = <File>event.target.files[0];
    console.log(this.selectedFile)
    if (event.target.files) {
      var fileReader = new FileReader();
      fileReader.readAsDataURL(this.selectedFile);
      fileReader.onload = (e: any) => {
        this.url = e.target.result;
      }
    }
  }

  public onUpload(employeeId: any) {
    var formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);
    this.imageService.uploadImageForEmployee(formData, employeeId).subscribe(data => {
      this.toastr.success(data.responseMessage);
    }, error => {
      this.toastr.error('There was an error saving image!');
      console.error(error.message);
    })
  }

}
