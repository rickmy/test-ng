import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { ToastService } from '@services/toast/toast.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.error instanceof ErrorEvent) {
        toast.openToast({ severity: 'error', detail: error.error.message });
      } else {
        toast.openToast({
          severity: 'error',
          detail: 'Ah ocurrido un error. ',
        });
      }
      return throwError(() => error);
    }),
  );
};
