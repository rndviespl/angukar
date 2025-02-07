import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { apiServiceShortStructure, ApiServiceStructure } from './service-structure-api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = `${window.location.origin}/api`;

  constructor(private http: HttpClient, private router: Router) { }

  getApiList(): Observable<apiServiceShortStructure[]> {
    return this.http.get<apiServiceShortStructure[]>(`${this.baseUrl}/ApiService`).pipe(
      catchError(this.handleError)
    );
  }

  getApiStructureList(name: string): Observable<ApiServiceStructure> {
    return this.http.get<ApiServiceStructure>(`${this.baseUrl}/ApiService/${encodeURIComponent(name)}`).pipe(
      catchError(this.handleError)
    );
  }

  createApiService(service: apiServiceShortStructure): Observable<apiServiceShortStructure> {
    return this.http.post<apiServiceShortStructure>(`${this.baseUrl}/ApiService`, service).pipe(
      catchError(this.handleError)
    );
  }

  updateApiService(oldName: string, service: apiServiceShortStructure): Observable<apiServiceShortStructure> {
    return this.http.put<apiServiceShortStructure>(`${this.baseUrl}/ApiService/${encodeURIComponent(oldName)}`, service).pipe(
      catchError(this.handleError)
    );
  }

  deleteApiService(serviceName: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/ApiService/${encodeURIComponent(serviceName)}`).pipe(
      catchError(this.handleError)
    );
  }

  updateApiServiceStatus(serviceName: string, isActive: boolean): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/ApiService/${encodeURIComponent(serviceName)}/${isActive}`, null).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    if (error.status === 404) {
      this.router.navigate(['/page-not-found']);
    }
    return throwError(error);
  }
}
