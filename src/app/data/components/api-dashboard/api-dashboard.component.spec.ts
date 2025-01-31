import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiDashboardComponent } from './api-dashboard.component';

describe('ApiDashboardComponent', () => {
  let component: ApiDashboardComponent;
  let fixture: ComponentFixture<ApiDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApiDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
