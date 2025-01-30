import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() logoUrl: string = "https://www.titan2.ru/images/temp/logo__ru.jpg"; // URL логотипа
  @Input() buttonText: string = ''; // Текст кнопки
  @Output() create: EventEmitter<void> = new EventEmitter<void>(); 

  Click(): void {
    this.create.emit(); // Emit the toggle event
  }

}