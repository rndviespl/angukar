import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CardApiComponent } from "../../components/card-api/card-api.component";
import { HeaderComponent } from "../../components/header/header.component";
import { Observable, interval,Subscription } from 'rxjs';
import { ApiHubServiceService } from '../../../service/api-hub-service.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { apiServiceShortStructure } from '../../../service/service-structure-api';
import { tuiDialog } from '@taiga-ui/core';
import { ApiDialogComponent } from '../../components/api-dialog/api-dialog.component';
import { RouterModule } from '@angular/router';
import { ApiServiceRepositoryService } from '../../../repositories/api-service-repository.service';
import { Router } from '@angular/router';
import { LoadingComponent } from '../../components/loading/loading.component';
import { TuiAlertService } from '@taiga-ui/core';

@Component({
  selector: 'app-card-api-list',
  imports: [
    CardApiComponent,
    CommonModule,
    HeaderComponent,
    RouterModule,
    LoadingComponent,
  ],
  templateUrl: './card-api-list.component.html',
  styleUrls: ['./card-api-list.component.css', '../../styles/card-list.css'],
})
export class CardApiListComponent implements OnInit, OnDestroy {
  cards: apiServiceShortStructure[] = [];
  api: apiServiceShortStructure = {
    name: '',
    isActive: false,
    description: '',
  };
  private sub: Subscription | null = null;
  loading: boolean = true;
  private readonly dialog = tuiDialog(ApiDialogComponent, {
    dismissible: true,
    label: 'Создать',
  });

  constructor(
    private apiServiceRepository: ApiServiceRepositoryService,
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private readonly alerts: TuiAlertService,
    private apiServiceHub: ApiHubServiceService
  ) { }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  ngOnInit(): void {
    this.loadApiList();
    this.subscribeToApiUpdates();
  }

  private loadApiList(): void {
    this.sub = this.apiServiceRepository.getApiList().subscribe({
      next: (apiList) => {
        this.handleApiListResponse(apiList)
        this.apiServiceHub.initializeData(apiList)
      },
      error: (error) => {
        console.error('Error fetching API list', error);
        this.router.navigate(['/page-not-found']);
      }
    });
  }

  subscribeToApiUpdates(): void {
    this.apiServiceHub.ordersUpdated$.subscribe({
      next: (updatedApiList) => {
        this.cards = updatedApiList; // Update the cards with the new data
        this.cd.markForCheck(); // Notify Angular to check for changes
      },
      error: (error) => {
        console.error('Error receiving API updates', error);
      }
    });

  private handleApiListResponse(apiList: apiServiceShortStructure[]): void {
    this.cards = apiList;
    console.log(apiList);
    this.changeDetector.detectChanges();
    this.loading = false;
  }

  private handleApiListError(error: any): void {
    console.error('Error fetching API list', error);
    this.router.navigate(['/page-not-found']);
  }

  openCreateDialog(): void {
    this.dialog({ ...this.api }).subscribe({
      next: (data) => this.processCreateDialogData(data),
      complete: () => this.onDialogClose(),
    });
  }

  private processCreateDialogData(data: apiServiceShortStructure): void {
    if (this.isApiNameExists(data.name)) {
      this.showApiNameExistsError();
      return;
    }
    this.createApiService(data);
  }

  private isApiNameExists(name: string): boolean {
    return this.cards.some((card) => card.name === name);
  }

  private onDialogClose(): void {
    console.info('Диалог закрыт');
  }

  private showApiNameExistsError(): void {
    this.alerts
      .open('Ошибка: API с таким именем уже существует', {
        appearance: 'negative',
      })
      .subscribe();
  }

  private createApiService(data: apiServiceShortStructure): void {
    this.apiServiceRepository.createApiService(data).subscribe({
      next: (response) => this.onApiServiceCreated(response, data),
    });
  }

  private onApiServiceCreated(
    response: any,
    data: apiServiceShortStructure
  ): void {
    console.log('API добавлено:', response);
    this.cards.push(data);
    this.changeDetector.markForCheck();
    this.alerts
      .open('API успешно создано', {
        appearance: 'success',
      })
      .subscribe();
  }

  onApiDeleted(apiName: string): void {
    this.cards = this.cards.filter((card) => card.name !== apiName);
    this.changeDetector.markForCheck(); // Notify Angular to check for changes
  }
}
