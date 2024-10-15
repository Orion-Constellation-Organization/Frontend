import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/pages/home/home.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
