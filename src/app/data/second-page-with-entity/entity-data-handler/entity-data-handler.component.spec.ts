import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityDataHandlerComponent } from './entity-data-handler.component';

describe('EntityDataHandlerComponent', () => {
  let component: EntityDataHandlerComponent;
  let fixture: ComponentFixture<EntityDataHandlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityDataHandlerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityDataHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
