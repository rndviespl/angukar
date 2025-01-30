import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, input, OnDestroy, OnInit } from '@angular/core';
import {TuiAppearance, TuiButton, tuiDialog, TuiTitle} from '@taiga-ui/core';
import { TuiAvatar} from '@taiga-ui/kit';
import {TuiCardLarge, TuiHeader} from '@taiga-ui/layout';
import { Subscription } from 'rxjs';
import { CardApiService } from '../../../service/card-api.service';
import { Router, RouterModule } from '@angular/router';
import { apiServiceShortStructure } from '../../../service/service-structure-api';
import { SwitchComponent } from '../switch/switch.component';
import { ApiDialogComponent } from '../api-dialog/api-dialog.component';

@Component({
  selector: 'app-card-api',
  imports: [CommonModule,
    TuiAppearance,
    TuiAvatar,
    TuiButton,
    TuiCardLarge,
    TuiHeader,
    TuiTitle,
    RouterModule,
    SwitchComponent
  ],
  templateUrl: './card-api.component.html',
  styleUrl: './card-api.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CardApiComponent {
  @Input() apiInfo!: apiServiceShortStructure;
  oldName: string = "";
  private readonly dialog = tuiDialog(ApiDialogComponent, {
    dismissible: true,
    label: "Редактировать",
  });
  constructor(private cardApiService: CardApiService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}
  onToggleChange(newState: boolean) {
    this.apiInfo.isActive = newState; // Обновляем состояние в родительском компоненте
    console.log('Состояние переключателя изменилось на:', newState);

    // Вызов метода для обновления состояния сервиса
    this.cardApiService.updateServiceStatus(this.apiInfo.name, newState).subscribe({
      next: (response) => {
        console.log('Состояние сервиса обновлено:', response);
      },
      error: (error) => {
        console.error('Ошибка при обновлении состояния сервиса:', error);
      }
    });
  }
  navigateToApiDetails(apiName: string): void {
    this.router.navigate(['/ApiService', apiName]); // Переход на страницу API без передачи isActive
  }

  openEditDialog(): void {
    this.oldName = this.apiInfo.name;
    this.dialog({... this.apiInfo}).subscribe({
      next: (data) => {
        console.info(`Dialog emitted data = ${data} - ${this.apiInfo.name}}`);
        
        this.cardApiService.updateApiService(this.oldName, data).subscribe({
          next: (response) => {
            console.log('Сущность обновлена:', response);
            this.apiInfo = data;
            this.cd.markForCheck();
          },
          error: (error) => {
            console.error('Ошибка при обновлении сущности:', error);
          }
        })

      },
      complete: () => {
        console.info('Dialog closed');
      },
    });
  }

  deleteCard(card: apiServiceShortStructure) {
    console.log("delete")
  }
}
