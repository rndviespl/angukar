import { TuiRoot } from "@taiga-ui/core";
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CardApiComponent } from "./data/first-page-with-card-api/card-api/card-api.component";

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    TuiRoot, 
    RouterModule,
    CardApiComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angukar';
}
