import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiServiceShortStructure, apiServiceStructure } from './apiServiceStructure';

@Injectable({
  providedIn: 'root'
})
export class CardApiService {

  constructor(private http: HttpClient) { }
  
  getApiList(): Observable<apiServiceShortStructure[]> {
    return this.http.get<apiServiceShortStructure[]>('http://localhost:4200/api/ApiService'); 
  }

  getApiStructureList(name: string): Observable<apiServiceStructure[]> {
    return this.http.get<apiServiceStructure[]>(`http://localhost:4200/api/ApiService/${name}`); 
  }
  
  getApiShortStructureList(name: string): Observable<apiServiceShortStructure[]> {
    return this.http.get<apiServiceShortStructure[]>(`http://localhost:4200/api/ApiService/${name}`); 
  }
  
  updateServiceStatus(serviceName: string, isActive: boolean): Observable<any> {
    return this.http.patch<any>(`http://localhost:4200/api/ApiService/${serviceName}/${isActive}`, null); // Передаем null, если нет тела запроса
  }
  
}
