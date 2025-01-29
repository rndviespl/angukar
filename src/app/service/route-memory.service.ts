import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { CardApiService } from './card-api.service'; // Импортируйте ваш API сервис
import { Action, Entity } from './service-structure-api'; // Импортируйте интерфейс Entity

@Injectable({
  providedIn: 'root'
})
export class RouteMemoryService {
  private cache: { [key: string]: BehaviorSubject<any> } = {};
  private entityCache: { [key: string]: BehaviorSubject<Entity[]> } = {}; // Кэш для сущностей

  constructor(private apiService: CardApiService) {}

  getData(apiName: string): Observable<any> {
    if (!this.cache[apiName]) {
      this.cache[apiName] = new BehaviorSubject(null);
      this.fetchData(apiName);
    }
    return this.cache[apiName].asObservable();
  }

  getEntityData(apiServiceName: string): Observable<Entity[]> {
    if (!this.entityCache[apiServiceName]) {
      this.entityCache[apiServiceName] = new BehaviorSubject<Entity[]>([]); // Указываем тип явно
      this.fetchEntityData(apiServiceName);
    }
    return this.entityCache[apiServiceName].asObservable();
  }

  private fetchData(apiName: string): void {
    this.apiService.getApiStructureList(apiName).subscribe(data => {
      this.cache[apiName].next(data);
    });
  }

  private fetchEntityData(apiServiceName: string): void {
    this.apiService.getApiEntityList(apiServiceName).subscribe(data => {
      this.entityCache[apiServiceName].next(data);
    });
  }

  // Метод для проверки обновлений
  checkForUpdates(apiName: string): void {
    if (this.cache[apiName]) {
      this.fetchData(apiName);
    }
  }

  checkForEntityUpdates(apiServiceName: string): void {
    if (this.entityCache[apiServiceName]) {
      this.fetchEntityData(apiServiceName);
    }
  }
  getActionList(apiServiceName: string, entityName: string): Observable<Entity> {
    return this.apiService.getActionList(apiServiceName, entityName).pipe(
      map((actions: Action[]) => {
        // Create an Entity object that includes the actions
        const entity: Entity = {
          name: entityName, // Assuming you have a name property
          actions: actions,
          isActive: true, 
          structure: {},
        };
        return entity;
      })
    );
  }
}