import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CardApiService } from './card-api.service'; // Импортируйте ваш API сервис

@Injectable({
  providedIn: 'root'
})
export class RouteMemoryService {
  private cache: { [key: string]: BehaviorSubject<any> } = {};

  constructor(private apiService: CardApiService) {}

  getData(apiName: string): Observable<any> {
    if (!this.cache[apiName]) {
      this.cache[apiName] = new BehaviorSubject(null);
      this.fetchData(apiName);
    }
    return this.cache[apiName].asObservable();
  }

  private fetchData(apiName: string): void {
    this.apiService.getApiStructureList(apiName).subscribe(data => {
      this.cache[apiName].next(data);
    });
  }

  // Метод для проверки обновлений
  checkForUpdates(apiName: string): void {
    if (this.cache[apiName]) {
      this.fetchData(apiName);
    }
  }
}