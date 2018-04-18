import { Component, OnInit } from '@angular/core';
import { Order } from '../../resources/classes/order';
import { OrderService } from '../../resources/services/order.service';
import { Content } from '../../resources/classes/content';
import { Message } from 'primeng/components/common/api';


@Component({
  selector: 'app-order-manager',
  templateUrl: './order-manager.component.html',
  styleUrls: ['./order-manager.component.css'],
  providers: [OrderService] // Service provider registration
})
export class OrderManagerComponent implements OnInit {

  // List of articles array
  orders: Order[];

  // List of content array
  contents: Content[];

  displayContent: boolean = false;
  msgs: Message[];

  possibleStatus: any;

  selectedStatus: any;

  loading: boolean = false;


  constructor(
    private orderService: OrderService,
  ) { }
  /**
   * Life ciclehook ngOnInit
   */
  ngOnInit() {
    this.getOrders();
    this.possibleStatus = [];
    this.possibleStatus.push( // Hardcoded translation
      { id: 0, name: "En proceso" },
      { id: 1, name: 'Preparado' },
      { id: 2, name: 'Enviado' },
      { id: 3, name: 'Entregado' },
      { id: 4, name: 'Cancelado' }
    );

  }
  /**
   * This ask the service to get all orders
   */
  getOrders(){
      this.showLoader();
      this.orderService.readAllOrders()
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
   * Method that let you see the content of an specific order
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
  /**
   * This lets the admin modify the order status
   * @param pedido Object Pedido
   */
  change (pedido){
    // Mapeamos el atributo pedido para pasarlo al servicio
    let pedidoModificado: Order;
    pedidoModificado = {id_pedido: pedido.id_pedido, estado: pedido.estado.id, nifCliente: pedido.nifCliente};
    console.log(pedidoModificado);
    this.orderService.updateOrder(pedidoModificado)
      .subscribe(
        _ => {
          let pedidoMod = _;
          this.msgs = [];
          this.msgs.push({ severity: 'success', summary: "Modificado", detail: "El pedido "+pedidoMod.id_pedido+" ha modificado su estado" });
        }, error => {
          console.log('Error = ' + error)
        }
      );

  }
}
