import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CardApiComponent } from "../../components/card-api/card-api.component";
import { HeaderComponent } from "../../components/header/header.component";
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { apiServiceShortStructure } from '../../../service/service-structure-api';
import { tuiDialog } from '@taiga-ui/core';
import { ApiDialogComponent } from '../../components/api-dialog/api-dialog.component';
import { RouterModule } from '@angular/router';
import { ApiServiceRepositoryService } from '../../../repositories/api-service-repository.service';
import { Router } from '@angular/router';
import { LoadingComponent } from "../../components/loading/loading.component";
import { TuiAlertService } from '@taiga-ui/core';

@Component({
  selector: 'app-card-api-list',
  imports: [
    CardApiComponent,
    CommonModule,
    HeaderComponent,
    RouterModule,
    LoadingComponent,
    RouterModule
  ],
  templateUrl: './card-api-list.component.html',
  styleUrls: ['./card-api-list.component.css', '../../styles/card-list.css']
})
export class CardApiListComponent implements OnInit, OnDestroy {
  cards: apiServiceShortStructure[] = [];
  api: apiServiceShortStructure = {
    name: '',
    isActive: false,
    description: ''
  };
  sub: Subscription | null = null;
  loading: boolean = true;
  private readonly dialog = tuiDialog(ApiDialogComponent, {
    dismissible: true,
    label: "Создать",
  });

  constructor(
    private apiServiceRepository: ApiServiceRepositoryService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private readonly alerts: TuiAlertService,
  ) { }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  ngOnInit(): void {
    this.loadApiList();
  }

  loadApiList(): void {
    this.sub = this.apiServiceRepository.getApiList().subscribe({
      next: (it) => {
        this.cards = it;
        console.log(it);
        this.cd.detectChanges();
        this.loading = false
      },
      error: (error) => {
        console.error('Error fetching API list', error);
        this.router.navigate(['/page-not-found']);
      }
    });
  }

  openCreateDialog(): void {
    this.dialog({ ...this.api }).subscribe({
      next: (data) => {
        // Проверка на существование имени в текущем списке
        const isNameExists = this.cards.some(card => card.name === data.name);
        if (isNameExists) {
          this.alerts
            .open('Ошибка: API с таким именем уже существует', {
              appearance: 'negative',
            })
            .subscribe();
          return;
        }
  
        this.apiServiceRepository.createApiService(data).subscribe({
          next: (response) => {
            console.log('API добавлено:', response);
            this.cards.push(data);
            this.cd.markForCheck();
            this.alerts
              .open('API успешно создано', {
                appearance: 'success',
              })
              .subscribe();
          },
          error: (error) => {
            if (error.status === 409) {
              this.alerts
                .open('Ошибка: API с таким именем уже существует', {
                  appearance: 'negative',
                })
                .subscribe();
            } else {
              this.alerts
                .open('Ошибка при создании API', {
                  appearance: 'negative',
                })
                .subscribe();
            }
            console.error('Ошибка при создании API:', error);
          }
        });
      },
      complete: () => {
        console.info('Диалог закрыт');
      },
    });
  }

  onApiDeleted(apiName: string): void {
    this.cards = this.cards.filter(card => card.name !== apiName);
    this.cd.markForCheck(); // Notify Angular to check for changes
  }
}
