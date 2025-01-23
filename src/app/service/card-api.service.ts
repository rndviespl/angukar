import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardApiService {

  constructor(private http: HttpClient) { }
  
  getApiList(): Observable<string[]> {
    return this.http.get<string[]>('http://localhost:4200/api/ApiService'); 
  }
}
