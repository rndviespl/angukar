import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ApiServiceStructure, Endpoint, Entity } from '../../../service/service-structure-api';
import { TuiAccordion } from '@taiga-ui/experimental';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../service/api-service.service';
import { LoadingComponent } from '../../components/loading/loading.component';
import { CommonModule } from '@angular/common';
import { TuiButton } from '@taiga-ui/core';
import { HeaderComponent } from '../../components/header/header.component';
import { TuiAlertService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { AlertUrlComponent } from '../../components/alert-url/alert-url.component';

@Component({
  selector: 'app-api-endpoint-list',
  imports: [
    TuiAccordion,
    LoadingComponent,
    CommonModule,
    RouterModule,
    TuiButton,
    HeaderComponent,
  ],
  templateUrl: './api-endpoint-list.component.html',
  styleUrls: ['./api-endpoint-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiEndpointListComponent implements OnInit, OnDestroy {
  entities: Entity[] = [];
  sub: Subscription | null = null;
  loading: boolean = true;
  apiName!: string;
  private baseUrl = `${window.location.origin}/api`;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private cd: ChangeDetectorRef,
    private alerts: TuiAlertService
  ) {}

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.apiName = params['name'];
      if (this.apiName) {
        this.loadApiStructure();
      } else {
        console.error('API name is null');
        this.router.navigate(['/page-not-found']);
      }
    });
  }

  loadApiStructure(): void {
    this.sub = this.apiService.getApiStructureList(this.apiName).subscribe({
      next: (apiStructure: ApiServiceStructure) => {
        if (apiStructure) {
          this.entities = apiStructure.entities;
          this.cd.markForCheck();
          this.loading = false;
        } else {
          console.error('API structure is null');
          this.router.navigate(['/page-not-found']);
        }
      },
      error: (error: any) => {
        console.error('Error fetching API structure', error);
        this.router.navigate(['/page-not-found']);
      }
    });
  }

  copyToClipboard(entityName: string, endpoint: Endpoint): void {
    const url = `${this.baseUrl}/ApiEmu/${this.apiName}/${entityName}/${endpoint.route}`;
    
    const textarea = document.createElement('textarea');
    textarea.value = url;
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        this.alerts.open(new PolymorpheusComponent(AlertUrlComponent)).subscribe({
          complete: () => {
            console.log('Notification is closed');
          },
        });
    } catch (err) {
        console.error('Ошибка при копировании URL:', err);
    }
    document.body.removeChild(textarea);
}
}
