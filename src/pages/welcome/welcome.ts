import { Component, ViewChild } from '@angular/core';
//import { Animation, createAnimation } from '@ionic/core'
import { Platform,IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpserviceProvider } from '../../providers/httpservice/httpservice';
import { UtilityservicesProvider } from '../../providers/utilityservices/utilityservices';
//import { NativeAudio } from '@ionic-native/native-audio';
//import { gsap } from "gsap";

/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

    private Law: Array<any>;
  constructor(public platform: Platform,public navCtrl: NavController, public navParams: NavParams, private utilityservice: UtilityservicesProvider, private httpservice: HttpserviceProvider,public storage: Storage) {

  }

    ionViewDidEnter(){
        this.getProducts();
        //set this law from locally stored last-cart

        this.storage.get('last_cart').then((cart)=>{
            if(cart){
                this.Cart = cart;
            }
        }).catch((err)=>{
            this.presentToast(err.message,2);
        });
    }

    Products: any = [{'id': 1,"title": ' ',"imageurl": '', "price": '0.00', "quantity": '0', "dateofpublication": '',
        "usersid": '',"usersname": '', "usersimageurl": ' '}];

    Cart: any = {
        'no_of_items': 0,
        "products": [{'id': '', "title": '', "imageurl": '', "price": 0, "quantity": 0, "dateofpublication": '',
            "usersid": '',"usersname": '', "usersimageurl": ''}]
    };
    

    //@ViewChild(addtocartelement) Add_to_cart_element;
    //@ViewChild("addtocartelement") private Add_to_cart_element: ElementRef;

    incrementCart(product: any,incrementType: string){
        this.utilityservice.incrementCart(this.Cart,product,incrementType);
    }

    getProducts(){
        this.httpservice.getStuff("/admin/product/getproducts").subscribe((data)=>{
            this.Products = data.products.data;
            this.Products.map((product)=>{
                return product.quantity = 0;
            });
            this.utilityservice.presentToast(data.products.data[0].title,1);
        },(err)=>{
            this.utilityservice.presentToast(err.message,1);
        })
    }



    pushPageWithParameters(PageString , Params: any){
        /*this.nativeAudio.play("id1").then((played)=>{
            console.log("played");
        },(err)=>{
            this.utilityservice.presentToast(err,1);
        });*/
        //this.utilityservice.playSound(2);
        this.navCtrl.push(PageString,Params);
    }

    pushPage(page){
        this.navCtrl.push(page);
    }


}
