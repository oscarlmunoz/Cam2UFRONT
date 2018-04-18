import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {

  isAuthenticated: boolean = false;

  constructor() { }

  isSuperAdmin() {
    return this.isAuthenticated;
  }

}
