import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, input, OnDestroy, OnInit, Output } from '@angular/core';
import { TuiAppearance, TuiButton, tuiDialog, TuiTitle, TuiAlertService } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import { Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { apiServiceShortStructure } from '../../../service/service-structure-api';
import { SwitchComponent } from '../switch/switch.component';
import { ApiDialogComponent } from '../api-dialog/api-dialog.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { IconTrashComponent } from '../icon-trash/icon-trash.component';
import { ApiServiceRepositoryService } from '../../../repositories/api-service-repository.service';

@Component({
  selector: 'app-card-api',
  imports: [
    CommonModule,
    TuiAppearance,
    TuiAvatar,
    TuiButton,
    TuiCardLarge,
    TuiHeader,
    TuiTitle,
    RouterModule,
    SwitchComponent,
    IconTrashComponent,
  ],

  templateUrl: './card-api.component.html',
  styleUrl: './card-api.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CardApiComponent {
  @Input() apiInfo!: apiServiceShortStructure;
  @Output() apiDeleted = new EventEmitter<void>();
  oldName: string = "";
  location: Location;

  private readonly dialog = tuiDialog(ApiDialogComponent, {
    dismissible: true,
    label: "Редактировать",
  });

  constructor(
    private apiServiceRepository: ApiServiceRepositoryService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private alerts: TuiAlertService,
    location: Location // Injecting Location correctly
  ) {
    this.location = location; // Assigning the injected instance
  }
  onToggleChange(newState: boolean) {
    this.apiInfo.isActive = newState; // Обновляем состояние в родительском компоненте
    console.log('Состояние переключателя изменилось на:', newState);

    // Вызов метода для обновления состояния сервиса
    this.apiServiceRepository.updateApiServiceStatus(this.apiInfo.name, newState).subscribe({
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
    this.dialog({ ... this.apiInfo }).subscribe({
      next: (data) => {
        console.info(`Dialog emitted data = ${data} - ${this.apiInfo.name}}`);

        this.apiServiceRepository.updateApiService(this.oldName, data).subscribe({
          next: (response) => {
            console.log('API обновлена:', response);
            this.apiInfo = data;
            this.cd.markForCheck();
            this.alerts
              .open('API успешно обновлено', {
                appearance: 'success',
              })
              .subscribe();
          },
          error: (error) => {
            if (error.status === 409) {
              this.alerts
                .open('Ошибка: API с таким именем уже существует', {
                  appearance: 'negative',
                })
                .subscribe();
            } else {
              this.alerts
                .open('Ошибка при обновлении API', {
                  appearance: 'negative',
                })
                .subscribe();
            }
          }
        })
      },
      complete: () => {
        console.info('Dialog closed');
      },
    });
  }

  onDeleteConfirmed(): void {
    this.apiServiceRepository.deleteApiService(this.apiInfo.name).subscribe({
      next: () => {
        console.log(`Сервис "${this.apiInfo.name}" удален.`);
        this.apiDeleted.emit(); // Emit the event to notify the parent component
      },
      error: (error) => {
        console.error('Ошибка при удалении сервиса:', error);
      }
    });
  }
}
