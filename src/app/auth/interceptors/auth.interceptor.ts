import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "@auth/services/auth.service";
import { Observable } from "rxjs";


export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {

  //Se podria limitar para que solo se dispare en algunas peticiones, tal como está ahora se dispara en todas las que utilicen http
  const token = inject(AuthService).token();

  const newReq = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${token}`)
  });

  return next(newReq);

}
