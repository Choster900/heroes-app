import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, GuardResult, MaybeAsync, Route, UrlSegment, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, pipe, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanMatch, CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }


  private checkAuthStatus(): boolean | Observable<boolean> {
    return this.authService.checkAuthentication()
    .pipe(
      tap(isAuth => console.log("Auth:", isAuth)),
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigate(['./auth/login']);
        }
      })
    );
  }

  canMatch(route: Route, segments: UrlSegment[]): MaybeAsync<GuardResult> {
    /* console.log("Cant Match");
    console.log({ route, segments }); */


    return this.checkAuthStatus();
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {

  /*   console.log("Cant Match");
    console.log({ route, state }); */


    return this.checkAuthStatus();

  }

}
