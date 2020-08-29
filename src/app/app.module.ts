import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';

import { TextToSpeech } from '@ionic-native/text-to-speech';
import { NativeAudio } from '@ionic-native/native-audio';

import { MyApp } from './app.component';
import { WelcomePage } from '../pages/welcome/welcome';
import { HttpserviceProvider } from '../providers/httpservice/httpservice';
import { UtilityservicesProvider } from '../providers/utilityservices/utilityservices';

@NgModule({
  declarations: [
    MyApp,
    WelcomePage
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WelcomePage
  ],
  providers: [
    TextToSpeech,
    NativeAudio,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HttpserviceProvider,
    UtilityservicesProvider
  ]
})
export class AppModule {}
