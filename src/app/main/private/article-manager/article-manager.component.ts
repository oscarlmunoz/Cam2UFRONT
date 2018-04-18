import { Component, OnInit  } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { Article } from '../../resources/classes/article';
import { ArticleService } from '../../resources/services/article.service'
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';



@Component({
  selector: 'app-article-manager',
  templateUrl: './article-manager.component.html',
  styleUrls: ['./article-manager.component.css'],
  providers: [ArticleService] // Service provider registration

})
export class ArticleManagerComponent implements OnInit {

  // List of articles array
  articles: Article[];
  article: Article;

  loading: boolean = false;

  msgs: Message[];

  updateFlag: boolean = false;

  constructor(
    private articleService: ArticleService,
    private router:Router
    ) { }
  /**
   * Life ciclehook ngOnInit
   */
  ngOnInit() {
    this.getArticle(); 
  }

  /**
   * Method that receive all the articles and pass them
   * to variable 'articles'
   */
  getArticle(){
    this.showLoader();
    this.articleService.readAllArticles()
    .subscribe(articles =>{
      this.articles = articles['records'];
      this.sanitize(this.articles);
        this.hideLoader();
    }); 
  }

  /**
   * This method is necessary to transform number to boolean 
   * @param articles Object array 
   */
  sanitize(articles){
    if(articles){
      for (let article of articles){
        if (article.publicado > 0) {
          article.publicado = true; 
        } else {
          article.publicado = false;
        } 
      }
    }
  }

  prepareUpdate(){
    this.updateFlag = !this.updateFlag;
  }

  /**
   * Update article status method.
   * @param article object array of articles
   */
  updateArticle(article){
      this.articleService.updateArticle(article)
        .subscribe(
          returnedArticle => {
            this.article = returnedArticle;
            this.msgs = [];
            this.msgs.push({ severity: 'success', summary: "Artículo "+article.id_articulo, detail: "Datos actualizados." });
            this.updateFlag = false;
            console.log ( article );
          },
          error => {
            console.log('Error = ' + error);
          }
        );
  }

  /**
   * Article deletion method
   * @param article object array of articles
   */
  deleteArticle(article){
    this.articleService.deleteArticle(article)
      .subscribe(
        returnedArticle => {
          this.article = returnedArticle;
          this.msgs = [];
          this.msgs.push({ severity: 'success', summary: "Artículo "+article.id_articulo, detail: "Eliminado satisfactoriamente." });
          console.log ( article );
          this.getArticle();
        },
        error => {
          console.log('Error = ' + error);
        }
      );
  }

  showLoader() {
    this.loading =true;
  } 
  hideLoader() {
    this.loading = false;
  }

}
