import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

console.log('App: Main.ts loaded');

bootstrapApplication(AppComponent, appConfig)
  .then(() => console.log('App: Bootstrap Success'))
  .catch((err) => console.error('App: Bootstrap Error', err));
