import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Loader } from '../services/loader';
import { finalize } from 'rxjs/operators';

export const LoaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = inject(Loader);
  loader.show();

  return next(req).pipe(
    finalize(() => {
      loader.hide();
    })
  );
};
