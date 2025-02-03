import { ChangeDetectionStrategy, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Action, apiServiceShortStructure, Entity } from '../../../../service/service-structure-api';
import { CardApiService } from '../../../../service/card-api.service';
import { CommonModule } from '@angular/common';
import { RouteInfoService } from '../../../../service/route-info.service';
import { TuiCardLarge } from '@taiga-ui/layout';
import { TuiButton, tuiDialog } from '@taiga-ui/core';
import { IconTrashComponent } from '../../../components/icon-trash/icon-trash.component';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { CardEndpointComponent } from '../../../components/card-endpoint/card-endpoint.component';
import { HeaderComponent } from '../../../components/header/header.component';
import { ActivatedRoute } from '@angular/router';
import { EndpointDialogComponent } from '../../../components/endpoint-dialog/endpoint-dialog.component';
import { SwitchComponent } from '../../../components/switch/switch.component';
import { CardEntityComponent } from "../../../components/card-entity/card-entity.component";
@Component({
  selector: 'app-endpoint-card-list',
  imports: [
    CommonModule,
    TuiCardLarge,
    TuiButton,
    IconTrashComponent,
    CardEndpointComponent,
    BackButtonComponent,
    HeaderComponent,
    SwitchComponent,
    CardEntityComponent
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
  private readonly dialog = tuiDialog(EndpointDialogComponent, {
    dismissible: true,
    label: "Создать",
  });
  action:Action = {
    route: '',
    type: 'get',
    isActive: false
  };
  constructor(
    private getAction: CardApiService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private routeInfoService: RouteInfoService, // Inject the shared service
    private cardEndpointService: CardApiService,
  ) { }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.apiName = params['apiServiceName'];
      this.entityName = params['entityName'];
      this.getAction.getApiEntity(this.apiName,this.entityName).subscribe(it => {
        this.entityInfo = it;
        this.cd.detectChanges();
      });
      this.sub = this.getAction.getActionList(this.apiName, this.entityName).subscribe(it => {
        this.actions = it;
        console.log('Fetched actions:', it);
        console.log('Actions after assignment:', this.actions); // Добавленный лог
        this.cd.detectChanges();
      });
    } )
  }

  openCreateDialog(): void {
    this.dialog({ ...this.action }).subscribe({
      next: (data) => {
        console.info(`Dialog emitted data = ${data} - ${this.apiInfo.name}`);

        this.cardEndpointService.createApiAction(this.apiName, this.entityName, data).subscribe({
          next: (response) => {
            console.log('Сущность обновлена:', response);
            this.actions.push(data);
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
    this.apiInfo.isActive = newState; // Update state in parent component
    console.log('Состояние переключателя изменилось на:', newState);

    // Call method to update service status
    this.cardEndpointService.updateEntityStatus(this.apiName, this.entityName, newState).subscribe({
      next: (response) => {
        console.log('Состояние сервиса обновлено:', response);
      },
      error: (error) => {
        console.error('Ошибка при обновлении состояния сервиса:', error);
      }
    });
  }
}