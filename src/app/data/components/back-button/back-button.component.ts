import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-back-button',
  imports: [
    TuiButton

  ],
  templateUrl: './back-button.component.html',
  styleUrl: './back-button.component.css'
})
export class BackButtonComponent {
  constructor( private location: Location, ) {}

  goBack(): void {
    this.location.back();
  }
}