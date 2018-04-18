import { Component, OnInit, EventEmitter } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { Customer } from '../../resources/classes/customer';
import { Administrator } from '../../resources/classes/administrator';
import { CustomerService } from '../../resources/services/customer.service';
import { AdminService } from '../../resources/services/admin.service';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from '../../resources/services/auth.service'
import { LoginService } from '../services/login.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [
    CustomerService,
    ConfirmationService,
    AdminService] // Service provider registration
})
export class LoginComponent implements OnInit {

  msgs: Message[];
  autoAlign: boolean;

  // We create two instantiations to know if there were any change
  prevCustom?: Customer;
  currentCustom: Customer;
  prevAdmin: Administrator;
  currentAdmin: Administrator;

  // loggedIn: boolean = false; // To know if user is already logged in
  // adminLoggedIn: boolean = false; // To know if admin is already logged in

  loggedIn: boolean;
  adminLoggedIn: boolean;

  infoCorrectPass = "Mínimo 8 caracteres, incluyendo minúsculas,mayúsculas y números";

  // user data
  dni: string;
  nombre: string;
  telefono: number;
  direccion: string;
  pass: string;
  activo: boolean;
  adminChecked: boolean = false;

  // flags
  loginOpen: boolean = false;
  userDataOpen: boolean = false;
  adminDataOpen: boolean = false;

  constructor(
    private customerService: CustomerService,
    private confirmationService: ConfirmationService,
    private adminService: AdminService,
    private authService: AuthService,
    private loginService: LoginService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.loginService.customerStatus.subscribe(_ => this.loggedIn = _)
    this.loginService.adminStatus.subscribe(_ => this.adminLoggedIn = _)
  }
  /**
   *  open the user data display
   */
  userDataDisplay() {
    this.userDataOpen = true;
  }
  adminDataDisplay() {
    this.adminDataOpen = true;
  }
  /**
   *  open the login/registration display
   */
  loginDisplay() {
    this.loginOpen = true;
  }

  resetUsers() {
    // this.loggedIn = false;
    // this.adminLoggedIn = false;
    this.userDataOpen = false;
    this.adminDataOpen = false;
    // Close authorization
    this.authService.isAuthenticated = false;
    this.loginService.changeCustomerStatus(false);
    this.loginService.changAdminStatus(false);
    this.loginService.asignCustomerDni("");
  }
  /**
   *  reset form values
   */
  resetValues() {
    this.dni = '';
    this.nombre = '';
    this.telefono = null;
    this.direccion = '';
    this.pass = '';
  }
  resetObjects() {
    this.currentCustom = Object.assign({}, null);
    this.prevCustom = Object.assign({}, this.prevCustom);
    this.currentAdmin = Object.assign({}, null);
    this.prevAdmin = Object.assign({}, this.prevCustom);
  }
  /**
   *  information messages when registration/login is selected
   */
  onTabOpen(event) {
    let message1;
    let message2;
    this.msgs = [];
    if (event.index == 0) {
      message1 = "¡Genial!";
      message2 = "¡Registrate en nuestra web!"
    } else {
      message1 = "Hey!"
      message2 = "Nos alegramos de volver a verte :)"
    }
    this.msgs.push({ severity: 'info', summary: message1, detail: message2 });
  }
  /**
   *  Information panel for desactivating user.
   */
  handleChangeActivo() {
    this.userDataOpen = false;
    this.msgs = [];
    if (!this.currentCustom.activo) {
      this.confirmationService.confirm({
        message: '¿Seguro que quiere desactivar su usuario?',
        header: 'Cambio de estado',
        icon: 'fa fa-trash',
        accept: () => {
          this.msgs = [{ severity: 'info', summary: 'Confirmado', detail: 'Ha desactivado su usuario.' }];
          this.currentCustom.activo = false;
        },
        reject: () => {
          this.msgs = [{ severity: 'info', summary: 'Rechazado', detail: 'Su usuario sigue activo' }];
          this.currentCustom.activo = true;
          this.userDataOpen = true;
        }
      });
    } else {
      this.confirmationService.confirm({
        message: '¿Activar Usuario?',
        header: 'Cambio de estado',
        icon: 'fa fa-trash',
        accept: () => {
          this.msgs = [{ severity: 'info', summary: 'Confirmado', detail: 'Ha activado su usuario.' }];
          this.currentCustom.activo = true;
          this.userDataOpen = true;
        },
        reject: () => {
          this.msgs = [{ severity: 'info', summary: 'Rechazado', detail: 'Su usuario sigue desactivado' }];
          this.currentCustom.activo = false
        }
      });
    }
  }
  /**
   * Detect if User/Admin is trying to login
   */
  userLogin() {
    // Check that all fields have value
    if (this.dni && this.pass && !this.adminChecked) {
      let customer: Customer;
      this.prevCustom = null;
      // Create the customer object
      this.customerLogin(customer);
    } else if (this.nombre && this.pass && this.adminChecked) {
      let admin: Administrator;
      this.prevCustom = null;
      // Create the customer object
      this.adminLogin(admin);
    } else {
      console.log("Faltan datos"); //lanzar mensaje de error
    }
  }
  /**
   * Customer login method
   * @param customer Object Customer
   */
  customerLogin(customer) {
    customer = {
      dni: this.dni,
      pass: this.pass,
    };
    this.customerService.readCustomer(customer)
      .subscribe(
        customer => {
          this.prevCustom = customer;
          if (this.prevCustom) {
            // We will keep an instance of the old data to check if there were changes later
            this.currentCustom = Object.assign({}, this.prevCustom);
            this.loginOpen = false;
            this.msgs = [];
            this.msgs.push({ severity: 'success', summary: "Usuario Logado", detail: "Bienvenido" });
            this.loginService.changeCustomerStatus(true);
            this.loginService.asignCustomerDni(this.currentCustom.dni);
            this.resetValues();
          } else {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: "El usuario no existe", detail: "Por favor regístrese." });
          }
        },
        error => {
          console.log('Error = ' + error)
        }
      );
  }

  /**
   * Admin login method
   * @param admin Object Admin
   */
  adminLogin(admin) {
    admin = {
      nombre: this.nombre,
      pass: this.pass
    };
    this.adminService.readAdmin(admin)
      .subscribe(
        admin => {
          this.prevAdmin = admin;
          if (this.prevAdmin) {
            this.currentAdmin = Object.assign({}, this.prevAdmin);
            this.loginOpen = false;
            this.msgs = [];
            this.msgs.push({ severity: 'success', summary: "Admin Logado", detail: "Bienvenido" })
            this.authService.isAuthenticated = true; // Giving Authorization
            this.loginService.changAdminStatus(true);
          } else {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: "No Admin", detail: "Por favor regístrese." });
          }
        },
        error => {
          console.log('Error = ' + error)
        }
      );
  }

  /**
   * New user registration method
   */
  registerUser() {
    // Check that all fields have value
    if (this.nombre && this.pass && this.dni && this.telefono && this.direccion) {
      let customer: Customer;
      this.prevCustom = null;
      // Create the customer object
      customer = {
        dni: this.dni,
        nombre: this.nombre,
        telefono: this.telefono,
        direccion: this.direccion,
        pass: this.pass,
        activo: true
      };
      this.customerService.createCustomer(customer)
        .subscribe(
          customer => {
            this.prevCustom = customer;
            if (this.prevCustom) {
              // We will keep an instance of the old data to check if there were changes later
              this.currentCustom = Object.assign({}, this.prevCustom);
              this.loginOpen = false;
              this.msgs = [];
              this.msgs.push({ severity: 'success', summary: "Usuario Creado", detail: "Bienvenido" });
              this.loginService.changeCustomerStatus(true);
              this.resetValues();
            } else {
              this.msgs = [];
              this.msgs.push({ severity: 'error', summary: "Error al registrar.", detail: "Datos incorrectos o usuario existente" });
            }
          },
          error => {
            console.log('Error = ' + error);
          }
        );
    } else {
      console.log("Faltan datos"); 
    }
  }

  /**
   * Update User method
   */
  updateUser() {
    // Check that all fields have value
    if (this.currentCustom.nombre && this.currentCustom.pass && this.currentCustom.dni && this.currentCustom.telefono
      && this.currentCustom.direccion && this.currentCustom.activo) {
      if (JSON.stringify(this.prevCustom).toLowerCase() !== JSON.stringify(this.currentCustom).toLowerCase()) {
        this.customerService.updateCustomer(this.currentCustom)
          .subscribe(
            customer => {
              this.prevCustom = customer;
              this.currentCustom = Object.assign({}, this.prevCustom);
              this.userDataOpen = false;
              this.msgs = [];
              this.msgs.push({ severity: 'success', summary: "Exito", detail: "Datos actualizados." });
            },
            error => {
              console.log('Error = ' + error);
            }
          );
      } else {
        this.msgs = [];
        this.msgs.push({ severity: 'info', summary: "No hubo cambios", detail: "Nada que modificar." });
        this.userDataOpen = false;
      }
    }
  }

  /**
   * Update Admin method
   */
  updateAdmin() {
    // Check that all fields have value
    if (this.currentAdmin.nombre && this.currentAdmin.pass) {
      if (JSON.stringify(this.prevAdmin).toLowerCase() !== JSON.stringify(this.currentAdmin).toLowerCase()) {
        this.adminService.updateCustomer(this.currentAdmin)
          .subscribe(
            admin => {
              this.prevAdmin = admin;
              this.currentAdmin = Object.assign({}, this.prevAdmin);
              this.adminDataOpen = false;
              this.msgs = [];
              this.msgs.push({ severity: 'success', summary: "Exito", detail: "Datos actualizados." });
            }, error => {
              console.log('Error = ' + error);
            }
          );
      } else {
        this.msgs = [];
        this.msgs.push({ severity: 'info', summary: "No hubo cambios", detail: "Nada que modificar." });
        this.userDataOpen = false;
      }
    }
  }

  /**
   * Close session method wich delete all the information stored.
   */
  closeSession() {
    this.resetUsers();
    this.resetValues();
    this.resetObjects();
    this.msgs = [];
    this.msgs.push({ severity: 'info', summary: "Sesión cerrada", detail: "¡Hasta luego!" });
    this.router.navigate([""]);

  }


}
