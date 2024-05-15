import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {

  constructor(
    private authService : AuthService,
    private router: Router
  ){}

  onLogin() :void{
    this.authService.login('sergio@gmail.com','1234')
      .subscribe(user => {
        this.router.navigate(['/heroes/list']);
      })

  }
}
