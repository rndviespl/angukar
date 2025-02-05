import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, switchMap } from 'rxjs';
import { RouteMemoryService } from '../../../service/route-memory.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceStructure, Entity, apiServiceShortStructure } from '../../../service/service-structure-api';
import { CommonModule } from '@angular/common';
import { TuiCardLarge } from '@taiga-ui/layout';
import { tuiDialog, TuiAlertService  } from '@taiga-ui/core';
import { CardEntityComponent } from '../../components/card-entity/card-entity.component';
import { HeaderComponent } from '../../components/header/header.component';
import { SwitchComponent } from '../../components/switch/switch.component';
import { EntityDialogComponent } from '../../components/entity-dialog/entity-dialog.component';
import { EntityRepositoryService } from '../../../repositories/entity-repository.service';
import { ApiServiceRepositoryService } from '../../../repositories/api-service-repository.service';
import { LoadingComponent } from "../../components/loading/loading.component";

@Component({
  selector: 'app-entity-card-list',
  imports: [
    TuiCardLarge,
    CommonModule,
    CardEntityComponent,
    HeaderComponent,
    SwitchComponent,
    LoadingComponent
  ],
  templateUrl: './entity-card-list.component.html',
  styleUrls: ['./entity-card-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityCardListComponent implements OnInit, OnDestroy {
  entities: Entity[] = [];
  sub: Subscription | null = null;
  apiName!: string;
  loading: boolean = true;
  apiInfo: apiServiceShortStructure = {} as apiServiceShortStructure;
  private readonly dialog = tuiDialog(EntityDialogComponent, {
    dismissible: true,
    label: "Создать",
  });
  entity: Entity = {
    name: '',
    isActive: false,
    structure: null,
    actions: []
  };

  constructor(
    private routeMemoryService: RouteMemoryService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private entityRepositoryService: EntityRepositoryService,
    private apiServiceRepositoryService: ApiServiceRepositoryService,
    private alerts: TuiAlertService
  ) {}

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => {
        this.apiName = params['name'];
        if (!this.apiName) {
          throw new Error('API name is null');
        }
        return this.apiServiceRepositoryService.getApiList();
      }),
      switchMap(apiList => {
        if (!apiList.some(api => api.name === this.apiName)) {
          throw new Error(`API не найден: ${this.apiName}`);
        }
        return this.routeMemoryService.getApiData(this.apiName);
      })
    ).subscribe({
      next: (apiStructure: ApiServiceStructure) => {
        if (apiStructure) {
          this.entities = apiStructure.entities;
          this.apiInfo = apiStructure;
          this.cd.markForCheck();
          this.loading = false;
        }
      },
      error: (error: any) => {
        console.error('Error:', error.message || error);
        this.router.navigate(['/page-not-found']);
      }
    });
  }
  
  onToggleChange(newState: boolean) {
    this.apiInfo.isActive = newState;
    console.log('Состояние переключателя изменилось на:', newState);

    this.apiServiceRepositoryService.updateApiServiceStatus(this.apiName, newState).subscribe({
      next: (response: any) => {
        console.log('Состояние сервиса обновлено:', response);
      },
      error: (error: any) => {
        console.error('Ошибка при обновлении состояния сервиса:', error);
      }
    });
  }

  openCreateDialog(): void {
    this.dialog({ ...this.entity }).subscribe({
      next: (data: Entity) => {
        const isNameExists = this.entities.some(entity => entity.name === data.name);
        if (isNameExists) {
          this.alerts
            .open('Ошибка: Сущность с таким именем уже существует', {
              appearance: 'negative',
            })
            .subscribe();
          return;
        }
  
        this.entityRepositoryService.createApiEntity(this.apiName, data).subscribe({
          next: (response) => {
            console.log('Cущность добавлена:', response);
            this.entities.push(data);
            this.cd.markForCheck();
            this.alerts
              .open('Сущность успешно создана', {
                appearance: 'success',
              })
              .subscribe();
          },
          error: (error: any) => {
            if (error.status === 409) {
              this.alerts
                .open('Ошибка: Сущность с таким именем уже существует', {
                  appearance: 'negative',
                })
                .subscribe();
            } else {
              this.alerts
                .open('Ошибка при создании сущности', {
                  appearance: 'negative',
                })
                .subscribe();
            }
            console.error('Ошибка при создании сущности:', error);
          }
        });
      },
      complete: () => {
        console.info('Dialog closed');
      },
    });
  }

  onEntityDeleted(entityName: string): void {
    this.entities = this.entities.filter(entity => entity.name !== entityName);
    this.cd.markForCheck();
  }
}
