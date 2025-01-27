import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TuiPlatform } from '@taiga-ui/cdk/directives/platform';
import { TuiAppearance, TuiButton, TuiTitle } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import { Subscription } from 'rxjs';
import { RouteMemoryService } from '../../../service/route-memory.service'; // Импортируйте ваш сервис кэширования
import { SwitchSecondPageComponent } from "../switch/switch.component";
import { ActivatedRoute } from '@angular/router';
import { Entity } from '../../../service/service-structure-api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-with-entity',
  imports: [
    TuiAppearance,
    TuiAvatar,
    TuiButton,
    TuiCardLarge,
    TuiHeader,
    TuiPlatform,
    TuiTitle,
    SwitchSecondPageComponent,
    CommonModule 
  ],
  templateUrl: './card-with-entity.component.html',
  styleUrls: ['./card-with-entity.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardWithEntityComponent implements OnInit, OnDestroy {
  entity: Entity[] = [];
  sub: Subscription | null = null;
  apiName: string | null = null;
  intervalId: any; // Для хранения идентификатора интервала

  constructor(
    private routeMemoryService: RouteMemoryService, // Используем сервис кэширования
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {}

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    clearInterval(this.intervalId); // Очищаем интервал
  }

  ngOnInit(): void {
    // Получаем имя API из параметров маршрута
    this.route.params.subscribe(params => {
      this.apiName = params['name']; // Получаем имя API
  
      // Проверяем, что apiName не null
      if (this.apiName) {
        // Теперь используем RouteMemoryService для получения данных
        this.sub = this.routeMemoryService.getData(this.apiName).subscribe(apiStructure => {
          if (apiStructure) {
            this.entity = apiStructure.entities;
            console.log(this.entity);
            this.cd.markForCheck(); // Используем markForCheck вместо detectChanges
          }
        });
  
        // Устанавливаем интервал для автоматического обновления данных
        this.intervalId = setInterval(() => {
          this.refreshData();
        }, 3000); // Обновление каждые 30 секунд
      } else {
        console.error('API name is null');
      }
    });
  }
  
  // Метод для обновления данных
  refreshData(): void {
    if (this.apiName) {
      this.routeMemoryService.checkForUpdates(this.apiName);
    }
  }
}
