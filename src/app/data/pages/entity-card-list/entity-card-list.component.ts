import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable, Subscription, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApiServiceStructure,
  Entity,
} from '../../../service/service-structure-api';
import { CommonModule } from '@angular/common';
import { TuiCardLarge } from '@taiga-ui/layout';
import { tuiDialog, TuiAlertService } from '@taiga-ui/core';
import { CardEntityComponent } from '../../components/card-entity/card-entity.component';
import { HeaderComponent } from '../../components/header/header.component';
import { SwitchComponent } from '../../components/switch/switch.component';
import { EntityDialogComponent } from '../../components/entity-dialog/entity-dialog.component';
import { ApiService } from '../../../service/api-service.service';
import { EntityRepositoryService } from '../../../repositories/entity-repository.service';
import { LoadingComponent } from '../../components/loading/loading.component';

@Component({
  selector: 'app-entity-card-list',
  imports: [
    TuiCardLarge,
    CommonModule,
    CardEntityComponent,
    HeaderComponent,
    SwitchComponent,
    LoadingComponent,
  ],
  templateUrl: './entity-card-list.component.html',
  styleUrls: ['./entity-card-list.component.css', '../../styles/card-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityCardListComponent implements OnInit, OnDestroy {
  entities: Entity[] = [];
  private sub: Subscription | null = null;
  apiName!: string;
  loading: boolean = true;
  apiInfo: ApiServiceStructure = {} as ApiServiceStructure;

  private readonly dialog = tuiDialog(EntityDialogComponent, {
    dismissible: true,
    label: 'Создать',
  });

  entity: Entity = {
    name: '',
    isActive: false,
    structure: null,
    actions: [],
  };

  constructor(
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private entityRepositoryService: EntityRepositoryService,
    private alerts: TuiAlertService
  ) {}

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  ngOnInit(): void {
    this.loadData();
  }

  onToggleChange(newState: boolean): void {
    this.updateApiServiceStatus(newState);
  }

  openCreateDialog(): void {
    this.dialog({ ...this.entity }).subscribe({
      next: (data) => this.handleCreateDialogData(data),
      complete: () => console.info('Dialog closed'),
    });
  }

  onEntityDeleted(entityName: string): void {
    this.entities = this.entities.filter(
      (entity) => entity.name !== entityName
    );
    this.cd.markForCheck();
  }

  private loadData(): void {
    this.sub = this.route.params
      .pipe(switchMap((params) => this.fetchApiData(params['name'])))
      .subscribe({
        next: (apiStructure) => this.handleApiStructureResponse(apiStructure),
        error: (error) => this.handleError('Ошибка при загрузке данных', error),
      });
  }

  private fetchApiData(apiName: string): Observable<ApiServiceStructure> {
    if (!apiName) {
      throw new Error('API name is null');
    }
    this.apiName = apiName;
    return this.apiService.getApiStructureList(this.apiName);
  }

  private handleApiStructureResponse(apiStructure: ApiServiceStructure): void {
    this.apiInfo = apiStructure;
    this.entities = apiStructure.entities;
    this.loading = false;
    this.cd.markForCheck();
  }

  private updateApiServiceStatus(newState: boolean): void {
    this.apiInfo.isActive = newState;
    this.apiService.updateApiServiceStatus(this.apiName, newState).subscribe({
      next: (response) => console.log('Состояние сервиса обновлено:', response),
      error: (error) =>
        this.handleError('Ошибка при обновлении состояния сервиса', error),
    });
  }

  private handleCreateDialogData(data: Entity): void {
    if (this.isEntityNameExists(data.name)) {
      this.alerts
        .open('Ошибка: Сущность с таким именем уже существует', {
          appearance: 'negative',
        })
        .subscribe();
      return;
    }
    this.createEntity(data);
  }

  private isEntityNameExists(name: string): boolean {
    return this.entities.some((entity) => entity.name === name);
  }

  private createEntity(data: Entity): void {
    this.entityRepositoryService.createApiEntity(this.apiName, data).subscribe({
      next: (response) => this.handleEntityCreation(response, data),
      error: (error) => this.handleError('Ошибка при создании сущности', error),
    });
  }

  private handleEntityCreation(response: Entity, data: Entity): void {
    console.log('Сущность добавлена:', response);
    this.entities.push(data);
    this.cd.markForCheck();
    this.alerts
      .open('Сущность успешно создана', { appearance: 'success' })
      .subscribe();
  }

  private handleError(message: string, error: any): void {
    console.error(message, error);
    this.router.navigate(['/page-not-found']);
  }
}
