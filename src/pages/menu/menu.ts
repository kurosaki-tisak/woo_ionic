import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController} from 'ionic-angular';
import { HomePage } from '../home/home';
import * as WC from 'woocommerce-api';
import {ProductsByCategoryPage} from '../products-by-category/products-by-category';
import { SignupPage } from '../signup/signup';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';
import { CartPage } from '../cart/cart';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class Menu {

  homePage: Component;
  WooCommerce: any;
  categories: any[];
  @ViewChild('content') childNavCrtl: NavController;
  loggedIn: boolean;
  user: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage,
    public modalCtrl: ModalController) {
    this.homePage = HomePage;
    this.categories = [];
    this.user = {};

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
          if(temp[i].slug =="albums") {
            temp[i].icon = "albums";
          }
          if(temp[i].slug == "clothing") {
            temp[i].icon = "shirt";
          }
          if(temp[i].slug == "music") {
            temp[i].icon = "musical-notes";
          } 

          this.categories.push(temp[i]);
        }
      }
      
    }, (err) => {
      console.log(err);
    })

  }

  ionViewDidEnter() {
   
   this.storage.ready().then( ()=> {
     this.storage.get("userLoginInfo").then( (userLoginInfo)=> {
       
       if(userLoginInfo != null) {
        console.log("User logged in...");
        this.user = userLoginInfo.user;
        console.log(this.user);
        this.loggedIn = true;

       } else {
        console.log("No user found.");
        this.user = {};
        this.loggedIn = false;

       }
     })
   })

  }

  openCategoryPage(category) {
    this.childNavCrtl.setRoot(ProductsByCategoryPage, { "category": category})
  }

  openPage(pageName: string) {
    if(pageName == "signup"){
      this.navCtrl.push(SignupPage);
    }
    if(pageName == "login"){
      this.navCtrl.push(LoginPage);
    }
    if(pageName == "logout"){
      this.storage.remove("userLoginInfo").then( ()=> {
        this.user = {};
        this.loggedIn = false;
      })
    }
    if(pageName == "cart"){
      let modal = this.modalCtrl.create(CartPage);
      modal.present();
    }
  }

}
