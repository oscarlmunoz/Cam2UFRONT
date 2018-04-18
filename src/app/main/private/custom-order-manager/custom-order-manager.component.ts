import { Component, OnInit, DoCheck } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { LoginService } from '../../resources/services/login.service';
import { Order } from '../../resources/classes/order';
import { OrderService } from '../../resources/services/order.service';
import { Content } from '../../resources/classes/content';
import { Message } from 'primeng/components/common/api';


@Component({
  selector: 'app-custom-order-manager',
  templateUrl: './custom-order-manager.component.html',
  styleUrls: ['./custom-order-manager.component.css'],
  providers: [OrderService] // Service provider registration
})
export class CustomOrderManagerComponent implements OnInit {

  loggedIn: boolean;
  // List of articles array
  orders: Order[];

  // List of content array
  contents: Content[];

  displayContent: boolean = false;
  msgs: Message[];

  possibleStatus: any;

  selectedStatus: any;

  loading: boolean = false;
  dni: string;

  constructor(
    private loginService: LoginService,
    private orderService: OrderService
  ) { }

  /**
   * Life ciclehook ngOnInit
   */
  ngOnInit() {
    this.loginService.dniStatus.subscribe(_ => this.dni = _)
    this.loginService.customerStatus.subscribe(_ => {
      this.loggedIn = _ ;
      if(this.loggedIn && this.dni) {
        this.getOrders();
      }
    });

     this.possibleStatus = [];
    this.possibleStatus.push(
      { id: 0, name: "En proceso" },
      { id: 1, name: 'Preparado' },
      { id: 2, name: 'Enviado' },
      { id: 3, name: 'Entregado' },
      { id: 4, name: 'Cancelado' }
    );
  }

  /**
   * This method ask the service for all generated orders for an 
   * specific customer (It must create a dniObject to pass)
   */
  getOrders(){
    this.showLoader();
    let dniObject = {};
    dniObject = {dni: this.dni};
    this.orderService.searchOrder(dniObject)
    // this.orderService.readAllOrders()
    .subscribe(_ => {
        this.orders = _['records'];
          this.hideLoader();          
    }); 
  }

  showLoader() {
    this.loading = true;
  } 
  hideLoader() {
    this.loading = false;
  }

  /**
   * To get the content of an specific order.
   * @param order Object Order
   */
  watchContent(order: Order) {
    this.orderService.searchContent(order)
      .subscribe(
        _ => {
          this.contents = _;
          if (this.contents) {
            this.displayContent = true;
            console.log(this.contents);
          } else {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: "Ooops!", detail: "¡Este pedido está vacío!" });
          }
        },
        error => {
          console.log('Error = ' + error)
        }
      );
  }


}
