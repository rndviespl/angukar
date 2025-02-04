import { Injectable } from '@angular/core';
import { EndpointServiceService as EndpointService } from '../service/endpoint-service.service';
import { Endpoint as Endpoint } from '../service/service-structure-api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EndpointRepositoryService {

  constructor(private endpointService: EndpointService) { }

  getActionList(apiServiceName: string, entityName: string): Observable<Endpoint[]> {
    return this.endpointService.getActionList(apiServiceName, entityName);
  }

  createApiAction(apiServiceName: string, entityName: string, action: Endpoint): Observable<Endpoint> {
    return this.endpointService.createApiAction(apiServiceName, entityName, action);
  }

  getApiActionByName(apiServiceName: string, entityName: string, endpointName: string): Observable<Endpoint> {
    return this.endpointService.getApiActionByName(apiServiceName, entityName, endpointName);
  }

  updateApiEndpoint(apiServiceName: string, entityName: string, endpointName: string, endpoint: Endpoint): Observable<Endpoint> {
    return this.endpointService.updateApiEndpoint(apiServiceName, entityName, endpointName, endpoint);
  }

  deleteApiAction(apiServiceName: string, entityName: string, endpointName: string): Observable<void> {
    return this.endpointService.deleteApiAction(apiServiceName, entityName, endpointName);
  }
  
  updateEndpointStatus(apiServiceName: string, entityName: string, endpointName: string, isActive: boolean): Observable<any> {
    return this.endpointService.updateEndpointStatus(apiServiceName, entityName, endpointName, isActive);
  }

}
