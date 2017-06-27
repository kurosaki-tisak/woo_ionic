import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import * as WC from 'woocommerce-api';

@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})

export class ProductDetailsPage {

  product: any;
  WooCommerce: any;
  reviews: any[] =[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.product = this.navParams.get("product");
    console.log(this.product);

    this.WooCommerce = WC({
      url: "http://localhost/wordpress",
      consumerKey: "ck_58fd92828155fe9b78bfb07566a547623e9ec151",
      consumerSecret: "cs_1861ecfa42cf35cd9cc757032598c6d581498d07"
    });

    this.WooCommerce.getAsync('products/'+this.product.id + '/reviews').then((data) => {

        this.reviews = JSON.parse(data.body).product_reviews;
        console.log(this.reviews);
        
    }, (err) => {
      console.log(err)
    })

  }

}
