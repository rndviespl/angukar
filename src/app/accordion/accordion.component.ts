import { KeyValuePipe, NgForOf } from '@angular/common';
import { Component } from '@angular/core';
import { TuiAccordion } from '@taiga-ui/experimental';

@Component({
  selector: 'app-accordion',
  imports: [KeyValuePipe, NgForOf, TuiAccordion],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.css'
})
export class AccordionComponent {
  protected readonly data = {
    'Taiga UI cdk':
        'Development kit consisting of the low level tools and abstractions used to develop Taiga UI Angular entities',
    'Taiga UI core':
        'Basic elements needed to develop components, directives and more using Taiga UI design system',
    'Taiga UI kit':
        'The main set of components used to build Taiga UI based Angular applications',
};
}