import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, input, OnDestroy, OnInit } from '@angular/core';
import {TuiAppearance, TuiButton, TuiTitle} from '@taiga-ui/core';
import { TuiAvatar} from '@taiga-ui/kit';
import {TuiCardLarge, TuiHeader} from '@taiga-ui/layout';
import { Subscription } from 'rxjs';
import { CardApiService } from '../../../service/card-api.service';
import { SwitchComponent } from "../switch/switch.component";
import { Router, RouterModule } from '@angular/router';
import { apiServiceShortStructure } from '../../../service/service-structure-api';

@Component({
  selector: 'app-card-api',
  imports: [CommonModule,
    TuiAppearance,
    TuiAvatar,
    TuiButton,
    TuiCardLarge,
    TuiHeader,
    TuiTitle,
    SwitchComponent,
    RouterModule 
  ],
  templateUrl: './card-api.component.html',
  styleUrl: './card-api.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardApiComponent implements OnInit, OnDestroy{
  cards: apiServiceShortStructure[] = [];
  sub:Subscription | null = null;
  constructor(
    private getapi: CardApiService, 
    private cd: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnDestroy(): void {
   this.sub?.unsubscribe();
  }
  ngOnInit(): void {
    this.sub = this.getapi.getApiList().subscribe(it => {
      this.cards = it;
      console.log(it);
      this.cd.detectChanges();
    })
  }
  navigateToApiDetails(apiName: string): void {
    this.router.navigate(['/api/ApiService', apiName]); // Переход на страницу API без передачи isActive
  }
}