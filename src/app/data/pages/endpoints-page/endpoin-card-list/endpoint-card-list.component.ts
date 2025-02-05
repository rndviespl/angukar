import { ChangeDetectionStrategy, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Endpoint, apiServiceShortStructure, Entity } from '../../../../service/service-structure-api';
import { CommonModule, Location } from '@angular/common';
import { TuiCardLarge } from '@taiga-ui/layout';
import { TuiButton, tuiDialog } from '@taiga-ui/core';
import { IconTrashComponent } from '../../../components/icon-trash/icon-trash.component';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { CardEndpointComponent } from '../../../components/card-endpoint/card-endpoint.component';
import { HeaderComponent } from '../../../components/header/header.component';
import { Router, RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { EndpointDialogComponent } from '../../../components/endpoint-dialog/endpoint-dialog.component';
import { SwitchComponent } from '../../../components/switch/switch.component';
import { CardEntityComponent } from "../../../components/card-entity/card-entity.component";
import { EndpointRepositoryService } from '../../../../repositories/endpoint-repository.service';
import { EntityRepositoryService } from '../../../../repositories/entity-repository.service';
import { LoadingComponent } from '../../../components/loading/loading.component';

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
    HeaderComponent,
    SwitchComponent,
    CardEntityComponent,
    LoadingComponent
  ],
  templateUrl: './endpoint-card-list.component.html',
  styleUrls: ['./endpoint-card-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EndpointCardListComponent implements OnInit, OnDestroy {
  apiName!: string;
  entityName!: string;
  loading: boolean = true;
  sub: Subscription | null = null;
  endpoints: Endpoint[] = [];
  entityInfo: Entity = {} as Entity;
  apiInfo: apiServiceShortStructure = {} as apiServiceShortStructure;
  location: Location;

  private readonly dialog = tuiDialog(EndpointDialogComponent, {
    dismissible: true,
    label: "Создать",
  });
  endpoint: Endpoint = {
    route: '',
    type: 'get',
    isActive: false
  };

  constructor(
    private router: Router,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private endpointRepositoryService: EndpointRepositoryService,
    private entityRepositoryService: EntityRepositoryService,
    location: Location
  ) {
    this.location = location;
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.apiName = params['apiServiceName'];
      this.entityName = params['entityName'];
      this.loadData();
    });
  }

  loadData(): void {
    this.entityRepositoryService.getApiEntity(this.apiName, this.entityName).subscribe(it => {
      this.entityInfo = it;
      this.cd.detectChanges();
      this.loading = false
    });
    this.sub = this.endpointRepositoryService.getEndpointList(this.apiName, this.entityName).subscribe({
      next: (it) => {
        this.endpoints = it;
        console.log('Fetched actions:', it);
        this.cd.detectChanges();
        this.loading = false
      },
    });
  }

  openCreateDialog(): void {
    this.dialog({ ...this.endpoint }).subscribe({
      next: (data) => {
        this.endpointRepositoryService.createEndpoint(this.apiName, this.entityName, data).subscribe({
          next: (response) => {
            console.log('Сущность обновлена:', response);
            this.endpoints.push(data);
            this.cd.markForCheck();
          },
          error: (error) => {
            console.error('Ошибка при обновлении сущности:', error);
          }
        });
      },
      complete: () => {
        console.info('Dialog closed');
      },
    });
  }

  onToggleChange(newState: boolean) {
    this.apiInfo.isActive = newState;
    console.log('Состояние переключателя изменилось на:', newState);

    this.entityRepositoryService.updateEntityStatus(this.apiName, this.entityName, newState).subscribe({
      next: (response) => {
        console.log('Состояние сервиса обновлено:', response);
      },
      error: (error) => {
        console.error('Ошибка при обновлении состояния сервиса:', error);
      }
    });
  }

  onEndpointDeleted(endpointRoute: string): void {
    this.endpoints = this.endpoints.filter(endpoint => endpoint.route !== endpointRoute);
    this.cd.markForCheck();
  }
}
