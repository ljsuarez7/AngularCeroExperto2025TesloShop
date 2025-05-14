import { inject } from '@angular/core';
import { Router, type CanMatchFn, type Route, type UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

export const notAuthenticatedGuard: CanMatchFn = async (route: Route, segments: UrlSegment[]) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = await firstValueFrom(authService.checkStatus()); //Con el firstValueFrom esperamos a que se resuelva el observable antes de asignarlo

  if(isAuthenticated){
    router.navigateByUrl('/');
    return false;
  }

  return true;

};
