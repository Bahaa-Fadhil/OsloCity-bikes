import { async, ComponentFixture, tick, TestBed, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BikeListComponent } from './Bike-list.components';
import { BikesService } from '../BikesService.service';
import { of } from 'rxjs';

const BikesServiceSpy = jasmine.createSpyObj('BikesService', ['getCombinedBikesAndStatus']);


const mockStations = {
  last_updated: 1553592653,
  data: {
    stations: [
      {
        station_id: '627',
        name: 'Skøyen Stasjon',
        address: 'Skøyen Stasjon',
        lat: 59.9226729,
        lon: 10.6788129,
        capacity: 20
      },
      {
        station_id: '623',
        name: '7 Juni Plassen',
        address: '7 Juni Plassen',
        lat: 59.9150596,
        lon: 10.7312715,
        capacity: 15
      }
    ]
  }
};

const mockStationStatus = {
  last_updated: 1540219230,
  data: {
    stations: [
      {
        is_installed: 1,
        is_renting: 1,
        num_bikes_available: 7,
        num_docks_available: 5,
        last_reported: 1540219230,
        is_returning: 1,
        station_id: '627'
      },
      {
        is_installed: 1,
        is_renting: 1,
        num_bikes_available: 4,
        num_docks_available: 8,
        last_reported: 1540219230,
        is_returning: 1,
        station_id: '623'
      }
    ]
  }
};

const mockRes = [mockStations, mockStationStatus];

describe('BikeListComponent', () => {
  let component: BikeListComponent;
  let fixture: ComponentFixture<BikeListComponent>;

  BikesServiceSpy.getCombinedBikesAndStatus.and.returnValue(of(mockRes));


  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ BikeListComponent ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          {
            provide: BikesService,
            useValue: BikesServiceSpy
          }
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BikeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('status list', () => {

    it('should initiate status list', () => {
      expect(component.statusList.length).toBeGreaterThan(0);
    });

    it('getStationStatusInfo should return json object for given id', () => {
        const station = component.getStationStatusInfo('623', mockStationStatus.data.stations);

        expect(station).toEqual(mockStationStatus.data.stations[1]);
    });

    it('the created stations list shoul include all stations from request, provided data are correct', () => {
      const stationList = component.createBikeStatusList(mockStations.data.stations, mockStationStatus.data.stations);

      expect(stationList.length).toEqual(mockStations.data.stations.length);
  });
  });

});
