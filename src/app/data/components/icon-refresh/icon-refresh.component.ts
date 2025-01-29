import { Component, EventEmitter, Output } from '@angular/core';
import { TuiIcon, TuiIconPipe } from '@taiga-ui/core';
import { TuiSwitch } from '@taiga-ui/kit';

@Component({
  selector: 'app-icon-refresh',
  imports: [ 
    TuiIcon, 
    TuiIconPipe, 
    TuiSwitch,
  ],
  templateUrl: './icon-refresh.component.html',
  styleUrl: './icon-refresh.component.css'
})
export class IconRefreshComponent {
  @Output() refreshClicked = new EventEmitter<void>();

  onRefresh(): void {
    this.refreshClicked.emit();
  }
}