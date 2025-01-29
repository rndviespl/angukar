import { Component, Input, inject } from '@angular/core';
import { TuiAlertService, TuiIcon, TuiIconPipe } from '@taiga-ui/core';
import { switchMap, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-icon-trash',
  imports: [
    TuiIconPipe,
    AlertComponent
],
  templateUrl: './icon-trash.component.html',
  styleUrls: ['./icon-trash.component.css']
})
export class IconTrashComponent {
  @Input() item: any; // Входное свойство для передачи данных карточки
  constructor(private alerts: TuiAlertService, private router: Router) {}

  protected showNotification(): void {
    const notification = this.alerts
      .open<boolean>(new PolymorpheusComponent(AlertComponent), {
        label: 'Вы уверены, что хотите удалить?',
        appearance: 'negative',
        autoClose: 0,
      })
      .pipe(
        switchMap((response) => {
          if (response) {
            // If response is true, item is deleted
            console.log(`Удаление карточки: ${this.item.name}`); // Log the deletion
            return this.alerts.open(`Карточка "${this.item.name}" удалена.`, { label: 'Успех' });
          } else {
            // If response is false, deletion is canceled
            return this.alerts.open(`Удаление карточки "${this.item.name}" отменено.`, { label: 'Информация' });
          }
        }),
        takeUntil(this.router.events),
      );
  
    notification.subscribe();
  }
  
}