import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import { User } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';


@Injectable()
export class AuthService {
  authenticated$: Observable<boolean>;
  uid$: Observable<string>;

  constructor(public afAuth: AngularFireAuth) {
    this.authenticated$ = afAuth.authState.pipe(map(user => !!user));
    this.uid$ = afAuth.authState.pipe(map((user: User) => user.uid));
  }

  signIn(provider: firebase.auth.AuthProvider): Promise<any> {
    return this.afAuth.auth.signInWithPopup(provider)
      .catch(error => console.log('ERROR @ AuthService#signIn() :', error));
  }

  signInAnonymously(): Promise<any> {
    return this.afAuth.auth.signInAnonymously()
      .catch(error => console.log('ERROR @ AuthService#signInAnonymously() :', error));
  }

  signInWithGithub(): Promise<any> {
    return this.signIn(new firebase.auth.GithubAuthProvider());
  }

  signInWithGoogle(): Promise<any> {
    return this.signIn(new firebase.auth.GoogleAuthProvider());
  }

  signInWithTwitter(): Promise<any> {
    return this.signIn(new firebase.auth.TwitterAuthProvider());
  }

  signInWithFacebook(): Promise<any> {
    return this.signIn(new firebase.auth.FacebookAuthProvider());
  }

  signOut(): void {
    this.afAuth.auth.signOut();
  }
}
