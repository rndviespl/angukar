import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Entity } from '../../../service/service-structure-api';
import { CardApiService } from '../../../service/card-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IconTrashComponent } from "../icon-trash/icon-trash.component";
import { SwitchComponent } from '../switch/switch.component';
import { Subscription } from 'rxjs';
import { RouteMemoryService } from '../../../service/route-memory.service';

@Component({
  selector: 'app-card-entity',
  imports: [IconTrashComponent, SwitchComponent],
  templateUrl: './card-entity.component.html',
  styleUrl: './card-entity.component.css'
})
export class CardEntityComponent {
  @Input() entityInfo!: Entity;
  entities: Entity[] = [];
  sub: Subscription | null = null;
  apiName: string | null = null;
  loading: boolean = false; // Add loading state
  
  constructor(
    private routeMemoryService: RouteMemoryService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private cardEntityService: CardApiService,
  ) {}

  onToggleChange(newState: boolean) {
    this.entityInfo.isActive = newState; // Update state in parent component
    console.log('Состояние переключателя изменилось на:', newState);

    // Call method to update service status
    this.cardEntityService.updateServiceStatus(this.entityInfo.name, newState).subscribe({
      next: (response) => {
        console.log('Состояние сервиса обновлено:', response);
      },
      error: (error) => {
        console.error('Ошибка при обновлении состояния сервиса:', error);
      }
    });
  }

  navigateToApiDetails(): void {
    if (this.apiName && this.entityInfo) {
      this.router.navigate(['/api/ApiEntity', this.apiName, this.entityInfo.name]);
    }
  }

  onRefresh(): void {
    if (this.apiName) {
      this.loading = true; // Set loading to true
      this.routeMemoryService.checkForUpdates(this.apiName);
      this.sub = this.routeMemoryService.getData(this.apiName).subscribe(apiStructure => {
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
