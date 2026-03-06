import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedMaterialModule } from '../../shared/material.module';
import { Employee, EmployeeService } from '../../services/employee.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

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
  Swal.fire({
    title: 'Delete Employee?',
    text: 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#f44336',
    cancelButtonColor: '#9e9e9e',
    confirmButtonText: 'Yes, delete',
    cancelButtonText: 'Cancel',
  }).then((result) => {
    if (result.isConfirmed) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          Swal.fire({
            title: 'Deleted!',
            text: 'Employee has been deleted.',
            icon: 'success',
            confirmButtonColor: '#3f51b5',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          this.loadEmployees();
        },
        error: () => {
          Swal.fire({
            title: 'Error',
            text: 'Failed to delete employee. Please try again.',
            icon: 'error',
            confirmButtonColor: '#3f51b5',
          });
        }
      });
    }
  });
}

  private showNotification(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'success' ? ['bg-success'] : ['bg-danger']
    });
  }

  isValidUrl(url: string): boolean {
  return !!url && (url.startsWith('http://') || url.startsWith('https://'));
}
}