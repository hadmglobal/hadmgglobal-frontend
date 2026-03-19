import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { LoaderInterceptor } from './interceptors/loader-interceptor';

import { routes } from './app.routes';

import { ErrorLoggerInterceptor } from './interceptors/error-logger-interceptor';


import { HttpClientModule } from '@angular/common/http'; // ✅ Add this
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([LoaderInterceptor,ErrorLoggerInterceptor])
    ),
    provideClientHydration(withEventReplay()),
    // ✅ Import these modules properly using importProvidersFrom()
    importProvidersFrom(
      HttpClientModule,
      FlexLayoutModule,
      MatButtonModule,
      MatCardModule
    )
  ]
};
