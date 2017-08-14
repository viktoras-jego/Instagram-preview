import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FrontPageComponent } from './Front page/front-page.component';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    FrontPageComponent,
  ],
  imports: [
    BrowserModule,
  ],
  providers: [],
  bootstrap: [AppComponent,
    FrontPageComponent,
  ]
})
export class AppModule { }
