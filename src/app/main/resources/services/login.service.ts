import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class LoginService {

  private admin = new BehaviorSubject<boolean>(false);
  public adminStatus = this.admin.asObservable();

  private customer = new BehaviorSubject<boolean>(false);
  public customerStatus = this.customer.asObservable();

  private customerDni = new BehaviorSubject<string>("");
  public dniStatus = this.customerDni.asObservable();

  constructor() { }

  changeCustomerStatus(newStatus: boolean){
    this.customer.next(newStatus);
  }

  asignCustomerDni(newDni: string){
    this.customerDni.next(newDni);
  }

  changAdminStatus(newStatus: boolean){
    this.admin.next(newStatus);
  }

}
