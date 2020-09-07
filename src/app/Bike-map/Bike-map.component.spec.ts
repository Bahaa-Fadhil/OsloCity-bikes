import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BikeMapComponent } from './Bike-map.component';

describe('BikeMapComponent', () => {
  let component: BikeMapComponent;
  let fixture: ComponentFixture<BikeMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BikeMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BikeMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
