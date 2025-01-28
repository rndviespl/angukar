import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CardApiComponent } from "../../components/card-api/card-api.component";
import { Subscription } from 'rxjs';
import { CardApiService } from '../../../service/card-api.service';
import { CommonModule } from '@angular/common';
import { apiServiceShortStructure } from '../../../service/service-structure-api';

@Component({
  selector: 'app-card-api-list',
  imports: [CardApiComponent, CommonModule],
  templateUrl: './card-api-list.component.html',
  styleUrl: './card-api-list.component.css'
})
export class CardApiListComponent implements OnInit, OnDestroy{
  cards:apiServiceShortStructure[] = [];
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