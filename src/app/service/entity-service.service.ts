import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { apiServiceShortStructure, ApiServiceStructure, Entity, Endpoint } from './service-structure-api';

@Injectable({
  providedIn: 'root'
})
export class EntityService {
 
  private baseUrl = `${window.location.origin}/api`;

  constructor(private http: HttpClient, private router: Router) { }

  getApiEntityList(apiServiceName: string): Observable<Entity[]> {
    return this.http.get<Entity[]>(`${this.baseUrl}/ApiEntity/${apiServiceName}`).pipe(
      catchError(this.handleError)
    );
  }

  getApiEntity(apiServiceName: string, entityName: string): Observable<Entity> {
    return this.http.get<Entity>(`${this.baseUrl}/ApiEntity/${apiServiceName}/${entityName}`).pipe(
      catchError(this.handleError)
    );
  }

  createApiEntity(apiServiceName: string, entity: Entity): Observable<Entity> {
    return this.http.post<Entity>(`${this.baseUrl}/ApiEntity/${apiServiceName}`, entity).pipe(
      catchError(this.handleError)
    );
  }

  updateApiEntity(apiServiceName: string, entityName: string, entity: Entity): Observable<Entity> {
    return this.http.put<Entity>(`${this.baseUrl}/ApiEntity/${apiServiceName}/${entityName}`, entity).pipe(
      catchError(this.handleError)
    );
  }

  deleteApiEntity(apiServiceName: string, entityName: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/ApiEntity/${apiServiceName}/${entityName}`).pipe(
      catchError(this.handleError)
    );
  }

  updateEntityStatus(serviceName: string, entityName: string, isActive: boolean): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/ApiEntity/${serviceName}/${entityName}/${isActive}`, null).pipe(
      catchError(this.handleError)
    );
  }

  getAllApiServices(): Observable<apiServiceShortStructure[]> {
    return this.http.get<apiServiceShortStructure[]>(`${this.baseUrl}/ApiServices`).pipe(
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
