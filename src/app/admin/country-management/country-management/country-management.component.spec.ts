import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryManagementComponent } from './country-management.component';

describe('CountryManagementComponent', () => {
  let component: CountryManagementComponent;
  let fixture: ComponentFixture<CountryManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
