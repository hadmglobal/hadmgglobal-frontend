import { inject, Injectable } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';


export const ErrorLoggerInterceptor: HttpInterceptorFn = (req, next) => {
  const startTime = Date.now();
  const router = inject(Router);


  return next(req).pipe(
    tap(() => { }),
    catchError((error: HttpErrorResponse) => {
      console.log("📝 Message:", error.error.message);
      if (error?.error?.message == "User inactive, please contact support") {
        console.log("GO TO LOGIN SCREEN")
        router.navigate(['/signin']);
      } else if (error?.error?.message == "Under Maintainance") {
        router.navigate(['/under-maintainance']);
      }
      return throwError(() => error);
    })
  );
};