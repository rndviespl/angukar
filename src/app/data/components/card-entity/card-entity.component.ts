import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { Entity } from '../../../service/service-structure-api';
import { RouterModule } from '@angular/router';
import { IconTrashComponent } from "../icon-trash/icon-trash.component";
import { SwitchComponent } from '../switch/switch.component';
import { Subscription } from 'rxjs';
import { RouteMemoryService } from '../../../service/route-memory.service';
import { tuiDialog } from '@taiga-ui/core';
import { EntityDialogComponent } from '../entity-dialog/entity-dialog.component';
import { CommonModule } from '@angular/common';
import { EntityRepositoryService } from '../../../repositories/entity-repository.service';

@Component({
  selector: 'app-card-entity',
  imports: [IconTrashComponent, SwitchComponent,CommonModule,RouterModule,],
  templateUrl: './card-entity.component.html',
  styleUrls: ['./card-entity.component.css']
})
export class CardEntityComponent {
  @Input() entityInfo!: Entity;
  @Input() apiName: string = "";
  @Output() entityDeleted = new EventEmitter<string>();
  oldName: string = "";
  entities: Entity[] = [];
  sub: Subscription | null = null;
  loading: boolean = false;

  private readonly dialog = tuiDialog(EntityDialogComponent, {
    dismissible: true,
    label: "Редактировать",
  });
  
  constructor(
    private routeMemoryService: RouteMemoryService,
    private cd: ChangeDetectorRef,
    private entityRepositoryService: EntityRepositoryService,
  ) { }

  onToggleChange(newState: boolean) {
    this.entityInfo.isActive = newState; // Update state in parent component
    console.log('Состояние переключателя изменилось на:', newState);

    // Call method to update service status
    this.entityRepositoryService.updateEntityStatus(this.apiName, this.entityInfo.name, newState).subscribe({
      next: (response) => {
        console.log('Состояние сервиса обновлено:', response);
      },
      error: (error) => {
        console.error('Ошибка при обновлении состояния сервиса:', error);
      }
    });
  }

  openEditDialog(): void {
    this.oldName = this.entityInfo.name;
    this.dialog({... this.entityInfo}).subscribe({
      next: (data) => {
        console.info(`Dialog emitted data = ${data} - ${this.entityInfo.name}}`);
        this.entityRepositoryService.updateApiEntity(this.apiName, this.oldName, data).subscribe({
          next: (response) => {
            console.log('Сущность обновлена:', response);
            this.entityInfo = data;
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

  onRefresh(): void {
    if (this.apiName) {
      this.loading = true; // Set loading to true
      this.routeMemoryService.checkForApiUpdates(this.apiName);
      this.sub = this.routeMemoryService.getApiData(this.apiName).subscribe(apiStructure => {
        this.loading = false; // Set loading to false
        if (apiStructure) {
          this.entities = apiStructure.entities;
          this.cd.markForCheck();
        }
      }, error => {
        this.loading = false; // Set loading to false on error
        console.error('Error fetching data:', error);
      });
    }
  }

  onDeleteConfirmed(): void {
    this.entityRepositoryService.deleteApiEntity(this.apiName, this.entityInfo.name).subscribe({
      next: () => {
        console.log(`Сущность "${this.entityInfo.name}" удалена.`);
        this.entityDeleted.emit(this.entityInfo.name); // Emit the event to notify the parent component
      },
      error: (error) => {
        console.error('Ошибка при удалении сущности:', error);
      }
    });
  }
}