import { NgModule } from '@angular/core';
import { environment } from '../../environments/environment';
import * as firebase from 'firebase';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';


@NgModule({
  imports: [
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.firebase)
  ]
})
export class FirebaseModule {
  constructor() {
    firebase.database.enableLogging((logMessage) => {
      // Add a timestamp to the messages.
      console.log(new Date().toISOString() + ': ' + logMessage);
    });
  }
}
