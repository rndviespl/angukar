import { AsyncPipe } from '@angular/common';
import type { TemplateRef } from '@angular/core';
import { ChangeDetectionStrategy, Component, inject, HostListener } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { TuiAmountPipe } from '@taiga-ui/addon-commerce';
import { TuiAutoFocus } from '@taiga-ui/cdk';
import type { TuiDialogContext } from '@taiga-ui/core';
import { TuiButton, TuiDialogService, TuiTextfield } from '@taiga-ui/core';
import { TuiDataListWrapper, TuiSlider } from '@taiga-ui/kit';
import {
  TuiInputModule,
  TuiSelectModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/legacy';
import { injectContext } from '@taiga-ui/polymorpheus';
import { apiServiceShortStructure, Entity } from '../../../service/service-structure-api';

@Component({
  selector: 'app-api-edit-dialog',
  imports: [
    AsyncPipe,
    FormsModule,
    TuiAmountPipe,
    TuiAutoFocus,
    TuiButton,
    TuiDataListWrapper,
    TuiInputModule,
    TuiSelectModule,
    TuiSlider,
    TuiTextfield,
    TuiTextfieldControllerModule,
  ],
  templateUrl: './api-dialog.component.html',
  styleUrl: './api-dialog.component.css'
})
export class ApiDialogComponent {
  private readonly dialogs = inject(TuiDialogService);

  public readonly context = injectContext<TuiDialogContext<apiServiceShortStructure, apiServiceShortStructure>>();

  protected get hasValue(): boolean {
    return this.data.name.trim() !== '';
  }

  protected get data(): apiServiceShortStructure {
    return this.context.data;
  }

  protected submit(): void {
    if (this.hasValue) {
      this.context.completeWith(this.data);
    }
  }

  protected showDialog(content: TemplateRef<TuiDialogContext>): void {
    this.dialogs.open(content, { dismissible: true }).subscribe();
  }
  
  protected onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
  
    // Очищаем значение поля ввода от недопустимых символов
    const cleanedValue = value.replace(/[^a-zA-Z0-9]/g, '');
    input.value = cleanedValue;
  
    // Обновляем значение в data
    this.data.name = cleanedValue;
  }
  
  
}