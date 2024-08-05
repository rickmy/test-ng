import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorHandlerInterceptor } from '@core/interceptor/error-handler.interceptor';
import { spinnerInterceptor } from '@core/interceptor/spinner.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        spinnerInterceptor,
        errorHandlerInterceptor,
      ]),
    ),
  ],
};
