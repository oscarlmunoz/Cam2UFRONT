import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CartService } from '../../resources/services/cart.service';
import { Article } from '../../resources/classes/article';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LoginService } from '../../resources/services/login.service';
import { OrderService } from '../../resources/services/order.service';
import { Order } from '../../resources/classes/order';
import { Message } from 'primeng/components/common/api';
import { Content } from '../../resources/classes/content';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  providers: [OrderService],
  encapsulation: ViewEncapsulation.None

})
export class CartComponent implements OnInit {

  display: boolean = false;
  public shoppingCartItems$: Observable<Article[]> = of([]);
  public shoppingCartItems: Article[] = [];
  public total: number = 0;

  content: any;

  loading: boolean = false;

  loggedIn: boolean;
  adminLoggedIn: boolean;
  customerDni: string;

  msgs: Message[]; // growl message

  // Dependency
  constructor(
    private cartService: CartService,
    private loginService: LoginService,
    private orderService: OrderService
  ) {
    this.shoppingCartItems$ = this
      .cartService
      .getItems();
    this.shoppingCartItems$.subscribe(_ => this.shoppingCartItems = _);
  }
  /**
   * Life ciclehook ngOnInit
   */
  ngOnInit() {
    // Several necessary subscriptions
    this.loginService.customerStatus.subscribe(_ => this.loggedIn = _),
      this.loginService.adminStatus.subscribe(_ => this.adminLoggedIn = _),
      this.loginService.dniStatus.subscribe(_ => this.customerDni = _),
      this.cartService.dbContentStatus.subscribe(_ => this.content = _)
  }

  /**
   * Event onClick wich increase the total price
   */
  onClick() {
    this.total = 0;
    if (this.shoppingCartItems.length > 0) {
      for (let item of this.shoppingCartItems) {
        this.total += +item.precio; // Price calculating
      }
    }
  }

  /**
   * To remove a specific item and decrease the price
   * @param item Object Article
   */
  public removeItem(item: Article) {
    this.total -= item.precio;
    this.cartService.removeFromCart(item);
  }

  /**
   * This makes some control and then ask the service to create
   * a new Order.
   */
  startOrder() {
    this.msgs = []; // We start msgs to empty
    if (this.adminLoggedIn || !this.loggedIn) {
      this.msgs.push({ severity: 'info', summary: 'ERROR', detail: 'Debe estar registrado como usuario para poder comprar.' });
      this.display = false;
    } else if (this.loggedIn) {
      let order: Order;
      // We create a new order
      order = {
        id_pedido: null,
        estado: 0,
        nifCliente: this.customerDni
      }
      // check control
      if (order.nifCliente && order.nifCliente != "") {
        this.showLoader();
        this.orderService.createOrder(order)
          .subscribe(
            newOrderId => {
              if (newOrderId) { // if we could create the new order, we get the order Id
                this.contentOrder(newOrderId); // If no errors, let's create the contents
                this.msgs = [];
                this.msgs.push({ severity: 'success', summary: 'Pedido realizado', detail: '¡Su pedido se ha generado con éxito!' });
                this.display = false;
                this.hideLoader();
                this.cleanCart();
              } else {
                console.log("Error al crear el pedido.");
              }
            },
            error => console.log("Error = " + error)
          );
      }
    }
  }

  /**
   * This totally cleans the cart.
   */
  cleanCart() {
    this.total = 0;
    for (let item of this.shoppingCartItems) {
      this.cartService.removeFromCart(item);
    }

  }

  showLoader() {
    this.loading = true;
  }
  hideLoader() {
    this.loading = false;
  }

  /**
   * After order creation we must create the content of 
   * such order.
   * @param orderId string
   */
  contentOrder(orderId) {
    // Iterate through the Object array
    for (let object of this.content) {
      if (object[0].id_articulo) {
        this.createContent(object, orderId);
      }
    }
  }
  /**
   * For each article we create a content.
   * @param object Object Article
   * @param orderId string 
   */
  createContent(object, orderId) {
    let id_pedido = orderId.id_pedido;
    let id_articulo = object[0].id_articulo;
    let cantidad = object[1];
    let content: Content = {
      "id_pedido": id_pedido,
      "id_articulo": id_articulo,
      "cantidad": cantidad
    }
    if (cantidad > 0) {
      this.orderService.createContent(content)
        .subscribe(
          _ => {
            if (_) {
              console.log('Añadiendo artículos');
            } else {
              console.log("Contenido del pedido no generado");
            }
          }, error => console.log("Error = " + error)
        );
    }
  }

}
