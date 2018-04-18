import { Component, OnInit, Input, Output, EventEmitter, Pipe} from '@angular/core';
import 'fabric'; // Importing the fabric library
import { ArticleService } from '../../resources/services/article.service'
import { CartService } from '../../resources/services/cart.service';
import { Observable } from 'rxjs/Observable';
import { Article } from '../../resources/classes/article';
import { Message } from 'primeng/api';
import { DomSanitizer } from '@angular/platform-browser';
import { SafePipe } from '../../resources/pipes/safe.pipe';


// We must declare it before using it properties
// declare let fabric;

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
  providers: [ArticleService] // Service provider registration

})
export class GalleryComponent implements OnInit {

  // List of articles array
  articles: Article[];

  // Message Array
  msgs: Message[] = [];

  loading: boolean = false;
  
  // initialize articleService to retrieve list articles in the ngOnInit()
  // initializa cartService able to add articles
  constructor(
    private articleService: ArticleService, 
    private cartService: CartService,
  ) {
  }
  
  /**
   * Life Ciclehook ngOnInit
   */
  ngOnInit() {
    this.showLoader();
    // Read articles from API.
    this.articleService.readArticles()
    .subscribe(articles => {
      this.articles = articles['records'];
      this.hideLoader();
    }
    );   
  }

  showLoader() {
    this.loading =true;
  } 
  hideLoader() {
    this.loading = false;
  }
  /**
   * This method ask the service to add an specific article to cart
   * @param article Object Article
   */
  addToCart(article) {
    this.cartService.addToCart(article);
    this.msgs.push({ severity: 'success', summary: 'Artículo añadido:', detail: article.nombre });
    setTimeout(() => {
      this.msgs.length=0;
  }, 1000);
  }

}
