import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiServiceShortStructure, apiServiceStructure } from './apiServiceStructure';

@Injectable({
  providedIn: 'root'
})
export class CardApiService {

  constructor(private http: HttpClient) { }
  
  getApiList(): Observable<string[]> {
    return this.http.get<string[]>('http://localhost:4200/api/ApiService'); 
  }

  getApiStructureList(name: string): Observable<apiServiceStructure[]> {
    return this.http.get<apiServiceStructure[]>(`http://localhost:4200/api/ApiService/${name}`); 
  }
  
  getApiShortStructureList(name: string): Observable<apiServiceShortStructure[]> {
    return this.http.get<apiServiceShortStructure[]>(`http://localhost:4200/api/ApiService/${name}`); 
  }
  
}
