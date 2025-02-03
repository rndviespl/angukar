import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Action, apiServiceShortStructure, Entity } from '../../../service/service-structure-api';
import { Subscription } from 'rxjs';
import { SwitchComponent } from "../switch/switch.component";
import { IconTrashComponent } from "../icon-trash/icon-trash.component";
import { CardApiService } from '../../../service/card-api.service';
import { RouteInfoService } from '../../../service/route-info.service';
import { tuiDialog } from '@taiga-ui/core';
import { ApiDialogComponent } from '../api-dialog/api-dialog.component';
import { CommonModule } from '@angular/common';
import { EndpointDialogComponent } from '../endpoint-dialog/endpoint-dialog.component';

@Component({
  selector: 'app-card-endpoint',
  imports: [
    SwitchComponent,
    IconTrashComponent,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './card-endpoint.component.html',
  styleUrls: ['./card-endpoint.component.css']
})
export class CardEndpointComponent {
  @Input() apiInfo!: apiServiceShortStructure;
  @Input() entityInfo!: Entity;
  @Input() actionInfo!: Action;
  @Input() apiName: string = "";
  oldName: string = "";
  actions: Action[] = [];
  sub: Subscription | null = null;
  loading: boolean = false;

  private readonly dialog = tuiDialog(EndpointDialogComponent, {
    dismissible: true,
    label: "Редактировать",
  });

  constructor(
    private cardEndpointService: CardApiService,
    private cd: ChangeDetectorRef,
  ) {}

  onToggleChange(newState: boolean) {
    this.actionInfo.isActive = newState; // Обновляем состояние в родительском компоненте
    console.log('Состояние переключателя изменилось на:', newState);

    // Вызов метода для обновления состояния сервиса
    this.cardEndpointService.updateEndpointStatus(this.apiInfo.name, this.entityInfo.name, this.actionInfo.route, newState).subscribe({
      next: (response) => {
        console.log('Состояние сервиса обновлено:', response);
      },
      error: (error) => {
        console.error('Ошибка при обновлении состояния сервиса:', error);
      }
    });
  }

  openEditDialog(): void {
    this.dialog({ ...this.actionInfo }).subscribe({
      next: (data) => {
        console.info(`Dialog emitted data = ${data} - ${this.apiInfo.name}`);

        this.cardEndpointService.updateApiEndpoint(this.apiInfo.name, this.entityInfo.name, this.actionInfo.route, data).subscribe({
          next: (response) => {
            console.log('Сущность обновлена:', response);
            this.actionInfo = data;
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
}
