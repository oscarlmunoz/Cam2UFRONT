import { Component, OnInit, ElementRef, CUSTOM_ELEMENTS_SCHEMA, ViewEncapsulation } from '@angular/core';
import 'fabric'; // Importing the fabric library
import { SelectItem } from 'primeng/api';
import { Message } from 'primeng/components/common/api';
import { NgModel, PatternValidator } from '@angular/forms';
import { ArticleService } from '../../resources/services/article.service';
import { FileService } from '../../resources/services/file.service';
import { CategoryService } from '../../resources/services/category.service';
import { Category } from '../../resources/classes/category';

import { Observable } from 'rxjs';
import { Router } from '@angular/router';

// We must declare it before using it properties
declare let fabric;

@Component({
  selector: 'app-designer',
  templateUrl: './designer.component.html',
  styleUrls: ['./designer.component.css'],
  providers: [ArticleService, FileService, CategoryService], // Service provider registration
  encapsulation: ViewEncapsulation.None
})

export class DesignerComponent implements OnInit {

  loadingDesign: boolean = false;
  loadingGarment: boolean = false;
  loadingAttach: boolean = false;

  private canvas;
  private resetCanvas;
  public url: string;
  public colors: any[];
  public images: any[];
  public selected = true;
  display: boolean = false; // display p-dialog flag
  designStarted: boolean = false; // flag
  sizesAvailable: SelectItem[];
  selectedSize: string;

  public categories: Category[];
  public tempCategories: Category[];
  public selectedCategory;
  public categoryUrl: string;
  public subcategoryUrl: string;
  isTrue: boolean = true;
  isFalse: boolean = false;

  garmentPrice: number = 0;
  designsPrice: number = 0;
  articlePrice: number = 0;

  selectedGender: string;

  msgs: Message[]; // growl message

  color: string; // Article property
  garmentUrl: {};
  designUrl: {};
  tamano: string; // Article property
  nombre: string;

  newArticle = {};

  constructor(
    private myElement: ElementRef,
    private articleService: ArticleService,
    private fileService: FileService,
    private categoryService: CategoryService,
    private router: Router
  ) { }
  /**
   * Life Ciclehook ngOnInit
   */
  ngOnInit() {
    // Load necessary data
    this.getDesigns();
    this.getCategories();
    this.getSizes();
    // Our canvas will get the whole parent size
    this.canvas = new fabric.Canvas('canvas', {
      width: 500,//this.myElement.nativeElement.parentElement.clientWidth,
      height: 600 // this.myElement.nativeElement.parentElement.clientHeight
    });
  }
  /**
   * This ask the service to get all the preloaded designs
   */
  getDesigns() {
    this.loadingDesign = true;
    // This is used to iterate through designs and paint the designs
    this.images = [];
    this.designUrl = { "url": "designs" };
    this.fileService.readFiles(this.designUrl)
      .subscribe(
        designsReturned => {
          this.images = designsReturned;
          this.loadingDesign = false;
        },
        error => console.log('Error = ' + error)
      );
  }
  /**
   * This ask the service to get all the Categories
   */
  getCategories() {
    // This is used to iterate through folders and paint the categories
    this.categoryService.readCategoryDB() // or readCategory to get the from folder
      .subscribe(
        categoriesReturned => {
          this.tempCategories = categoriesReturned;
          if (this.selectedGender && this.selectedGender == "Hombre") {
            this.removeDuplicates(0);
          } else if (this.selectedGender && this.selectedGender == "Mujer") {
            this.removeDuplicates(1);
          }
        },
        error => console.log('Error = ' + error)
      );
  }
  /**
   * This loads the garment due to an specific url
   * (Wich depends on wich gender and category is chosen)
   * @param url string
   */
  loadGarment(url) {
    this.loadingGarment = true;
    // This is used to iterate through colours and paint the garment
    this.colors = [];
    this.garmentUrl = { "url": "garments/" + url }; // This is the default garment load.
    // Llamamos al servicio para crearlo
    this.fileService.readFiles(this.garmentUrl)
      .subscribe(
        colorsReturned => {
          this.colors = colorsReturned;
          this.loadingGarment = false;
        },
        error => console.log('Error = ' + error)
      );
  }

  changeGarmenPrice(selectedCategory) {
    this.garmentPrice = selectedCategory.precio;
  }

  /**
   * Asign new garment selected size 
   * @param event Object event 
   */
  change(event) {
    this.selectedSize = event.value;
  }

  /**
   * This just shows the category of an specific gender
   * @param gender string
   */
  removeDuplicates(gender) {
    this.categories = [];
    for (let category of this.tempCategories) {
      if (category.genero == gender) {
        this.categories.push(category);
      }
    }
    return this.tempCategories;
  }
  /**
   * This just hardcode an object due to translate
   * from a letter to a string (more human readabla)
   * (EX: s -> Pequeña, l -> grande...)
   */
  getSizes() {
    this.sizesAvailable = [];
    this.sizesAvailable.push(
      { label: 'Pequeña', value: 's' },
      { label: 'Mediana', value: 'm' },
      { label: 'Grande', value: 'l' },
      { label: 'Extra Grande', value: 'xl' },
      { label: 'Doble Extra', value: '2xl' },
      { label: 'Triple Extra', value: '3xl' },
    );
  }
  /**
   * This is used to change the category 
   */
  changeCategory() {
    if (this.selectedGender && this.selectedCategory) {
      this.categoryUrl = this.selectedCategory.tipo;
      this.subcategoryUrl = this.selectedGender;
      let fulllUrl = this.categoryUrl + "/" + this.subcategoryUrl;
      this.loadGarment(fulllUrl);
    }
  }

  centerImage(img) {
    this.canvas.centerObject(img);
  }

  /**
   * Method executed when garment from right menú is selected
   * (And sets base garment price)
   * @param event Object event
   * @param color string
   */
  addGarmentOnCanvas(event: any, color: any) {
    let element = event.target;
    if (element.src) {
      fabric.Image.fromURL(element.src, (garment) => {
        garment.set({
          angle: 0,
          height: 600,
          width: 500,
        });
        this.centerImage(garment);
        this.canvas.setBackgroundImage(garment);
        this.canvas.renderAll();
      });
      this.designStarted = true;
      this.color = color;
    }
  }

  /**
   * Similar to prev method, but this is executed when a design is chosed
   * (And increase price)
   * @param event Object Event
   */
  addImgFromCard(event: any) {
    let element = event.target;
    fabric.Image.fromURL(element.src, (image) => {
      image.set({
        left: 10, // Image box margin
        top: 10,
        angle: 0,
        padding: 10, // Image padding from its box
        cornersize: 10,
        hasRotatingPoint: true,
        width: 150,
        height: 150
      });
      this.canvas.add(image);
      this.focusItem(image);
      this.designsPrice += 1; // foreach design the price increases
    });
  }

  focusItem(obj) {
    this.canvas.deactivateAllWithDispatch().renderAll();
    this.canvas.setActiveObject(obj);
  }

  /**
   * User bringToFront tool method.
   */
  bringToFront() {
    let activeObject = this.canvas.getActiveObject(),
      activeGroup = this.canvas.getActiveGroup();
    if (activeObject) {
      this.canvas.bringToFront(activeObject);
    }
    else if (activeGroup) {
      let objectsInGroup = activeGroup.getObjects();
      this.canvas.discardActiveGroup();
      objectsInGroup.forEach((object) => {
        object.bringToFront();
      });
    }
  }

  /**
   * Display an item or group of items to back.
   */
  sendToBack() {
    let activeObject = this.canvas.getActiveObject(),
      activeGroup = this.canvas.getActiveGroup();
    if (activeObject) {
      activeObject.sendToBack();
    }
    else if (activeGroup) {
      let objectsInGroup = activeGroup.getObjects();
      this.canvas.discardActiveGroup();
      objectsInGroup.forEach((object) => {
        object.sendToBack();
      });
    }
  }

  /**
   * Remove a selected item or group of items
   * (And decrease price)
   */
  removeSelected() {
    let activeObject = this.canvas.getActiveObject(),
      activeGroup = this.canvas.getActiveGroup();
    if (activeObject) {
      this.canvas.remove(activeObject);
      this.designsPrice -= 1; // Decrease the price
    }
    else if (activeGroup) {
      let objectsInGroup = activeGroup.getObjects();
      this.canvas.discardActiveGroup();
      let self = this;
      let howMany: number = 0;
      objectsInGroup.forEach(function (object) {
        howMany += 1;
        self.canvas.remove(object);
      });
      this.designsPrice -= howMany
    }
  }

  // Force to blur method
  cleanSelect() {
    this.canvas.deactivateAllWithDispatch().renderAll();
  }

  removeUrl(url) {
    this.url = '';
  };

  /**
   * Load a file from your local machine
   * @param event Object event
   */
  readUrl(event) {
    if (event.target.files && event.target.files[0]) {
      this.loadingAttach = true;
      var reader = new FileReader();
      reader.onload = (event) => {
        this.url = event.target['result'];
      }
      reader.readAsDataURL(event.target.files[0]);
      this.loadingAttach = false;
    }
  }

  showDialog() {
    this.display = true;
  }
  /**
   * This creates the final image
   * @param newWidth int
   */
  GetCanvasAtResoution(newWidth) {
    if (this.canvas.width != newWidth) {
      var scaleMultiplier = newWidth / this.canvas.width;
      var objects = this.canvas.getObjects();
      for (var i in objects) {
        objects[i].scaleX = objects[i].scaleX * scaleMultiplier;
        objects[i].scaleY = objects[i].scaleY * scaleMultiplier;
        objects[i].left = objects[i].left * scaleMultiplier;
        objects[i].top = objects[i].top * scaleMultiplier;
        objects[i].setCoords();
      }
      var obj = this.canvas.backgroundImage;
      if (obj) {
        obj.scaleX = obj.scaleX * scaleMultiplier;
        obj.scaleY = obj.scaleY * scaleMultiplier;
      }
      this.canvas.discardActiveObject();
      this.canvas.setWidth(this.canvas.getWidth() * scaleMultiplier);
      this.canvas.setHeight(this.canvas.getHeight() * scaleMultiplier);
      this.canvas.renderAll();
      this.canvas.calcOffset();
    }
  }

  /**
   * This rasterize the image and collect all the data to ask
   * the service to create a new article.
   */
  generateArticle() {
    this.msgs = []; // We start msgs to empty

    if (this.nombre && this.nombre.length > 0 && this.selectedSize
      && this.selectedSize.length > 0) {
      // Rasterize to SVG
      this.GetCanvasAtResoution(200);
      let myImg = this.canvas.toSVG();
      // Geneneramos el artículo
      this.articlePrice = +this.garmentPrice + +this.designsPrice;
      this.newArticle = {
        id_prenda: this.selectedCategory.id_tipo, tamano: this.selectedSize, color: this.color, precio: this.articlePrice,
        imagen: myImg, nombre: this.nombre
      };
      // Llamamos al servicio para crearlo
      this.articleService.createArticle(this.newArticle)
        .subscribe(
          article => {
            if (article) {
              this.msgs.push({ severity: 'success', summary: 'Exito', detail: 'Su artículo se ha creado correctamente.' });
              // Remove design
              this.router.navigate(['']);
            } else {
              this.msgs.push({ severity: 'error', summary: 'ERROR', detail: 'Su artículo NO se ha creado correctamente.' });
            }
          },
          error => console.log('Error = ' + error)
        );
    } else {
      console.log("Faltan datos"); 
    }
    // Reset Values
    this.nombre = '';
    this.selectedSize = '';
    this.display = false; // Close sidebar.
    this.GetCanvasAtResoution(500);
  }

}
