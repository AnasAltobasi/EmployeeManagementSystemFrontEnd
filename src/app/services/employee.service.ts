import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Employee {
  employeeId?: string;
  name: string;
  email: string;
  mobileNumber: string;
  homeAddress: string;
  photo: string;
}

export interface PaginatedResponse {
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  data: Employee[];
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly apiUrl = `${environment.apiUrl}/Employees`;

  constructor(private http: HttpClient) {}

getEmployees(
    pageNumber: number,
    pageSize: number,
  ): Observable<PaginatedResponse> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginatedResponse>(this.apiUrl, { params });
  }

getEmployeeById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
}

createEmployee(employee: any): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee);
}

updateEmployee(id: string, employee: any): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, employee);
}

deleteEmployee(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
}
}
