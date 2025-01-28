import { TuiRoot } from "@taiga-ui/core";
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CardApiListComponent } from "./data/pages/card-api-list/card-api-list.component";

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    TuiRoot, 
    RouterModule,
    CardApiListComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angukar';
}
