import { Component, EventEmitter, Input, Output, } from '@angular/core';
import { TuiAlertService, TuiIconPipe } from '@taiga-ui/core';
import { switchMap, takeUntil } from 'rxjs';
import { Router,  } from '@angular/router';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { AlertComponent } from '../alert/alert.component';
import { apiServiceShortStructure, EntityShort, Endpoint } from '../../../service/service-structure-api';

@Component({
  selector: 'app-icon-trash',
  imports: [
    TuiIconPipe,
    AlertComponent,
  ],
  templateUrl: './icon-trash.component.html',
  styleUrls: ['./icon-trash.component.css']
})
export class IconTrashComponent {
  @Input() item: any;
  @Input() apiInfo!: apiServiceShortStructure;
  @Input() entityInfo!: EntityShort;
  @Input() endpointInfo!: Endpoint;
  @Output() responseAlert = new EventEmitter<boolean>();
  constructor(
    private alerts: TuiAlertService,
    private router: Router,
  ) { }

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
            this.responseAlert.emit(true);
            // If response is true, item is deleted
            console.log(`Удаление карточки: ${this.item.name}`); // Log the deletion
            return this.alerts.open(`Карточка "${this.item.name}" удалена.`, { label: 'Успех' });
          } else {
            return this.alerts.open(`Удаление карточки "${this.item.name}" отменено.`, { label: 'Информация' });
          }
        }),
        takeUntil(this.router.events),
      );


    notification.subscribe();
  }
}
