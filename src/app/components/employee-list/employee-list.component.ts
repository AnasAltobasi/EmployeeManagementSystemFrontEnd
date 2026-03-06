import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedMaterialModule } from '../../shared/material.module';
import { Employee, EmployeeService } from '../../services/employee.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    RouterModule,
    SharedMaterialModule
  ],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  displayedColumns: string[] = ['name', 'email', 'mobileNumber', 'actions'];
  
  totalRecords = 0;
  pageSize = 10;
  pageNumber = 1;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees(this.pageNumber, this.pageSize)
      .subscribe({
        next: (response) => {
          this.employees = response.data;
          this.totalRecords = response.totalRecords;
        },
        error: (err) => {
          this.showNotification('Error loading employees', 'error');
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadEmployees();
  }

  deleteEmployee(id: string): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.showNotification('Employee deleted successfully', 'success');
          this.loadEmployees();
        },
        error: () => this.showNotification('Delete failed', 'error')
      });
    }
  }

  private showNotification(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'success' ? ['bg-success'] : ['bg-danger']
    });
  }
}