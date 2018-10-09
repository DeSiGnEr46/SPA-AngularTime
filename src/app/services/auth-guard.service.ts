import { Injectable } from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private _logService: LogService) {

  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._logService.sesionValida();
  }
}
