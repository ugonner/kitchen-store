import { Component, ViewChild, ElementRef } from '@angular/core';
import { Platform,IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpserviceProvider } from '../../providers/httpservice/httpservice';
import { UtilityservicesProvider } from '../../providers/utilityservices/utilityservices';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpservice: HttpserviceProvider, private utilityservice: UtilityservicesProvider,
              private platform: Platform, private storage: Storage) {
  }

    pageTab: string = 'userdata';
    ionViewDidLoad() {
        console.log('ionViewDidLoad ProfilePage');
    }
    ionViewDidEnter() {
        //first set userdata from local storage, if there's network it will be replaced from server data

        this.storage.get('wendy_userdata').then((userdata)=>{
            if(userdata){
                this.UserData = userdata;
                //alert(JSON.stringify(this.UserData));
            }
        }).catch((storageerr)=>{
            this.utilityservice.presentToast("unable to fetch user data "+storageerr.message,2);
        })

        let userid = this.navParams.get('userid');
        //alert('userid'+ userid)
        //if((userid)){

            this.httpservice.getStuff('/admin/user/userprofile/'+userid).subscribe((data)=>{

                if(data.success == true){

                    //if(data.user == undefined){

                        //alert(JSON.stringify(data));

                    //}else{

                        this.UserData = data.user;
                    //}
                }else{
                    this.utilityservice.presentToast(data.message,2);
                }
            },(err)=>{
                //alert(JSON.stringify(err));
                this.utilityservice.presentToast(err.message,2);
            })

        //}
//first set orderdata from local storage, if there's network it will be replaced from server data

        this.storage.get('wendy_orders').then((orders)=>{
            if(orders){
                this.Orders = orders;
            }
        }).catch((storageerr)=>{
            this.utilityservice.presentToast("unable to get orders data "+storageerr.message,2);
        })

        //let userid = this.navParams.get('userid');
        if(!(userid == 'undefined')){

            this.httpservice.getStuff('/admin/cart/getcarts/ui/'+userid).subscribe((data)=>{
                if(data.success == true){
                    let ordersdata = data.carts.data; //carts.data due to pagination
                    if((ordersdata.length <= 0)){
                        alert('orders is empty');
                    }else{

                        this.Orders = ordersdata;
                        alert(JSON.stringify(data));
                    }
                }else{
                    //alert(JSON.stringify(data));
                    this.utilityservice.presentToast(data.message,2);
                }
            },(err)=>{
                this.utilityservice.presentToast(err.message,2);
            })
        }


        //alert(JSON.stringify(this.UserData));
        console.log('ionViewDidLoad ProfilePage');
    }



    showPasswordField: boolean = false;

    MenuItems: any={
        "carttypes":[{'id':1,"name": 'Door Delivery YES'}, {"id":2,"name": 'real'}],
        "cartcategories": [{'id':1,"name": 'Instant Delivery YES'}, {"id":2,"name": 'real'}],
        "productcategories": []
    }

    UserData: any = {
        "usersid": '',
        "usersname": '',
        "password": '',
        "email": '',
        "imageurl": '',
        "mobile": '',
        "address": '',
        "rolename": '',
        "rolenote": '',
        "positionname":'',
        "about": ''

    };

    Orders: Array<any> = [{
        "orderdate": '00-00-2020',
        "ordertime": '00:00',
        "orderaddress": '',
        "orderamount": '0.00',
        "orderote": '',
        "cartcategoryid": 1,
        "cartcategoryname": '',
        "carttypeid": 1,
        "carttypename": '',
        "orderref": 1,
        "status": '',
        "statusnote": '',
        "dateofpublication": ''
    }];

    PageTab = 'cart';
    Products: any = [{'id': 1,"title": ' ',"imageurl": '', "price": '0.00', "quantity": '0', "dateofpublication": '',
        "usersid": '',"usersname": '', "usersimageurl": ' '}];

    Cart: any = {
        'no_of_items': 0,
        "products": [{'id': '', "title": '', "imageurl": '', "price": 0, "quantity": 0, "dateofpublication": '',
            "usersid": '',"usersname": '', "usersimageurl": ''}]
    };




    errorMessageBag: string;
    editUserData(){
        //if showpassword shows user is not registered or logged in
        if(this.showPasswordField){
            let postdata = {
                logFromApp: true,
                email: this.UserData.email,
                password: this.UserData.password,
                name: this.UserData.usersname,
                mobile: this.UserData.mobile,
                address: this.UserData.address

            }
            this.httpservice.postStuff('/admin/user/registration',postdata).subscribe((data)=>{
                if(data.results == 0){
                    this.utilityservice.presentToast("fetched fetched",2);
                    //make call to paystack pop
                }else{
                    //
                    this.UserData.usersid = data.userid;
                    //store user in storage
                    this.storage.set('wendy_userdata',this.UserData).then((storeduserdata)=>{
                        this.utilityservice.presentToast('Stored user data',2);
                    }).catch((err)=>{
                        this.utilityservice.presentToast('Error Storing user data',2);
                    });
                }


            },(err)=>{
                //let errMsgArray = err.errors;
                this.errorMessageBag = (JSON.stringify(err.error.errors));
                this.utilityservice.presentToast(err.message,2);
            });
        }
    }

    @ViewChild('userprofilepicfile') pic22: ElementRef;
    DisplaySpinner: Boolean;
    editUserProfilePic(){
        try{

            //this.utilityservice.presentToast("change worked",10000);
            this.platform.ready().then((pltready)=>{
                //let newImageFile  = <HTMLInputElement>document.forms['imageForm']['userprofilepic'];

                //get and display selected image as a dataurl;
                let reader = new FileReader();
                reader.readAsDataURL(this.pic22.nativeElement.files[0]);
                //reader.readAsDataURL(newImageFile.files[0]);
                //reader.readAsDataURL(value);

                reader.onload = ()=>{
                    let newImageFile = reader.result;
                    this.UserData.imageurl = newImageFile;
                };

                //diaplay spinner;
                this.DisplaySpinner = true;

                //create formdata object;
                let form = document.forms.namedItem("imageForm");
                let formdata = new FormData(form);

                //create ajax call to send data;
                let xhttp = new XMLHttpRequest();
                xhttp.open("post", this.httpservice.hostdomain+"/api/user/userprofilepic/index.php",true);
                //on success trip to server;
                xhttp.onload= ()=>{
                    if(xhttp.status == 200){
                        this.DisplaySpinner = false;
                        this.utilityservice.presentToast(xhttp.responseText,5000);
                        this.utilityservice.presentToast( xhttp.responseText+" GOT SEERVER ",5000);
                    }else{
                        this.DisplaySpinner = false;
                        this.utilityservice.presentToast( "Bad Connection",3000);
                    }
                };
                xhttp.send(formdata);
            }).catch((plterr)=>{
                this.utilityservice.presentToast(plterr+' platform error',15000);
            });

        }catch(err){
            this.utilityservice.presentToast( err+' try\'s catch error', 5000);
        }
    }


}
