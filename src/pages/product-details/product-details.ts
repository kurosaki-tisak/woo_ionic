import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import * as WC from 'woocommerce-api';

@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})

export class ProductDetailsPage {

  product: any;
  WooCommerce: any;
  reviews: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public toastCtrl: ToastController, public storage: Storage) {

    this.product = this.navParams.get("product");
    console.log(this.product);

    this.WooCommerce = WC({
      url: "http://localhost/wordpress",
      consumerKey: "ck_58fd92828155fe9b78bfb07566a547623e9ec151",
      consumerSecret: "cs_1861ecfa42cf35cd9cc757032598c6d581498d07"
    });

    this.WooCommerce.getAsync('products/' + this.product.id + '/reviews').then((data) => {

      this.reviews = JSON.parse(data.body).product_reviews;
      console.log(this.reviews);

    }, (err) => {
      console.log(err);
    })

  }

  addToCart(product) {

    this.storage.get("cart").then((data) => {

      if (data == null || data.length == 0) {

        data = [];

        data.push({
          "product": product,
          "qty": 1,
          "amount": parseFloat(product.price)
        });

      } else {

        let added = 0;

        for (let i = 0; i < data.length; i++) {

          if (product.id == data[i].product.id) {

            console.log("Product is already in the cart");

            let qty = data[i].qty;

            data[i].qty = qty + 1;
            data[i].amount = parseFloat(data[i].amount) + parseFloat(data[i].product.price);
            added = 1;
          }

        }

        if (added == 0) {
          data.push({
            "product": product,
            "qty": 1,
            "amount": parseFloat(product.price)
          });
        }

      }

      this.storage.set("cart", data).then( ()=> {

        console.log("Cart Updated");
        console.log(data);

        this.toastCtrl.create({
            message: "Cart Updated",
            duration: 3000
        }).present();

      })

    });
  }

}
