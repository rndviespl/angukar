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
import { HeaderComponent } from '../../../components/header/header.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-endpoint-card-list',
  imports: [
    CommonModule,
    TuiCardLarge,
    TuiButton,
    IconTrashComponent,
    CardEndpointComponent,
    BackButtonComponent,
    HeaderComponent
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
  entityInfo: Entity = {} as Entity; // Ensure entityInfo is of type Entity
  apiInfo: apiServiceShortStructure = {} as apiServiceShortStructure;

  constructor(
    private getAction: CardApiService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private routeInfoService: RouteInfoService, // Inject the shared service
  ) { }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.apiName = params['apiServiceName'];
      this.entityName = params['entityName'];
      this.sub = this.getAction.getActionList(this.apiName, this.entityName).subscribe(it => {
        this.actions = it;
        console.log('Fetched actions:', it);
        console.log('Actions after assignment:', this.actions); // Добавленный лог
        this.cd.detectChanges();
      });
    } )
  }
}