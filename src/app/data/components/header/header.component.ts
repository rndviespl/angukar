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
  @Output() buttonClick: EventEmitter<void> = new EventEmitter<void>(); 

  Click(): void {
    this.buttonClick.emit(); // Emit the toggle event
  }

}