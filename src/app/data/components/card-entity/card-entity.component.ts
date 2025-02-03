import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { apiServiceShortStructure, Entity } from '../../../service/service-structure-api';
import { CardApiService } from '../../../service/card-api.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IconTrashComponent } from "../icon-trash/icon-trash.component";
import { SwitchComponent } from '../switch/switch.component';
import { Subscription } from 'rxjs';
import { RouteMemoryService } from '../../../service/route-memory.service';
import { tuiDialog } from '@taiga-ui/core';
import { EntityDialogComponent } from '../entity-dialog/entity-dialog.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-entity',
  imports: [IconTrashComponent, SwitchComponent,CommonModule,RouterModule,],
  templateUrl: './card-entity.component.html',
  styleUrls: ['./card-entity.component.css']
})
export class CardEntityComponent {
  @Input() entityInfo!: Entity;
  @Input() apiName: string = "";
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
    private route: ActivatedRoute,
    private router: Router,
    private cardEntityService: CardApiService,
  ) { }

  onToggleChange(newState: boolean) {
    this.entityInfo.isActive = newState; // Update state in parent component
    console.log('Состояние переключателя изменилось на:', newState);

    // Call method to update service status
    this.cardEntityService.updateEntityStatus(this.apiName, this.entityInfo.name, newState).subscribe({
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
        this.cardEntityService.updateApiEntity(this.apiName, this.oldName, data).subscribe({
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
}
