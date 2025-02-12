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
import { FilterByInputComponent } from '../../components/filter-by-input/filter-by-input.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';

@Component({
  selector: 'app-entity-card-list',
  imports: [
    TuiCardLarge,
    CommonModule,
    CardEntityComponent,
    HeaderComponent,
    SwitchComponent,
    LoadingComponent,
    FilterByInputComponent,
    PaginationComponent,
  ],
  templateUrl: './entity-card-list.component.html',
  styleUrls: ['./entity-card-list.component.css', '../../styles/card-list.css', '../../styles/icon.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityCardListComponent implements OnInit, OnDestroy {
  entities: Entity[] = [];
  filteredEntities: Entity[] = [];
  entityNames: string[] = [];
  private sub: Subscription | null = null;
  apiName!: string;
  loading: boolean = true;
  apiInfo: ApiServiceStructure = {} as ApiServiceStructure;
  isSortedAscending: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 16;
  searchQueryActive = false;

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
    this.filterEntities();
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
    this.filterEntities();
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
    this.filterEntities();
    this.sortCards();
    this.cd.markForCheck();
    this.alerts
      .open('Сущность успешно создана', { appearance: 'success' })
      .subscribe();
  }

  private handleError(message: string, error: any): void {
    console.error(message, error);
    this.router.navigate(['/page-not-found']);
  }

  sortCards(): void {
    if (this.isSortedAscending) {
      this.filteredEntities.sort((a, b) => a.name.localeCompare(b.name)); // Сортировка по возрастанию
    } else {
      this.filteredEntities.sort((a, b) => b.name.localeCompare(a.name)); // Сортировка по убыванию
    }
  }

  sortCardsOnClick(): void {
    this.isSortedAscending = !this.isSortedAscending; // Инвертируем флаг
    this.sortCards(); // Применяем сортировку
    this.cd.markForCheck(); // Уведомляем Angular о изменениях
  }

  onSearchQuery(query: string): void {
    this.searchQueryActive = !!query;
    this.filteredEntities = this.entities.filter((entity) => entity.name.includes(query));
    this.sortCards(); // Применяем сортировку после фильтрации
    this.updatePagination();
  }

  private filterEntities(query: string = ''): void {
    this.filteredEntities = this.entities.filter(entity => entity.name.includes(query));
    this.entityNames = this.filteredEntities.map(entity => entity.name);
    this.updatePagination();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredEntities.length / this.itemsPerPage);
  }

  get paginatedEntities(): Entity[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredEntities.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  private updatePagination(): void {
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    if (this.currentPage < 1) {
      this.currentPage = 1;
    }
  }
}
