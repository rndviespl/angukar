import {CommonModule} from '@angular/common';
import type {OnInit} from '@angular/core';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { TuiPlatform } from '@taiga-ui/cdk/directives/platform';
import type {TuiSizeS} from '@taiga-ui/core';
import {TuiSwitch, tuiSwitchOptionsProvider} from '@taiga-ui/kit';

@Component({
  selector: 'app-switch',
  imports: [CommonModule, FormsModule, TuiPlatform, ReactiveFormsModule, TuiSwitch],
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.css',
  providers: [
      tuiSwitchOptionsProvider({showIcons: false, appearance: () => 'primary'}),
]})

export class SwitchComponent implements OnInit{
 
  protected readonly invalidTrue = new FormControl(true, () => ({invalid: true}));
  protected readonly invalidFalse = new FormControl(false, () => ({invalid: true}));
  
  protected value = false;

  public ngOnInit(): void {
      this.invalidTrue.markAsTouched();
      this.invalidFalse.markAsTouched();
  }
}
