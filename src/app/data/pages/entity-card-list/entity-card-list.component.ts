import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RouteMemoryService } from '../../../service/route-memory.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Entity, apiServiceShortStructure } from '../../../service/service-structure-api';
import { CommonModule } from '@angular/common';
import { TuiCardLarge } from '@taiga-ui/layout';
import { TuiButton, tuiDialog } from '@taiga-ui/core';
import { IconTrashComponent } from "../../components/icon-trash/icon-trash.component";
import { CardEntityComponent } from '../../components/card-entity/card-entity.component';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { HeaderComponent } from '../../components/header/header.component';
import { SwitchComponent } from '../../components/switch/switch.component';
import { EntityDialogComponent } from '../../components/entity-dialog/entity-dialog.component';
import { EntityRepositoryService } from '../../../repositories/entity-repository.service';
import { ApiServiceRepositoryService } from '../../../repositories/api-service-repository.service';

@Component({
  selector: 'app-entity-card-list',
  imports: [
    TuiCardLarge,
    TuiButton,
    CommonModule,
    IconTrashComponent,
    CardEntityComponent,
    BackButtonComponent,
    HeaderComponent,
    SwitchComponent
  ],
  templateUrl: './entity-card-list.component.html',
  styleUrls: ['./entity-card-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityCardListComponent implements OnInit, OnDestroy {
  entities: Entity[] = [];
  sub: Subscription | null = null;
  apiName!: string;
  loading: boolean = false; // Add loading state
  apiInfo: apiServiceShortStructure = {} as apiServiceShortStructure; // Initialize apiInfo
  private readonly dialog = tuiDialog(EntityDialogComponent, {
    dismissible: true,
    label: "Создать",
  });
  entity:Entity = {
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
    private apiServiceRepositoryService: ApiServiceRepositoryService
  ) {}

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.apiName = params['name'];
      if (this.apiName) {
        this.sub = this.routeMemoryService.getApiData(this.apiName).subscribe(apiStructure => {
          if (apiStructure) {
            this.entities = apiStructure.entities;
            this.apiInfo = apiStructure as apiServiceShortStructure; // Assuming apiInfo is the entire apiStructure
            console.log(this.apiInfo)
            this.cd.markForCheck();
          }
        });
      } else {
        console.error('API name is null');
      }
    });
  }

onToggleChange(newState: boolean) {
    this.apiInfo.isActive = newState; // Update state in parent component
    console.log('Состояние переключателя изменилось на:', newState);

    // Call method to update service status
    this.apiServiceRepositoryService.updateApiServiceStatus(this.apiName, newState).subscribe({
      next: (response) => {
        console.log('Состояние сервиса обновлено:', response);
      },
      error: (error) => {
        console.error('Ошибка при обновлении состояния сервиса:', error);
      }
    });
  }
  openCreateDialog(): void {
    this.dialog({... this.entity}).subscribe({
      next: (data) => {        
        this.entityRepositoryService.createApiEntity(this.apiName,data).subscribe({
          next: (response) => {
            console.log('entity добавлено:', response);
            this.entities.push(data);
            this.cd.markForCheck();
          },
          error: (error) => {
            console.error('Ошибка при создании сущности:', error);
          }
        })

      },
      complete: () => {
        console.info('Dialog closed');
      },
    });
  }
}
