import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {TuiAppearance, TuiButton, TuiTitle} from '@taiga-ui/core';
import {TuiAvatar} from '@taiga-ui/kit';
import {TuiCardLarge, TuiHeader} from '@taiga-ui/layout';
import { Subscription } from 'rxjs';
import { CardApiService } from '../service/card-api.service';

@Component({
  selector: 'app-card-api',
  imports: [CommonModule,
    TuiAppearance,
    TuiAvatar,
    TuiButton,
    TuiCardLarge,
    TuiHeader,
    TuiTitle,],
  templateUrl: './card-api.component.html',
  styleUrl: './card-api.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardApiComponent implements OnInit, OnDestroy{
  cards:string[] = [];
  sub:Subscription | null = null;
  constructor(private getapi: CardApiService, 
    private cd: ChangeDetectorRef,
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
}