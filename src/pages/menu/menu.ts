import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import * as WC from 'woocommerce-api';
import {ProductsByCategoryPage} from '../products-by-category/products-by-category';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class Menu {

  homePage: Component;
  WooCommerce: any;
  categories: any[];
  @ViewChild('content') childNavCrtl: NavController;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.homePage = HomePage;
    this.categories = [];

    this.WooCommerce = WC({
      url: "http://localhost/wordpress",
      consumerKey: "ck_58fd92828155fe9b78bfb07566a547623e9ec151",
      consumerSecret: "cs_1861ecfa42cf35cd9cc757032598c6d581498d07"
    });


    this.WooCommerce.getAsync("products/categories").then((data) => {
      console.log(JSON.parse(data.body).product_categories);

      let temp: any[] = JSON.parse(data.body).product_categories;

      for(let i = 0; i < temp.length; i++) {
        if(temp[i].parent == 0) {

          if(temp[i].slug == "accessories") {
            temp[i].icon = "basket";
          }
          if(temp[i].slug == "hoodies") {
            temp[i].icon = "logo-octocat";
          }
          if(temp[i].slug == "tshirts") {
            temp[i].icon = "shirt";
          }

          this.categories.push(temp[i]);
        }
      }
      
    }, (err) => {
      console.log(err);
    })

  }

  openCategoryPage(category) {
    this.childNavCrtl.setRoot(ProductsByCategoryPage, { "category": category})
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }

}
