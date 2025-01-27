import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiPlatform } from '@taiga-ui/cdk/directives/platform';
import { TuiSwitch, tuiSwitchOptionsProvider } from '@taiga-ui/kit';

@Component({
  selector: 'app-switch-second-page',
  imports: [CommonModule, FormsModule, TuiPlatform, ReactiveFormsModule, TuiSwitch],
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.css',
   providers: [
      tuiSwitchOptionsProvider({ showIcons: false, appearance: () => 'primary' }),
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  
export class SwitchSecondPageComponent implements OnInit {
  @Input() value: boolean = false; // Добавлено свойство value
  @Output() toggle = new EventEmitter<void>(); // Добавлено событие toggle

  protected readonly invalidTrue = new FormControl(true, () => ({ invalid: true }));
  protected readonly invalidFalse = new FormControl(false, () => ({ invalid: true }));

  public ngOnInit(): void {
    this.invalidTrue.markAsTouched();
    this.invalidFalse.markAsTouched();
  }

  onToggle(): void {
    this.value = !this.value; // Toggle the value
    this.toggle.emit(); // Emit the toggle event
  }
}
