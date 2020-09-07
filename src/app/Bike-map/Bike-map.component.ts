import { Component, OnInit, Input, OnChanges } from '@angular/core';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import { Vector as VectorLayer } from 'ol/layer';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj.js';
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';
import { Style } from 'ol/style';
import VectorSource from 'ol/source/Vector';
import { Circle as CircleStyle, Fill, Text, Stroke } from 'ol/style';
import { defaults as defaultInteractions, Select } from 'ol/interaction';
import { defaults as defaultControls, Control } from 'ol/control';
import { TinyColor } from '@ctrl/tinycolor';
import Tile from 'ol/layer/Tile';


interface Station {
  station_id: string;
  name: string;
  address: string;
  lat: number;
  lon: number;
  capacity: number;
  num_bikes_available: number;
  num_docks_available: number;
  last_reported: number;
}

@Component({
  selector: 'app-Bike-map',
  templateUrl: './Bike-map.component.html',
  styleUrls: ['./Bike-map.component.scss']
})
export class BikeMapComponent implements OnInit, OnChanges {

  @Input() stationList: Array<any>;

  private vectorSource: any;
  private curMode = 'showBikes';

  constructor() { }

  ngOnInit() {
    this.initializeMap();
  }

  ngOnChanges() {
    this.updateFeatures();
  }

  private initializeMap(): void {
    /* add switch view buttons */
    const modeButton = document.getElementById('modeButtons');
    const modeControl = new Control({ element: modeButton });

    /* popup overlay for station information */
    const container = document.getElementById('popup');
    const content = document.getElementById('popup-content');
    const closer = document.getElementById('popup-closer');

    const overlay = new Overlay({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });

    // TODO add styling of feature on hover
    const featureSelect = new Select({
      condition: (evt) => {
        return evt.type === 'singleclick';
      }
    });

    // show popup on feature select
    featureSelect.on('select', (evt: any) => {
      const features = featureSelect.getFeatures().getArray();
      if (features.length) {
        const featureProps = features[0].getProperties();
        const coords = featureProps.geometry.flatCoordinates;
        content.innerHTML = '<div class="station-name">' + featureProps.name +
          '</div><div class="station-info">Sykler: ' + featureProps.num_bikes_available +
          ' Låser: ' + featureProps.num_docks_available + '</div>';
        overlay.setPosition(coords);
      }
    });

    closer.onclick = () => {
      overlay.setPosition(undefined);
      closer.blur();
      // empty selected features on close
      featureSelect.getFeatures().clear();
      return false;
    };

    this.vectorSource = new VectorSource({
      features: this.fillVectorSource()
    });

    const vectorLayer = new VectorLayer({
      source: this.vectorSource
    });

    const map = new Map({
      target: 'map',
      layers: [
        new Tile({
          source: new OSM()
        }),
        vectorLayer
      ],
      overlays: [overlay],
      controls: defaultControls().extend([
        modeControl
      ]),
      interactions: defaultInteractions().extend([featureSelect]),
      view: new View({
        center: fromLonLat([10.730981, 59.92714]),
        zoom: 13
      })
    });

    // style cursor on feature hover
    map.on('pointermove', (e) => {
      const pixel = map.getEventPixel(e.originalEvent);
      const hit = map.hasFeatureAtPixel(pixel);
      if (hit) {
        document.getElementById('map').style.cursor = 'pointer';
      } else {
        document.getElementById('map').style.cursor = '';
      }
    });
  }

  /** fill vectorsource with features */
  private fillVectorSource(): Array<Feature> {
    const vsArr = [];
    if (this.stationList) {
      this.stationList.forEach(station => {
        vsArr.push(this.createFeatureFromStation(station));
      });
    }
    return vsArr;
  }

  /**
   * Create a feature representing a station
   * @param station- a station object
   * @returns returns a feature to be shown in the map
   */
  // todo: cluster features when they overlap
  private createFeatureFromStation(station: Station): Feature {
    const st = new Feature({
      geometry: new Point(fromLonLat([station.lon, station.lat])),
      name: station.name
    });

    st.setId(station.station_id);
    this.updateFeature(st, station);

    return st;
  }

  /** Update all features with data from station list */
  private updateFeatures(): void {
    if (this.vectorSource) {
      this.stationList.forEach(station => {
        const feature = this.vectorSource.getFeatureById(station.station_id);
        this.updateFeature(feature, station);
      });
    }
  }

  /**
   * Update a feature with data from station object
   * @param feature - a feature representing a station
   * @param station- a station object
   */
  private updateFeature(feature: Feature, station: Station) {
    let num = station.num_bikes_available;
    if (this.curMode === 'showDocks') {
      num = station.num_docks_available;
    }
    // set feature color depending on number of available bikes/docks
    const col = this.getAvailColor(num);
    const stroke = this.getAvailStroke(num);
    feature.setStyle(new Style({
      image: new CircleStyle({
        radius: 8,
        fill: new Fill({
          color: col
        }),
        stroke: new Stroke({
          color: 'black'
        }),
      }),
      text: new Text({
        text: num.toString(), // todo animate when value changes
        stroke: new Stroke({
          color: stroke,
          width: 1
        }),
        fill: new Fill({
          color: stroke
        })
      })
    }));

    feature.set('num_bikes_available', station.num_bikes_available);
    feature.set('num_docks_available', station.num_docks_available);
  }

  /**
   * Calculate feature color depending on number of available bikes/docks
   * @param nb - number of available bikes or docks
   * @returns returns a class name for styling purposes
   */
  private getAvailColor(nb: number): string {
    const zeroAvail = '#e7efff';
    const color = new TinyColor(zeroAvail);
    const newCol = color.darken(Math.min(100, nb * 2)).toHexString();
    return newCol;
  }

  /**
   * Get stroke color depending on number of available bikes/docks
   * @param nb - number of available bikes or docks
   * @returns returns a class name for styling purposes
   */
  private getAvailStroke(nb: number): string {
    // todo check wcag contrast requirements
    return nb > 8 ? 'white' : 'black';
  }

  /* method for switching view */
  public toggleMode(mode: string): void {
    if (mode !== this.curMode) {
      this.curMode = mode;
      this.updateFeatures();
    }
  }
}
