import { BrowserModule } from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import * as Raven from 'raven-js';
import { FrontPageComponent } from './Front page/front-page.component';

import { AppComponent } from './app.component';

Raven
    .config('https://7212fa3dba8a44e08573eebdab6e1d5e@sentry.io/203716')
    .install();

export class RavenErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    Raven.captureException(err);
  }
}

@NgModule({
  declarations: [
    AppComponent,
    FrontPageComponent,
  ],
  imports: [
    BrowserModule,
  ],
  providers: [{ provide: ErrorHandler, useClass: RavenErrorHandler }],
  bootstrap: [AppComponent,
    FrontPageComponent,
  ]
})
export class AppModule { }
