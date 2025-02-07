import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { apiServiceShortStructure, ApiServiceStructure, Entity, Endpoint } from './service-structure-api';

@Injectable({
  providedIn: 'root'
})
export class EndpointServiceService {

  private baseUrl = `${window.location.origin}/api`;

  constructor(private http: HttpClient, private router: Router) { }

  getEndpointList(apiServiceName: string, entityName: string): Observable<Endpoint[]> {
    return this.http.get<Endpoint[]>(`${this.baseUrl}/ApiAction/${apiServiceName}/${entityName}`).pipe(
      catchError(this.handleError)
    );
  }

  createEndpoint(apiServiceName: string, entityName: string, action: Endpoint): Observable<Endpoint> {
    return this.http.post<Endpoint>(`${this.baseUrl}/ApiAction/${apiServiceName}/${entityName}`, action).pipe(
      catchError(this.handleError)
    );
  }

  getEndpointByName(apiServiceName: string, entityName: string, actionName: string): Observable<Endpoint> {
    return this.http.get<Endpoint>(`${this.baseUrl}/ApiAction/${apiServiceName}/${entityName}/${actionName}`).pipe(
      catchError(this.handleError)
    );
  }

  updateEndpoint(apiServiceName: string, entityName: string, actionName: string, action: Endpoint): Observable<Endpoint> {
    return this.http.put<Endpoint>(`${this.baseUrl}/ApiAction/${apiServiceName}/${entityName}/${actionName}`, action).pipe(
      catchError(this.handleError)
    );
  }

  deleteEndpoint(apiServiceName: string, entityName: string, actionName: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/ApiAction/${apiServiceName}/${entityName}/${actionName}`).pipe(
      catchError(this.handleError)
    );
  }

  updateEndpointStatus(serviceName: string, entityName: string, endpoint: string, isActive: boolean): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/ApiAction/${serviceName}/${entityName}/${endpoint}/${isActive}`, null).pipe(
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
