import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Endpoint, apiServiceShortStructure, Entity } from '../../../service/service-structure-api';
import { Subscription } from 'rxjs';
import { SwitchComponent } from "../switch/switch.component";
import { IconTrashComponent } from "../icon-trash/icon-trash.component";
import { tuiDialog, TuiAlertService } from '@taiga-ui/core';
import { ApiDialogComponent } from '../api-dialog/api-dialog.component';
import { CommonModule } from '@angular/common';
import { EndpointDialogComponent } from '../endpoint-dialog/endpoint-dialog.component';
import { EndpointRepositoryService } from '../../../repositories/endpoint-repository.service';

@Component({
  selector: 'app-card-endpoint',
  imports: [
    SwitchComponent,
    IconTrashComponent,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './card-endpoint.component.html',
  styleUrls: ['./card-endpoint.component.css', '../../styles/card.css']
})
export class CardEndpointComponent {
  @Input() entityInfo!: Entity;
  @Input() endpointInfo!: Endpoint;
  @Input() apiName: string = "";
  @Output() endpointDeleted = new EventEmitter<string>();
  oldName: string = "";
  endpoint: Endpoint[] = [];
  sub: Subscription | null = null;
  loading: boolean = false;

  private readonly dialog = tuiDialog(EndpointDialogComponent, {
    dismissible: true,
    label: "Редактировать",
  });

  constructor(
    private endpointRepositoryService: EndpointRepositoryService,
    private cd: ChangeDetectorRef,
    private alerts: TuiAlertService
  ) { }

  onToggleChange(newState: boolean) {
    this.endpointInfo.isActive = newState; // Обновляем состояние в родительском компоненте
    console.log('Состояние переключателя изменилось на:', newState);

    // Вызов метода для обновления состояния сервиса
    this.endpointRepositoryService.updateEndpointStatus(this.apiName, this.entityInfo.name, this.endpointInfo.route, newState).subscribe({
      next: (response) => {
        console.log('Состояние сервиса обновлено:', response);
      },
      error: (error) => {
        console.error('Ошибка при обновлении состояния сервиса:', error);
      }
    });
  }

  openEditDialog(): void {
    this.dialog({ ...this.endpointInfo }).subscribe({
      next: (data) => {
        console.info(`Dialog emitted data = ${data} - ${this.apiName}`);

        this.endpointRepositoryService.updateEndpoint(this.apiName, this.entityInfo.name, this.endpointInfo.route, data).subscribe({
          next: (response) => {
            console.log('Эндпоинт обновлен:', response);
            this.endpointInfo = data;
            this.cd.markForCheck();
            this.alerts
            .open('Эндпоинт успешно обновлен', {
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
              .open('Ошибка при обновлении эндпоинта', {
                appearance: 'negative',
              })
              .subscribe();
          }
            console.error('Ошибка при обновлении эндпоинта:', error);
          }
        });
      },
      complete: () => {
        console.info('Dialog closed');
      },
    });
  }

  onDeleteConfirmed(): void {
    this.endpointRepositoryService.deleteEndpoint(this.apiName, this.entityInfo.name, this.endpointInfo.route).subscribe({
      next: () => {
        console.log(`Действие "${this.endpointInfo.route}" удалено.`);
        this.endpointDeleted.emit(this.endpointInfo.route); // Emit the event to notify the parent component
      },
      error: (error) => {
        console.error('Ошибка при удалении действия:', error);
      }
    });
  }
}
