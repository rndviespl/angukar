import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnDestroy, OnInit } from '@angular/core';
import { Action, apiServiceShortStructure, Entity } from '../../../../service/service-structure-api';
import { Subscription } from 'rxjs';
import { CardApiService } from '../../../../service/card-api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-endpoint-card-list',
  imports: [
    CommonModule,

  ],
  templateUrl: './endpoint-card-list.component.html',
  styleUrl: './endpoint-card-list.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EndpointCardListComponent implements OnInit, OnDestroy {
  @Input() apiServiceName!: string; // Добавьте входной параметр
  @Input() entityName!: string; // Добавьте входной параметр
  @Input() apiInfo!: apiServiceShortStructure;
  @Input() entityInfo!: Entity;
  actions: Action[] = [];
  sub: Subscription | null = null;

  constructor(private getAction: CardApiService) { }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  ngOnInit(): void {
    this.sub = this.getAction.getActionList(this.apiServiceName, this.entityName).subscribe(it => {
      this.actions = it;
      console.log(it);
    });
  }
}
