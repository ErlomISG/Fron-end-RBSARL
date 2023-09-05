import { Component } from '@angular/core';
import { EmployeeService } from 'src/app/service/employee.service';

@Component({
  selector: 'app-employee-report',
  templateUrl: './employee-report.component.html',
  styleUrls: ['./employee-report.component.css']
})
export class EmployeeReportComponent {

  constructor(private employeeService: EmployeeService) {}

  public downloadPdfReport() {
    this.employeeService.downloadPdfReport().subscribe(data => {
      document.querySelector('iframe')!.src = data;
    }, error => {
      console.error(error);
    }
    );
  }

}
