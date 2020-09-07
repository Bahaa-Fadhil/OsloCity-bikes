import { TestBed, inject } from '@angular/core/testing';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BikesService } from './BikesService.service';

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
        station_id: '175'
      },
      {
        is_installed: 1,
        is_renting: 1,
        num_bikes_available: 4,
        num_docks_available: 8,
        last_reported: 1540219230,
        is_returning: 1,
        station_id: '47'
      }
    ]
  }
};

describe('BikesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [BikesService]
  }));

  it('should be created', () => {
    const service: BikesService = TestBed.get(BikesService);
    expect(service).toBeTruthy();
  });

  it('should get stations', inject(
      [HttpTestingController, BikesService],
      (httpMock: HttpTestingController, BikeService: BikesService) => {
        BikeService.getBikeSites().subscribe((event: HttpEvent<any>) => {
          switch (event.type) {
            case HttpEventType.Response:
              expect(event.body).toEqual(mockStations);
          }
        });

        const mockReq = httpMock.expectOne(BikeService.corsApiUrl + BikeService.stationInfoUrl);

        expect(mockReq.cancelled).toBeFalsy();
        expect(mockReq.request.responseType).toEqual('json');
        mockReq.flush(mockStations);

        httpMock.verify();
      }
    )
  );

  it('should get station info',inject(
      [HttpTestingController, BikesService],
      (httpMock: HttpTestingController, BikeService: BikesService) => {

        BikeService.getBikeSiteStatus().subscribe((event: HttpEvent<any>) => {
          switch (event.type) {
            case HttpEventType.Response:
              expect(event.body).toEqual(mockStationStatus);
          }
        });

        const mockReq = httpMock.expectOne(BikeService.corsApiUrl + BikeService.stationStatusUrl);

        expect(mockReq.cancelled).toBeFalsy();
        expect(mockReq.request.responseType).toEqual('json');
        mockReq.flush(mockStationStatus);

        httpMock.verify();
      }
    )
  );
});
