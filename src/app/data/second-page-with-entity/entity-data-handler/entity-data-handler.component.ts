import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RouteMemoryService } from '../../../service/route-memory.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-entity-data-handler',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityDataHandlerComponent implements OnInit, OnDestroy {
  sub: Subscription | null = null;
  apiName: string | null = null;
  intervalId: any;

  constructor(
    private routeMemoryService: RouteMemoryService,
    private route: ActivatedRoute,
  ) {}

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    clearInterval(this.intervalId);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.apiName = params['name'];

      if (this.apiName) {
        this.sub = this.routeMemoryService.getApiData(this.apiName).subscribe(apiStructure => {
          // Обработка данных, если необходимо
        });

        this.intervalId = setInterval(() => {
          this.refreshData();
        }, 3000);
      } else {
        console.error('API name is null');
      }
    });
  }

  refreshData(): void {
    if (this.apiName) {
      this.routeMemoryService.checkForApiUpdates(this.apiName);
    }
  }
}
