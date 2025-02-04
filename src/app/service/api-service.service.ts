import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiServiceShortStructure, ApiServiceStructure, Entity, Endpoint } from './service-structure-api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {


  private baseUrl = 'http://localhost:4200/api';

  constructor(private http: HttpClient) { }

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

  updateApiServiceStatus(serviceName: string, isActive: boolean): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/ApiService/${serviceName}/${isActive}`, null); // Передаем null, если нет тела запроса
  }

}
