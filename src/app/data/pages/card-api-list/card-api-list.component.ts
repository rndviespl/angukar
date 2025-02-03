import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CardApiComponent } from "../../components/card-api/card-api.component";
import { HeaderComponent } from "../../components/header/header.component";
import { Subscription } from 'rxjs';
import { CardApiService } from '../../../service/card-api.service';
import { CommonModule } from '@angular/common';
import { apiServiceShortStructure } from '../../../service/service-structure-api';
import { tuiDialog } from '@taiga-ui/core';
import { ApiDialogComponent } from '../../components/api-dialog/api-dialog.component';

@Component({
  selector: 'app-card-api-list',
  imports: [CardApiComponent, CommonModule, HeaderComponent],
  templateUrl: './card-api-list.component.html',
  styleUrl: './card-api-list.component.css'
})
export class CardApiListComponent implements OnInit, OnDestroy{
  cards:apiServiceShortStructure[] = [];
  api:apiServiceShortStructure = {
    name: '',
    isActive: false,
    description: ''
  };
  sub:Subscription | null = null;
  private readonly dialog = tuiDialog(ApiDialogComponent, {
    dismissible: true,
    label: "Создать",
  });
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
  openCreateDialog(): void {
    this.dialog({... this.api}).subscribe({
      next: (data) => {
        this.getapi.createApiService(data).subscribe({
          next: (response) => {
            console.log('api добавлено:', response);
            this.cards.push(data);
            this.cd.markForCheck();
          },
          error: (error) => {
            console.error('Ошибка при создании сущности:', error);
          }
        })

      },
      complete: () => {
        console.info('Dialog closed');
      },
    });
  }
}