import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { apiServiceShortStructure, ApiServiceStructure, Entity, Endpoint } from './service-structure-api';

@Injectable({
  providedIn: 'root'
})
export class CardApiService {

  private baseUrl = 'http://localhost:4200/api';

  constructor(private http: HttpClient, private router: Router) { }

  getApiList(): Observable<apiServiceShortStructure[]> {
    return this.http.get<apiServiceShortStructure[]>(`${this.baseUrl}/ApiService`).pipe(
      catchError(this.handleError)
    );
  }

  getApiStructureList(name: string): Observable<ApiServiceStructure> {
    return this.http.get<ApiServiceStructure>(`${this.baseUrl}/ApiService/${name}`).pipe(
      catchError(this.handleError)
    );
  }

  createApiService(service: apiServiceShortStructure): Observable<apiServiceShortStructure> {
    return this.http.post<apiServiceShortStructure>(`${this.baseUrl}/ApiService`, service).pipe(
      catchError(this.handleError)
    );
  }

  updateApiService(oldName: string, service: apiServiceShortStructure): Observable<apiServiceShortStructure> {
    return this.http.put<apiServiceShortStructure>(`${this.baseUrl}/ApiService/${oldName}`, service).pipe(
      catchError(this.handleError)
    );
  }

  patchApiServiceStatus(serviceName: string, isActive: boolean): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/ApiService/${serviceName}/${isActive}`, null).pipe(
      catchError(this.handleError)
    );
  }

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

  deleteApiService(serviceName: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/ApiService/${serviceName}`).pipe(
      catchError(this.handleError)
    );
  }

  deleteApiEntity(apiServiceName: string, entityName: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/ApiEntity/${apiServiceName}/${entityName}`).pipe(
      catchError(this.handleError)
    );
  }

  deleteApiAction(apiServiceName: string, entityName: string, actionName: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/ApiAction/${apiServiceName}/${entityName}/${actionName}`).pipe(
      catchError(this.handleError)
    );
  }

  getActionList(apiServiceName: string, entityName: string): Observable<Endpoint[]> {
    return this.http.get<Endpoint[]>(`${this.baseUrl}/ApiAction/${apiServiceName}/${entityName}`).pipe(
      catchError(this.handleError)
    );
  }

  createApiAction(apiServiceName: string, entityName: string, action: Endpoint): Observable<Endpoint> {
    return this.http.post<Endpoint>(`${this.baseUrl}/ApiAction/${apiServiceName}/${entityName}`, action).pipe(
      catchError(this.handleError)
    );
  }

  getApiActionByName(apiServiceName: string, entityName: string, actionName: string): Observable<Endpoint> {
    return this.http.get<Endpoint>(`${this.baseUrl}/ApiAction/${apiServiceName}/${entityName}/${actionName}`).pipe(
      catchError(this.handleError)
    );
  }

  updateApiEndpoint(apiServiceName: string, entityName: string, actionName: string, action: Endpoint): Observable<Endpoint> {
    return this.http.put<Endpoint>(`${this.baseUrl}/ApiAction/${apiServiceName}/${entityName}/${actionName}`, action).pipe(
      catchError(this.handleError)
    );
  }

  getApiEmu(apiName: string, entityName: string, endpoint: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/ApiEmu/${apiName}/${entityName}/${endpoint}`).pipe(
      catchError(this.handleError)
    );
  }

  createApiEmu(apiName: string, entityName: string, endpoint: string, data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/ApiEmu/${apiName}/${entityName}/${endpoint}`, data).pipe(
      catchError(this.handleError)
    );
  }

  getApiEmuById(apiName: string, entityName: string, endpoint: string, id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/ApiEmu/${apiName}/${entityName}/${endpoint}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateApiEmu(apiName: string, entityName: string, endpoint: string, id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/ApiEmu/${apiName}/${entityName}/${endpoint}/${id}`, data).pipe(
      catchError(this.handleError)
    );
  }

  deleteApiEmu(apiName: string, entityName: string, endpoint: string, id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/ApiEmu/${apiName}/${entityName}/${endpoint}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateServiceStatus(serviceName: string, isActive: boolean): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/ApiService/${serviceName}/${isActive}`, null).pipe(
      catchError(this.handleError)
    );
  }

  updateEntityStatus(serviceName: string, entityName: string, isActive: boolean): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/ApiEntity/${serviceName}/${entityName}/${isActive}`, null).pipe(
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
