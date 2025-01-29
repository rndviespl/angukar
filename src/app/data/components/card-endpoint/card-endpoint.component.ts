import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteMemoryService } from '../../../service/route-memory.service';
import { Action, apiServiceShortStructure, Entity } from '../../../service/service-structure-api';
import { Subscription } from 'rxjs';
import { SwitchComponent } from "../switch/switch.component";
import { IconTrashComponent } from "../icon-trash/icon-trash.component";
import { CardApiService } from '../../../service/card-api.service';

@Component({
  selector: 'app-card-endpoint',
  imports: [SwitchComponent, IconTrashComponent],
  templateUrl: './card-endpoint.component.html',
  styleUrls: ['./card-endpoint.component.css']
})
export class CardEndpointComponent implements OnInit {
   @Input() apiInfo!: apiServiceShortStructure;
   @Input() entityInfo!: Entity;
   @Input() actionInfo!: Action;
 
   constructor(private cardApiService: CardApiService,
      private router: Router
    ) {}

    onToggleChange(newState: boolean) {
      this.actionInfo.isActive = newState; // Обновляем состояние в родительском компоненте
      console.log('Состояние переключателя изменилось на:', newState);
  
      // Вызов метода для обновления состояния сервиса
      this.cardApiService.updateServiceStatus(this.actionInfo.route, newState).subscribe({
        next: (response) => {
          console.log('Состояние сервиса обновлено:', response);
        },
        error: (error) => {
          console.error('Ошибка при обновлении состояния сервиса:', error);
        }
      });
    }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
 
}
