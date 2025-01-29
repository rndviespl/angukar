import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnDestroy, OnInit } from '@angular/core';
import { Action, apiServiceShortStructure, Entity } from '../../../../service/service-structure-api';
import { Subscription } from 'rxjs';
import { CardApiService } from '../../../../service/card-api.service';
import { CommonModule } from '@angular/common';
import { RouteInfoService } from '../../../../service/route-info.service';

@Component({
  selector: 'app-endpoint-card-list',
  imports: [
    CommonModule,
  ],
  templateUrl: './endpoint-card-list.component.html',
  styleUrls: ['./endpoint-card-list.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EndpointCardListComponent implements OnInit, OnDestroy {
  @Input() apiServiceName!: string;
  @Input() entityName!: string;
  @Input() apiInfo!: apiServiceShortStructure;
  @Input() entityInfo!: Entity;
  actions: Action[] = [];
  sub: Subscription | null = null;
  entities: Entity[] = [];
  apiName!: string;

  constructor(
    private getAction: CardApiService,
    private routeInfoService: RouteInfoService // Inject the shared service
  ) { }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  ngOnInit(): void {
    this.apiServiceName = this.routeInfoService.getApiServiceName(); // Get API name
    this.entityName = this.routeInfoService.getEntityName(); // Get entity name

    console.log('apiServiceName:', this.apiServiceName);
    console.log('entityName:', this.entityName);

    if (this.apiServiceName && this.entityName) {
      this.sub = this.getAction.getActionList(this.apiServiceName, this.entityName).subscribe(it => {
        this.actions = it;
        console.log('Fetched actions:', it);
      });
    } else {
      console.error('apiServiceName or entityName is undefined');
    }
  }
}

