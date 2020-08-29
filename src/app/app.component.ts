import { Component,OnInit,  ViewChild } from '@angular/core';
import { Platform,Nav, MenuController, AlertController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { HttpserviceProvider } from '../providers/httpservice/httpservice';
import { UtilityservicesProvider } from '../providers/utilityservices/utilityservices';


import { WelcomePage } from '../pages/welcome/welcome';
@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit{
  rootPage:any = WelcomePage;
    @ViewChild("nav1") public nav: Nav;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private httpservice: HttpserviceProvider,
              private storage: Storage, private utilityservice: UtilityservicesProvider, public menuCtrl: MenuController,
              private alertCtrl: AlertController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

    });
  }


    /*ionViewDidLoad() {
        console.log('ionViewDidLoad WelcomePage');
    }*/
    private Law: Array<any>;
    private LangCode: any;

    ngOnInit() {

        //this.updateLangCode();

        //check for locally stored law
        this.storage.get("law")
            .then((law)=>{
                if(law){
                    this.Law = law.sections;
                    //alert(law.sections[0].title);
                }else{
                    //if no law was fetched
                    //this.loadLaw();
                }
            }).catch((err)=>{
                this.utilityservice.presentToast("storage error: unable to fetch the law "+err.message,1);
            });


        console.log('ionViewDidLoad WelcomePage');
    }

    pushPage(page){
        this.menuCtrl.getOpen().close();
        this.nav.push(page);
        this.utilityservice.playSound(1);
    }


    pushPageWithParameters(PageString: String , Params: any){
        this.menuCtrl.getOpen().close();

        this.nav.push(PageString,Params);
        this.utilityservice.playSound(2);
    }

    goHome(){
        this.utilityservice.playSound(1);
        this.menuCtrl.getOpen().close();
        this.nav.setRoot(WelcomePage);


    }

}

