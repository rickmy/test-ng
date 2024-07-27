import { HttpInterceptorFn } from '@angular/common/http';

export const authorInterceptor: HttpInterceptorFn = (req, next) => {
  const authorId = '234';

  const request = req.clone({
    setHeaders: {
      authorId: authorId,
    },
  });
  return next(request);
};
