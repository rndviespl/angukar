import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TuiButton } from '@taiga-ui/core';
import { RouteInfoService } from '../../../service/route-info.service';

@Component({
  selector: 'app-back-button',
  imports: [
    TuiButton

  ],
  templateUrl: './back-button.component.html',
  styleUrl: './back-button.component.css'
})
export class BackButtonComponent {
  constructor(private router: Router, private routeInfoService: RouteInfoService) {}

  goBack(): void {
    const previousPath = this.routeInfoService.getPreviousPath();
    if (previousPath) {
      this.router.navigateByUrl(previousPath);
    } else {
      console.warn('No previous path found in localStorage');
      // Можно добавить дополнительную логику, например, навигацию на домашнюю страницу
      this.router.navigate(['/home']);
    }
  }
}