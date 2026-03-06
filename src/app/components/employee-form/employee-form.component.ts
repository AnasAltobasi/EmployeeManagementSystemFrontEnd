import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeeService } from '../../services/employee.service';
import { SharedMaterialModule } from '../../shared/material.module';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    SharedMaterialModule
  ],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  isEditMode = false;
  employeeId: string | null = null;
  photoPreview: string | null = null;
  isUploading = false;
  uploadError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', Validators.required],
      homeAddress: ['', Validators.required],
      photo: ['']
    });
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    if (this.employeeId) {
      this.isEditMode = true;
      this.loadEmployeeData(this.employeeId);
    }
  }

  loadEmployeeData(id: string): void {
    this.employeeService.getEmployeeById(id).subscribe({
      next: (data) => {
        this.employeeForm.patchValue(data);
        if (data.photo) this.photoPreview = data.photo;
      },
      error: () => this.showSnackBar('Error fetching employee details')
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.uploadError = 'Only image files are allowed.';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.uploadError = 'File size must be under 5MB.';
      return;
    }

    this.uploadError = null;

    const reader = new FileReader();
    reader.onload = () => (this.photoPreview = reader.result as string);
    reader.readAsDataURL(file);

    this.isUploading = true;
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<{ url: string }>(`${environment.apiUrl}/Employees/upload`, formData).subscribe({
      next: (res) => {
        this.employeeForm.patchValue({ photo: res.url });
        this.isUploading = false;
      },
      error: () => {
        this.uploadError = 'Upload failed. Please try again.';
        this.isUploading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      const employeeData = this.employeeForm.value;

      const request: Observable<any> = this.isEditMode
        ? this.employeeService.updateEmployee(this.employeeId!, employeeData)
        : this.employeeService.createEmployee(employeeData);

      request.subscribe({
        next: () => {
          this.showSnackBar(`Employee ${this.isEditMode ? 'updated' : 'added'} successfully!`);
          this.router.navigate(['/']);
        },
        error: () => this.showSnackBar('Operation failed. Please check your backend connection.')
      });
    }
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
}