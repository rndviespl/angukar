import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardWithEntityComponent } from './card-with-entity.component';

describe('CardWithEntityComponent', () => {
  let component: CardWithEntityComponent;
  let fixture: ComponentFixture<CardWithEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardWithEntityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardWithEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
