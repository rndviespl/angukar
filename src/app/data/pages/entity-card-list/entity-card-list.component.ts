import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RouteMemoryService } from '../../../service/route-memory.service';
import { ActivatedRoute } from '@angular/router';
import { Entity, EntityShort } from '../../../service/service-structure-api';
import { CommonModule } from '@angular/common';
import { TuiCardLarge } from '@taiga-ui/layout';
import { TuiButton } from '@taiga-ui/core';
import { CardApiService } from '../../../service/card-api.service';
import { IconTrashComponent } from "../../components/icon-trash/icon-trash.component";
import { CardEntityComponent } from '../../components/card-entity/card-entity.component';

@Component({
  selector: 'app-entity-card-list',
  imports: [
    TuiCardLarge,
    TuiButton,
    CommonModule,
    IconTrashComponent,
    CardEntityComponent
],
  templateUrl: './entity-card-list.component.html',
  styleUrls: ['./entity-card-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityCardListComponent implements OnInit, OnDestroy {
  entities: Entity[] = [];
  sub: Subscription | null = null;
  apiName: string | null = null;

  constructor(
    private routeMemoryService: RouteMemoryService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private cardEntityService: CardApiService,
  ) {}

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.apiName = params['name'];

      if (this.apiName) {
        this.sub = this.routeMemoryService.getData(this.apiName).subscribe(apiStructure => {
          if (apiStructure) {
            this.entities = apiStructure.entities;
            this.cd.markForCheck();
          }
        });
      } else {
        console.error('API name is null');
      }
    });
  }
}
