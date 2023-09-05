import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployeeResponsePayload } from 'src/app/model/employee-response.payload';
import { EmployeeService } from 'src/app/service/employee.service';
import { MissionService } from 'src/app/service/mission.service';

@Component({
  selector: 'app-mission-profile',
  templateUrl: './mission-profile.component.html',
  styleUrls: ['./mission-profile.component.css']
})
export class MissionProfileComponent implements OnInit{

  missionId!: number;
  missionName!: string;
  startedAt!: any;
  finishedAt!: any;
  missionStatus!: string;
  page!: any;
  total!: any;
  totall!: any;
  employees!: EmployeeResponsePayload[];
  employeesWithoutMission!: EmployeeResponsePayload[];

  constructor(private activatedRoute: ActivatedRoute, private missionService: MissionService,
    private employeeService: EmployeeService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.getMissionById();
  }

  public getMissionById() {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    this.missionService.getMissionById(id).subscribe(response => {
      this.missionId = response.id;
      this.missionName = response.missionName;
      this.startedAt = response.startedDate;
      this.finishedAt = response.finishedDate;
      this.missionStatus = response.missionStatus.missionStatus;
      this.getAllEmployeeByMission(response.id);
    })
  }

  public getAllEmployeeByMission(missionId: number) {
    this.employeeService.getAllEmployeeByMissionId(missionId, 0).subscribe(response => {
      this.employees = response.content;
      this.total = response.totalElements;
      console.log(response);
    })
  }

  public getAllEmployeeWithoutMission(missionId: number) {
    this.employeeService.getAllEmployeeWithoutThatMission(missionId, 0).subscribe(response => {
      this.employeesWithoutMission = response.content;
      this.totall = response.totalElements;
    })
  }

  public addEmployeeToMission(employeeId: any, missionId: number) {
    this.missionService.addEmployeeToMission(missionId, employeeId, 0).subscribe(response => {
      this.toastr.success(response.responseMessage);
      this.getAllEmployeeWithoutMission(missionId);
      this.getAllEmployeeByMission(missionId);
    }, error => {
      this.toastr.error("This employee is already assigned to this project!")
      console.error(error.message);
    })
  }

  public loadPage(missionId: any, page: any) {
    this.employeeService.getAllEmployeeByMissionId(missionId, page - 1).subscribe(response => {
      this.employees = response.content;
      this.total = response.totalElements;
    })
  }

  public loadPageWhithout(missionId: any, page: any) {
    this.employeeService.getAllEmployeeWithoutThatMission(missionId, page - 1).subscribe(response => {
      this.employeesWithoutMission = response.content;
      this.total = response.totalElements;
    })
  }

}
