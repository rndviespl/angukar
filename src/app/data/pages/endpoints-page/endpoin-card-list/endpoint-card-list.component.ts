import { ChangeDetectionStrategy, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Endpoint, apiServiceShortStructure, Entity } from '../../../../service/service-structure-api';
import { CommonModule, Location } from '@angular/common';
import { TuiCardLarge } from '@taiga-ui/layout';
import { TuiButton, tuiDialog, TuiAlertService } from '@taiga-ui/core';
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
  styleUrls: ['./endpoint-card-list.component.css', '../../../styles/card-list.css'],
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
    private alerts: TuiAlertService,
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
    this.entityRepositoryService.getApiEntity(this.apiName, this.entityName).subscribe({
      next: (it) => {
        this.entityInfo = it;
        this.cd.detectChanges();
        this.loading = false
      },
      error: (error) => {
        console.error('Error fetching entity data', error);
        this.router.navigate(['/page-not-found']);
      }
    });
    this.sub = this.endpointRepositoryService.getEndpointList(this.apiName, this.entityName).subscribe({
      next: (it) => {
        this.endpoints = it;
        console.log('Fetched actions:', it);
        this.cd.detectChanges();
        this.loading = false
      },
      error: (error) => {
        console.error('Error fetching endpoint list', error);
        this.router.navigate(['/page-not-found']);
      }
    });
  }

  openCreateDialog(): void {
    this.dialog({ ...this.endpoint }).subscribe({
      next: (data) => {
        // Проверка на существование маршрута в текущем списке
        const isRouteExists = this.endpoints.some(endpoint => endpoint.route === data.route);
        if (isRouteExists) {
          this.alerts
            .open('Ошибка: Эндпоинт с таким маршрутом уже существует', {
              appearance: 'negative',
            })
            .subscribe();
          return; // Прекращаем выполнение, если эндпоинт уже существует
        }
  
        this.endpointRepositoryService.createEndpoint(this.apiName, this.entityName, data).subscribe({
          next: (response) => {
            console.log('Эндпоинт добавлен:', response);
            this.endpoints.push(data);
            this.cd.markForCheck();
            this.alerts
              .open('Эндпоинт успешно создан', {
                appearance: 'success',
              })
              .subscribe();
          },
          error: (error) => {
            if (error.status === 409) {
              this.alerts
                .open('Ошибка: Эндпоинт с таким именем уже существует', {
                  appearance: 'negative',
                })
                .subscribe();
            } else {
              this.alerts
                .open('Ошибка при создании эндпоинта', {
                  appearance: 'negative',
                })
                .subscribe();
            }
            console.error('Ошибка при создании эндпоинта:', error);
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
