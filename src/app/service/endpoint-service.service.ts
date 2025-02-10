import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Endpoint } from './service-structure-api';
import { TuiAlertService } from '@taiga-ui/core';

@Injectable({
  providedIn: 'root'
})
export class EndpointService {
  private baseUrl = `${window.location.origin}/api`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private alerts: TuiAlertService
  ) { }

  getEndpointList(apiServiceName: string, entityName: string): Observable<Endpoint[]> {
    return this.http.get<Endpoint[]>(`${this.baseUrl}/ApiAction/${apiServiceName}/${entityName}`).pipe(
      catchError(this.handleError)
    );
  }

  createEndpoint(apiServiceName: string, entityName: string, action: Endpoint): Observable<Endpoint> {
    return this.http.post<Endpoint>(`${this.baseUrl}/ApiAction/${apiServiceName}/${entityName}`, action).pipe(
      catchError(this.handleError)
    );
  }

  getEndpointByName(apiServiceName: string, entityName: string, actionName: string): Observable<Endpoint> {
    return this.http.get<Endpoint>(`${this.baseUrl}/ApiAction/${apiServiceName}/${entityName}/${actionName}`).pipe(
      catchError(this.handleError)
    );
  }

  updateEndpoint(apiServiceName: string, entityName: string, actionName: string, action: Endpoint): Observable<Endpoint> {
    return this.http.put<Endpoint>(`${this.baseUrl}/ApiAction/${apiServiceName}/${entityName}/${actionName}`, action).pipe(
      catchError(this.handleError)
    );
  }

  deleteEndpoint(apiServiceName: string, entityName: string, actionName: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/ApiAction/${apiServiceName}/${entityName}/${actionName}`).pipe(
      catchError(this.handleError)
    );
  }

  updateEndpointStatus(serviceName: string, entityName: string, endpoint: string, isActive: boolean): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/ApiAction/${serviceName}/${entityName}/${endpoint}/${isActive}`, null).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred', error);

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      this.alerts.open('Ошибка сети или клиентская ошибка', { appearance: 'negative' }).subscribe();
    } else {
      // Server-side error
      switch (error.status) {
        case 404:
          this.router.navigate(['/page-not-found']);
          break;
        case 409:
          this.alerts.open('Ошибка: Эндпоинт с таким именем уже существует', { appearance: 'negative' }).subscribe();
          break;
        case 403:
          this.alerts.open('Ошибка: Доступ запрещен', { appearance: 'negative' }).subscribe();
          break;
        case 500:
          this.alerts.open('Ошибка: Внутренняя ошибка сервера', { appearance: 'negative' }).subscribe();
          break;
        default:
          this.alerts.open('Ошибка при обработке запроса', { appearance: 'negative' }).subscribe();
          break;
      }
    }
    return throwError(error);
  }
}
