import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BikeListComponent } from './Bike-list/Bike-list.components';
import { BikeMapComponent } from './Bike-map/Bike-map.component';


@NgModule({
  declarations: [
    AppComponent,
    BikeListComponent,
    BikeMapComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,

  ],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
