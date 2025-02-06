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
  constructor( private location: Location, private router: Router) {}

  goBack(): void {
    const previousUrl = this.location.getState() as { navigationId: number, url: string };
    const currentDomain = window.location.origin;

    if (previousUrl && previousUrl.url && previousUrl.url.startsWith(currentDomain)) {
      this.location.back();
    } else {
      // Если предыдущая страница не принадлежит вашему домену, перенаправляем на главную страницу
      this.router.navigate(['/']);
    }
  }
}