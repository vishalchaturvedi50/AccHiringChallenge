import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from './environments/environment';
import { MainModule } from "app/mainModule/app.main.module";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(MainModule);
