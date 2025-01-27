import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiServiceShortStructure, ApiServiceStructure, Entity, Action } from './service-structure-api';

@Injectable({
  providedIn: 'root'
})
export class CardApiService {

  private baseUrl = 'http://localhost:4200/api';

  constructor(private http: HttpClient) { }

  // ApiService Methods
  getApiList(): Observable<apiServiceShortStructure[]> {
    return this.http.get<apiServiceShortStructure[]>(`${this.baseUrl}/ApiService`);
  }

  getApiStructureList(name: string): Observable<ApiServiceStructure> {
    return this.http.get<ApiServiceStructure>(`${this.baseUrl}/ApiService/${name}`);
  }

  createApiService(service: apiServiceShortStructure): Observable<apiServiceShortStructure> {
    return this.http.post<apiServiceShortStructure>(`${this.baseUrl}/ApiService`, service);
  }

  updateApiService(oldName: string, service: apiServiceShortStructure): Observable<apiServiceShortStructure> {
    return this.http.put<apiServiceShortStructure>(`${this.baseUrl}/ApiService/${oldName}`, service);
  }

  deleteApiService(serviceName: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/ApiService/${serviceName}`);
  }

  patchApiServiceStatus(serviceName: string, isActive: boolean): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/ApiService/${serviceName}/${isActive}`, null);
  }

  // ApiEntity Methods
  getApiEntityList(apiServiceName: string): Observable<Entity[]> {
    return this.http.get<Entity[]>(`${this.baseUrl}/ApiEntity/${apiServiceName}`);
  }

  createApiEntity(apiServiceName: string, entity: Entity): Observable<Entity> {
    return this.http.post<Entity>(`${this.baseUrl}/ApiEntity/${apiServiceName}`, entity);
  }

  updateApiEntity(apiServiceName: string, entityName: string, entity: Entity): Observable<Entity> {
    return this.http.put<Entity>(`${this.baseUrl}/ApiEntity/${apiServiceName}/${entityName}`, entity);
  }

  deleteApiEntity(apiServiceName: string, entityName: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/ApiEntity/${apiServiceName}/${entityName}`);
  }

  // ApiAction Methods
  getApiAction(apiServiceName: string, entityName: string): Observable<Action[]> {
    return this.http.get<Action[]>(`${this.baseUrl}/ApiAction/${apiServiceName}/${entityName}`);
  }

  createApiAction(apiServiceName: string, entityName: string, action: Action): Observable<Action> {
    return this.http.post<Action>(`${this.baseUrl}/ApiAction/${apiServiceName}/${entityName}`, action);
  }

  getApiActionByName(apiServiceName: string, entityName: string, actionName: string): Observable<Action> {
    return this.http.get<Action>(`${this.baseUrl}/ApiAction/${apiServiceName}/${entityName}/${actionName}`);
  }

  updateApiAction(apiServiceName: string, entityName: string, actionName: string, action: Action): Observable<Action> {
    return this.http.put<Action>(`${this.baseUrl}/ApiAction/${apiServiceName}/${entityName}/${actionName}`, action);
  }

  deleteApiAction(apiServiceName: string, entityName: string, actionName: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/ApiAction/${apiServiceName}/${entityName}/${actionName}`);
  }

  // ApiEmu Methods
  getApiEmu(apiName: string, entityName: string, endpoint: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/ApiEmu/${apiName}/${entityName}/${endpoint}`);
  }

  createApiEmu(apiName: string, entityName: string, endpoint: string, data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/ApiEmu/${apiName}/${entityName}/${endpoint}`, data);
  }

  getApiEmuById(apiName: string, entityName: string, endpoint: string, id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/ApiEmu/${apiName}/${entityName}/${endpoint}/${id}`);
  }

  updateApiEmu(apiName: string, entityName: string, endpoint: string, id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/ApiEmu/${apiName}/${entityName}/${endpoint}/${id}`, data);
  }

  deleteApiEmu(apiName: string, entityName: string, endpoint: string, id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/ApiEmu/${apiName}/${entityName}/${endpoint}/${id}`);
  }
}
