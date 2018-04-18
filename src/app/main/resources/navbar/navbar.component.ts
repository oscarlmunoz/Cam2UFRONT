import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Article } from '../classes/article';
import {CartService} from '../services/cart.service'; //'../../resources/services/cart.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  
  public shoppingCartItems$: Observable<Article[]>;

  constructor(private cartService: CartService) { 
    this.shoppingCartItems$ = this
      .cartService
      .getItems();

    this.shoppingCartItems$.subscribe(_ => _);
  }

  ngOnInit() {
  }

  toggleActive(event) {
    // event.preventDefault();
    console.log("Active");
  }

}
