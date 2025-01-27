import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, input, OnDestroy, OnInit } from '@angular/core';
import {TuiAppearance, TuiButton, TuiTitle} from '@taiga-ui/core';
import { TuiAvatar} from '@taiga-ui/kit';
import {TuiCardLarge, TuiHeader} from '@taiga-ui/layout';
import { Subscription } from 'rxjs';
import { CardApiService } from '../../../service/card-api.service';
import { SwitchComponent } from "../switch/switch.component";
import { AccordionComponent } from "../accordion/accordion.component";
import { apiServiceShortStructure, apiServiceStructure } from '../../../service/apiServiceStructure';

@Component({
  selector: 'app-card-api',
  imports: [CommonModule,
    TuiAppearance,
    TuiAvatar,
    TuiButton,
    TuiCardLarge,
    TuiHeader,
    TuiTitle,
    SwitchComponent, AccordionComponent],
  templateUrl: './card-api.component.html',
  styleUrl: './card-api.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardApiComponent {
  @Input() apiInfo!: apiServiceShortStructure;
  
  constructor(private cardApiService: CardApiService) {}

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
  
}  