import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import {
  apiServiceShortStructure,
  ApiServiceStructure,
} from './service-structure-api';
import { TuiAlertService } from '@taiga-ui/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = `${window.location.origin}/api`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private alerts: TuiAlertService
  ) {}

  getApiList(): Observable<apiServiceShortStructure[]> {
    return this.http
      .get<apiServiceShortStructure[]>(`${this.baseUrl}/ApiService`)
      .pipe(catchError(this.handleError));
  }

  getApiStructureList(name: string): Observable<ApiServiceStructure> {
    return this.http
      .get<ApiServiceStructure>(
        `${this.baseUrl}/ApiService/${encodeURIComponent(name)}`
      )
      .pipe(catchError(this.handleError));
  }

  createApiService(
    service: apiServiceShortStructure
  ): Observable<apiServiceShortStructure> {
    return this.http
      .post<apiServiceShortStructure>(`${this.baseUrl}/ApiService`, service)
      .pipe(catchError(this.handleError));
  }

  createFullApiService(service: ApiServiceStructure): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/ApiService`, service).pipe(
      catchError(this.handleError)
    );
  }

  updateApiService(
    oldName: string,
    service: apiServiceShortStructure
  ): Observable<apiServiceShortStructure> {
    return this.http
      .put<apiServiceShortStructure>(
        `${this.baseUrl}/ApiService/${encodeURIComponent(oldName)}`,
        service
      )
      .pipe(catchError(this.handleError));
  }

  deleteApiService(serviceName: string): Observable<void> {
    return this.http
      .delete<void>(
        `${this.baseUrl}/ApiService/${encodeURIComponent(serviceName)}`
      )
      .pipe(catchError(this.handleError));
  }

  updateApiServiceStatus(
    serviceName: string,
    isActive: boolean
  ): Observable<any> {
    return this.http
      .patch<any>(
        `${this.baseUrl}/ApiService/${encodeURIComponent(
          serviceName
        )}/${isActive}`,
        null
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred', error);

    // Обработка специфичных ошибок
    if (error.error instanceof ErrorEvent) {
      // Ошибка на стороне клиента
      this.alerts
        .open('Ошибка сети или клиентская ошибка', { appearance: 'negative' })
        .subscribe();
    } else {
      // Ошибка на стороне сервера
      switch (error.status) {
        case 404:
          this.router.navigate(['/page-not-found']);
          break;
        case 409:
          this.alerts
            .open('Ошибка: API с таким именем уже существует', {
              appearance: 'negative',
            })
            .subscribe();
          break;
        case 403:
          this.alerts
            .open('Ошибка: Доступ запрещен', { appearance: 'negative' })
            .subscribe();
          break;
        case 500:
          this.alerts
            .open('Ошибка: Внутренняя ошибка сервера', {
              appearance: 'negative',
            })
            .subscribe();
          break;
        default:
          this.alerts
            .open('Ошибка при обработке запроса', { appearance: 'negative' })
            .subscribe();
          break;
      }
    }
    return throwError(error);
  }
}
