import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { TuiIcon, TuiIconPipe } from '@taiga-ui/core';
import { TuiSwitch } from '@taiga-ui/kit';

@Component({
  selector: 'app-icon-trash',
  imports: [
    TuiIcon, 
    TuiIconPipe, 
    TuiSwitch
  ],
  templateUrl: './icon-trash.component.html',
  styleUrl: './icon-trash.component.css',
})
export class IconTrashComponent {
  
}
