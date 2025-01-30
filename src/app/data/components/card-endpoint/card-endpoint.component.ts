import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Action, apiServiceShortStructure, Entity } from '../../../service/service-structure-api';
import { Subscription } from 'rxjs';
import { SwitchComponent } from "../switch/switch.component";
import { IconTrashComponent } from "../icon-trash/icon-trash.component";
import { CardApiService } from '../../../service/card-api.service';
import { RouteInfoService } from '../../../service/route-info.service';
import { tuiDialog } from '@taiga-ui/core';
import { ApiEditDialogComponent } from '../api-edit-dialog/api-edit-dialog.component';
import { CommonModule } from '@angular/common';

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

  private readonly dialog = tuiDialog(ApiEditDialogComponent, {
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
    this.cardEndpointService.updateServiceStatus(this.actionInfo.route, newState).subscribe({
      next: (response) => {
        console.log('Состояние сервиса обновлено:', response);
      },
      error: (error) => {
        console.error('Ошибка при обновлении состояния сервиса:', error);
      }
    });
  }

  openEditDialog(): void {
    this.oldName = this.apiInfo.name;
    this.dialog({ ...this.apiInfo }).subscribe({
      next: (data) => {
        console.info(`Dialog emitted data = ${data} - ${this.apiInfo.name}`);

        this.cardEndpointService.updateApiService(this.oldName, data).subscribe({
          next: (response) => {
            console.log('Сущность обновлена:', response);
            this.apiInfo = data;
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
