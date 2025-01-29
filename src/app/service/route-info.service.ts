import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RouteInfoService {
  private apiServiceNameKey = 'apiServiceName';
  private entityNameKey = 'entityName';

  setApiServiceName(name: string): void {
    localStorage.setItem(this.apiServiceNameKey, name);
  }

  getApiServiceName(): string {
    return localStorage.getItem(this.apiServiceNameKey) || '';
  }

  setEntityName(name: string): void {
    localStorage.setItem(this.entityNameKey, name);
  }

  getEntityName(): string {
    return localStorage.getItem(this.entityNameKey) || '';
  }

  clearRouteInfo(): void {
    localStorage.removeItem(this.apiServiceNameKey);
    localStorage.removeItem(this.entityNameKey);
  }
}
