import { map, take, tap } from 'rxjs/operators';


import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';


@Injectable()
export class RequireUnauthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {
  }

  canActivate(): Observable<boolean> {
    return this.auth.authenticated$.pipe(
      take(1),
      tap(authenticated => {
        if (authenticated) {
          this.router.navigate(['/tasks']);
        }
      }),
      map(authenticated => !authenticated));
  }
}
