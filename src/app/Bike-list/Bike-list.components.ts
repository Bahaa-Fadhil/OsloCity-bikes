import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { BikesService } from '../BikesService.service';

interface StationInfo {
  station_id: string;
  name: string;
  address: string;
  lat: number;
  lon: number;
  capacity: number;
}

interface StationStatus {
  is_installed: number;
  is_renting: number;
  num_bikes_available: number;
  num_docks_available: number;
  last_reported: number;
  is_returning: number;
  station_id: string;
}

interface DisplayStatus {
  station_id: string;
  name: string;
  address: string;
  lat: number;
  lon: number;
  num_bikes_available: number;
  num_docks_available: number;
  last_reported: number;
}

@Component({
  selector: 'app-Bike-list',
  templateUrl: './Bike-list.component.html',
  styleUrls: ['./Bike-list.component.scss']
})
export class BikeListComponent implements OnInit, OnDestroy {

  public lastUpdated: number;
  public statusList = Array(); /* list of sites with statuses and names */
  private subscription: Subscription;
  public foo: any;
  public bar: any;

  constructor(
    public BikesService: BikesService
  ) { }

  ngOnInit() {
    this.subscription = this.BikesService.getCombinedBikesAndStatus()
      .subscribe(res => {
        if (res.length === 2 && res[0].data && res[0].data.stations &&
          res[1].data && res[1].data.stations && res[1].last_updated) {
          this.lastUpdated = res[1].last_updated;
          this.statusList = this.createBikeStatusList(res[0].data.stations, res[1].data.stations);
        }
    });
  }

  /**
   * Create a list of statuses to be sendt to map
   * @param stations - an array of station information objects
   * @param statuses - an array of station status objects
   * @returns returns a list of station objects containing station name and availability status
   */
  public createBikeStatusList(stations: Array<StationInfo>, statuses: Array<StationStatus>): Array<DisplayStatus> {
    const statusList = Array();
    stations.forEach(elem => {
      const stationStatus = this.getStationStatusInfo(elem.station_id, statuses);
      if (stationStatus) {
        statusList.push(this.createStatusElem(elem, stationStatus));
      }
    });
    return statusList;
  }

  /**
   * Get the status information of a station from its id
   * @param id - the station id
   * @param stations - an array of station status objects
   * @returns returns the station object with the corresponding id
   */
  public getStationStatusInfo(id: string, stations: Array<StationStatus>): StationStatus {
    return stations.find(elem => {
      return elem.station_id && elem.station_id === id;
    });
  }

  /**
   * Create a status object containing station info and availability status
   * @param info- a station info object
   * @param status - a station status object
   * @returns returns an object containing station info and availability status
   */
  private createStatusElem(info: StationInfo, status: StationStatus): DisplayStatus {
    return {
      station_id: info.station_id,
      name: info.name,
      lat: info.lat,
      lon: info.lon,
      address: info.address,
      num_bikes_available: status.num_bikes_available,
      num_docks_available: status.num_docks_available,
      last_reported: status.last_reported
    };
  }

  /**
   * Convert posix timestamp to human readable format
   * @param posix- a posix timestamp
   * @returns returns a human readable time as a string
   */
  public displayDate(posix: number): string {
    const currentDatetime = new Date(posix * 1000);
    const formattedDate = currentDatetime.getFullYear() +
      '.' + (currentDatetime.getMonth() + 1) + '.' +
      currentDatetime.getDate() + '  ' + currentDatetime.getHours() +
      ':' + currentDatetime.getMinutes() + ':' + currentDatetime.getSeconds();
    return formattedDate;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
