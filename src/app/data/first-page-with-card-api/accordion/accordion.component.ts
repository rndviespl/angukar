import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { TuiAmountPipe } from '@taiga-ui/addon-commerce';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiAccordion, TuiAccordionComponent } from '@taiga-ui/experimental';
import { TuiDataListWrapper } from '@taiga-ui/kit';
import { TuiInputModule, TuiSelectModule } from '@taiga-ui/legacy';
import { Subscription } from 'rxjs';
import { SwitchComponent } from '../switch/switch.component';
import { apiServiceShortStructure } from '../../../service/apiServiceStructure';
import { CardApiService } from '../../../service/card-api.service';

@Component({
  selector: 'app-accordion',
  imports: [
    CommonModule,
    AsyncPipe,
    ReactiveFormsModule,
    TuiAccordion,
    TuiAmountPipe,
    TuiButton,
    TuiDataListWrapper,
    TuiIcon,
    TuiInputModule,
    TuiSelectModule,
    SwitchComponent,
    
  ],
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AccordionComponent implements OnInit, OnDestroy {
  @Input() nameCard!: string;
  @Input() isOpen: boolean = true; 
  @Input() isEnabled: boolean = false;
  apiData: apiServiceShortStructure[] = []; 
  sub: Subscription | null = null;

  public isEnabledControl = new FormControl(true); 

  constructor(private getApiStructure: CardApiService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    console.log(`Initializing AccordionComponent for: ${this.nameCard}`);
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    console.log(`Destroying AccordionComponent for: ${this.nameCard}`);
    this.sub?.unsubscribe();
  }

  toggleAccordion(): void {
     this.isEnabled = !this.isEnabled;
    console.log(`Toggling accordion for item: ${this.nameCard}, isOpen: ${this.isOpen}`);
    
     if (this.isOpen && this.apiData.length === 0) {
      this.isOpen = !this.isOpen;
      this.sub = this.getApiStructure.getApiShortStructureList(this.nameCard).subscribe(data => {
        this.apiData = data; 
        this.cd.detectChanges();
      });
    }
  }
  
  toggleSwitch(): void {
    const switchIsEnabled = this.isEnabledControl.value; // Получаем текущее значение переключателя
    console.log(`Toggling switch for item: ${this.nameCard}, isEnabled: ${switchIsEnabled}`);   
    
    if (!switchIsEnabled) {
      console.log(`Switch disabled for item: ${this.nameCard}`);
    }
  }
}
