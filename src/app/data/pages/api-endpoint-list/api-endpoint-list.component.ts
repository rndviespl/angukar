import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ApiServiceStructure, Endpoint, Entity } from '../../../service/service-structure-api';
import {TuiAccordion} from '@taiga-ui/experimental';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../service/api-service.service';
import { LoadingComponent } from '../../components/loading/loading.component';
import { CommonModule } from '@angular/common';
import { TuiButton } from '@taiga-ui/core';
import { HeaderComponent } from '../../components/header/header.component';

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
  styleUrl: './api-endpoint-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiEndpointListComponent implements OnInit, OnDestroy {

  entities: Entity[] = [];
  sub: Subscription | null = null;
  apiName!: string;
  private baseUrl = 'http://localhost:4200/api';
  // loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private cd: ChangeDetectorRef
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
    navigator.clipboard.writeText(url).then(() => {
      alert('URL скопирован в буфер обмена!');
    }).catch(err => {
      console.error('Ошибка при копировании URL:', err);
    });
  }
}