import { Component, Input } from '@angular/core';
import { Entity } from '../../../service/service-structure-api';
import { CardApiService } from '../../../service/card-api.service';
import { Router } from '@angular/router';
import { IconTrashComponent } from "../icon-trash/icon-trash.component";
import { SwitchComponent } from "../switch/switch.component";

@Component({
  selector: 'app-card-entity',
  imports: [IconTrashComponent, SwitchComponent],
  templateUrl: './card-entity.component.html',
  styleUrl: './card-entity.component.css'
})
export class CardEntityComponent {
  @Input() entityInfo!: Entity;
  
  constructor(private cardApiService: CardApiService,
    private router: Router
  ) {}
  onToggleChange(newState: boolean) {
    this.entityInfo.isActive = newState; // Обновляем состояние в родительском компоненте
    console.log('Состояние переключателя изменилось на:', newState);

    // Вызов метода для обновления состояния сервиса
    this.cardApiService.updateServiceStatus(this.entityInfo.name, newState).subscribe({
      next: (response) => {
        console.log('Состояние сервиса обновлено:', response);
      },
      error: (error) => {
        console.error('Ошибка при обновлении состояния сервиса:', error);
      }
    });
  }
  // navigateToApiDetails(apiName: string): void {
  //   this.router.navigate(['/api/ApiService', apiName]); // Переход на страницу API без передачи isActive
  // }
}
