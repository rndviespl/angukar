import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiServiceShortStructure, ApiServiceStructure, Entity, Endpoint } from './service-structure-api';

@Injectable({
  providedIn: 'root'
})
export class EndpointServiceService {


  private baseUrl = 'http://localhost:4200/api';

  constructor(private http: HttpClient) { }

  getEndpointList(apiServiceName: string, entityName: string): Observable<Endpoint[]> {
    return this.http.get<Endpoint[]>(`${this.baseUrl}/ApiAction/${apiServiceName}/${entityName}`);
  }

  createEndpoint(apiServiceName: string, entityName: string, action: Endpoint): Observable<Endpoint> {
    return this.http.post<Endpoint>(`${this.baseUrl}/ApiAction/${apiServiceName}/${entityName}`, action);
  }

  getEndpointByName(apiServiceName: string, entityName: string, actionName: string): Observable<Endpoint> {
    return this.http.get<Endpoint>(`${this.baseUrl}/ApiAction/${apiServiceName}/${entityName}/${actionName}`);
  }

  updateEndpoint(apiServiceName: string, entityName: string, actionName: string, action: Endpoint): Observable<Endpoint> {
    return this.http.put<Endpoint>(`${this.baseUrl}/ApiAction/${apiServiceName}/${entityName}/${actionName}`, action);
  }

  deleteEndpoint(apiServiceName: string, entityName: string, actionName: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/ApiAction/${apiServiceName}/${entityName}/${actionName}`);
  }

  updateEndpointStatus(serviceName: string, entityName: string, endpoint: string, isActive: boolean): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/ApiAction/${serviceName}/${entityName}/${endpoint}/${isActive}`, null); // Передаем null, если нет тела запроса
  }

}
