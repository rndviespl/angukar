import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RouteMemoryService } from '../../../../service/route-memory.service';
import { ActivatedRoute } from '@angular/router';
import { Entity, EntityShort } from '../../../../service/service-structure-api';
import { CommonModule } from '@angular/common';
import { TuiCardLarge } from '@taiga-ui/layout';
import { TuiButton } from '@taiga-ui/core';
import { CardApiService } from '../../../../service/card-api.service';
import { IconTrashComponent } from "../../../second-page-with-entity/icon-trash/icon-trash.component";
import { SwitchComponent } from '../../../first-page-with-card-api/switch/switch.component';

@Component({
  selector: 'app-entity-card-list',
  imports: [
    TuiCardLarge,
    TuiButton,
    SwitchComponent,
    CommonModule,
    IconTrashComponent
],
  templateUrl: './entity-card-list.component.html',
  styleUrls: ['./entity-card-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityCardListComponent implements OnInit, OnDestroy {
  entity: Entity[] = [];
  sub: Subscription | null = null;
  apiName: string | null = null;
@Input() entityInfo!: EntityShort;
  constructor(
    private routeMemoryService: RouteMemoryService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private cardEntityService: CardApiService,
  ) {}

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.apiName = params['name'];

      if (this.apiName) {
        this.sub = this.routeMemoryService.getData(this.apiName).subscribe(apiStructure => {
          if (apiStructure) {
            this.entity = apiStructure.entities;
            this.cd.markForCheck();
          }
        });
      } else {
        console.error('API name is null');
      }
    });
  }
  onToggleChange(newState: boolean) {
    this.entityInfo.isActive = newState; // Обновляем состояние в родительском компоненте
    console.log('Состояние переключателя изменилось на:', newState);

    // Вызов метода для обновления состояния сервиса
    this.cardEntityService.updateServiceStatus(this.entityInfo.name, newState).subscribe({
      next: (response) => {
        console.log('Состояние сервиса обновлено:', response);
      },
      error: (error) => {
        console.error('Ошибка при обновлении состояния сервиса:', error);
      }
    });
  }

}
