import { TuiRoot } from "@taiga-ui/core";
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardApiComponent } from "./card-api/card-api.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot, CardApiComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angukar';
}
