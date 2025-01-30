import { ChangeDetectionStrategy, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Action, apiServiceShortStructure, Entity } from '../../../../service/service-structure-api';
import { CardApiService } from '../../../../service/card-api.service';
import { CommonModule } from '@angular/common';
import { RouteInfoService } from '../../../../service/route-info.service';
import { TuiCardLarge } from '@taiga-ui/layout';
import { TuiButton } from '@taiga-ui/core';
import { IconTrashComponent } from '../../../components/icon-trash/icon-trash.component';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { CardEndpointComponent } from '../../../components/card-endpoint/card-endpoint.component';

@Component({
  selector: 'app-endpoint-card-list',
  imports: [
    CommonModule,
    TuiCardLarge,
    TuiButton,
    IconTrashComponent,
    CardEndpointComponent,
    BackButtonComponent
  ],
  
  templateUrl: './endpoint-card-list.component.html',
  styleUrls: ['./endpoint-card-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EndpointCardListComponent implements OnInit, OnDestroy {
  apiName!: string;
  entityName!: string;
  loading: boolean = false;
  sub: Subscription | null = null;
  actions: Action[] = [];
  entities: Entity[] = [];
  entityInfo: Entity = {} as Entity; // Ensure entityInfo is of type Entity
  apiInfo: apiServiceShortStructure = {} as apiServiceShortStructure;

  constructor(
    private getAction: CardApiService,
    private cd: ChangeDetectorRef,
    private routeInfoService: RouteInfoService, // Inject the shared service
  ) { }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  ngOnInit(): void {
    this.apiName = this.routeInfoService.getApiServiceName(); // Get API name
    this.entityName = this.routeInfoService.getEntityName(); // Get entity name

    console.log('apiServiceName:', this.apiName);
    console.log('entityName:', this.entityName);

    if (this.apiName && this.entityName) {
      this.sub = this.getAction.getActionList(this.apiName, this.entityName).subscribe(it => {
        this.actions = it;
        console.log('Fetched actions:', it);
        console.log('Actions after assignment:', this.actions); // Добавленный лог
        this.cd.detectChanges();
      });
    } else {
      console.error('apiServiceName or entityName is undefined');
    }
  }
}