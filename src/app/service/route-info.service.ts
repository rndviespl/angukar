import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RouteInfoService {
  private apiServiceNameKey = 'apiServiceName';
  private entityNameKey = 'entityName';
  private previousPathsKey = 'previousPaths';

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

  setPreviousPath(path: string): void {
    const previousPaths = JSON.parse(localStorage.getItem(this.previousPathsKey) || '[]');
    previousPaths.push(path);
    localStorage.setItem(this.previousPathsKey, JSON.stringify(previousPaths));
  }

  getPreviousPath(): string {
    const previousPaths = JSON.parse(localStorage.getItem(this.previousPathsKey) || '[]');
    if (previousPaths.length > 0) {
      const previousPath = previousPaths.pop();
      localStorage.setItem(this.previousPathsKey, JSON.stringify(previousPaths));
      return previousPath;
    }
    return '';
  }

  clearPreviousPaths(): void {
    localStorage.removeItem(this.previousPathsKey);
  }
}
