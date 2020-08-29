import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { HttpserviceProvider } from '../../providers/httpservice/httpservice';
import { UtilityservicesProvider } from '../../providers/utilityservices/utilityservices';

/**
 * Generated class for the CartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpservice: HttpserviceProvider, private utilityservice: UtilityservicesProvider, private storage: Storage) {
  }

    ionViewDidLoad() {
        console.log('ionViewDidLoad CartPage');
    }


    ionViewDidEnter() {
        this.storage.get('last_cart').then((cart)=>{
            if(cart){
                this.Cart = cart;
            }
        }).catch((err)=>{
            this.utilityservice.presentToast(err.message,2);
        });

        //get user data for billing
        this.storage.get('wendy_userdata').then((userdata)=>{
            if(userdata){
                this.UserData = userdata;
            }
        }).catch((err)=>{
            this.utilityservice.presentToast(err.message,2);
        });

        console.log('ionViewDidLoad CartPage');
    }



    UserData: any = {
        "usersid": '',
        "usersname": '',
        "email": '',
        "mobile": '',
        "address": ''

    };

    OrderDetails: any = {
        "orderDeliveryDate": '00-00-2020',
        "orderDeliveryTime": '00:00',
        "orderDeliveryAddress": this.UserData.address,
        "orderNote": ''
    };

    PageTab = 'cart';
    Products: any = [{'id': 1,"title": ' ',"imageurl": '', "price": '0.00', "quantity": '0', "dateofpublication": '',
        "usersid": '',"usersname": '', "usersimageurl": ' '}];

    Cart: any = {
        'no_of_items': 0,
        "products": [{'id': '', "title": '', "imageurl": '', "price": 0, "quantity": 0, "dateofpublication": '',
            "usersid": '',"usersname": '', "usersimageurl": ''}]
    };

    private CartTotalCost: Number = 0;

    updateCartTotalCost(){
        let sum = 0;
        let cartlength = this.Cart.products.length;
        for(let i = 0; i<cartlength; i++){
            let product = this.Cart.products[i];
            sum += (product.quantity * product.price);
        }
        this.CartTotalCost = sum;
    }

    //@ViewChild(addtocartelement) Add_to_cart_element;
    //@ViewChild("addtocartelement") private Add_to_cart_element: ElementRef;

    incrementCart(product: any,incrementType: string){
        this.utilityservice.incrementCart(this.Cart,product,incrementType);
        this.updateCartTotalCost();
    }

    removeFromCart(product){
        this.Cart = this.utilityservice.removeFromCart(this.Cart,product);
        this.updateCartTotalCost();

    }

    emptyCart(){
        this.utilityservice.resetLocalCart();
        this.Cart = {
            'no_of_items': 0,
            "products": [{'id': '', "title": '', "imageurl": '', "price": 0, "quantity": 0, "dateofpublication": '',
                "usersid": '',"usersname": '', "usersimageurl": ''}]
        };
    }

}
