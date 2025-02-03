import { ChangeDetectionStrategy, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Action, apiServiceShortStructure, Entity } from '../../../../service/service-structure-api';
import { CardApiService } from '../../../../service/card-api.service';
import { CommonModule, Location } from '@angular/common';
import { TuiCardLarge } from '@taiga-ui/layout';
import { TuiButton } from '@taiga-ui/core';
import { IconTrashComponent } from '../../../components/icon-trash/icon-trash.component';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { CardEndpointComponent } from '../../../components/card-endpoint/card-endpoint.component';
import { HeaderComponent } from '../../../components/header/header.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-endpoint-card-list',
  imports: [
    CommonModule,
    TuiCardLarge,
    TuiButton,
    IconTrashComponent,
    CardEndpointComponent,
    BackButtonComponent,
    RouterModule,
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
  entities: Entity[] = [];
  entityInfo: Entity = {} as Entity; // Ensure entityInfo is of type Entity
  apiInfo: apiServiceShortStructure = {} as apiServiceShortStructure;
  location: Location;

  constructor(
    private router: Router,
    private getAction: CardApiService,
    private cd: ChangeDetectorRef,
    location: Location
  ) {
    this.location = location; // Assigning the injected instance
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  ngOnInit(): void {
     // Получаем текущий путь
     const currentPath = this.router.url;
     // Извлекаем часть пути после /ApiEntity/
     const pathParts = currentPath.split('/');
     if (pathParts.length >= 4) {
       this.apiName = pathParts[2];
       this.entityName = pathParts.slice(3).join('/');
     } else {
       console.error('Invalid path format');
       return;
     }
 
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

  goBack(): void {
    console.log('Navigating back within the application...');
    this.location.back();
  }
}