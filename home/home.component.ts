import { Component, OnInit } from '@angular/core';
import { UserChartPayload } from 'src/app/model/userChart.payload';
import { DepartmentService } from 'src/app/service/department.service';
import { EmployeeService } from 'src/app/service/employee.service';
import { MissionService } from 'src/app/service/mission.service';
import { UserService} from 'src/app/service/user.service';
import { ChartOptions, ChartType, ChartData, ChartDataset } from 'chart.js';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  employee!: number;
  department!: number;
  mission!: number;
  user!: number;
  employeeChart = new UserChartPayload();
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: any;
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins: any[] = [];

  barChartData: ChartDataset[] = [
    { data: [], label: 'Employee Salary' }
  ];

  constructor(private employeeService: EmployeeService, private departmentService: DepartmentService,
    private missionService: MissionService, private userService: UserService, private app: AppComponent) { }

  ngOnInit(): void {
    this.getQuantities();
    this.loadChart();
    this.app.getUserDetails();
    this.app.getImage();
  }

  public getQuantities() {
    this.employeeService.getEmployeeQuantity().subscribe(response => {
      this.employee = response;
    });

    this.departmentService.getDepartmentQuantity().subscribe(response => {
      this.department = response;
    });

    this.missionService.getMissionQuantity().subscribe(response => {
      this.mission = response;
    });

    this.userService.getEnabledUsersQuantity().subscribe(response => {
      this.user = response;
    });
  }

  public loadChart() {
    this.employeeService.loadChart().subscribe(response => {
      this.employeeChart = response;
      this.barChartLabels = this.employeeChart.firstname.split(',');

      var salarys = JSON.parse('[' + this.employeeChart.salary + ']')

      this.barChartData = [
        { data: salarys, label: 'Employee Salary' }
      ];
    })
  }
}
