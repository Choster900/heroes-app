import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { filter, switchMap } from 'rxjs';

import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  })

  constructor(
    private heroService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return;

    this.activatedRoute.params
      .pipe(
        /* delay(2000), */
        switchMap(({ id }) => this.heroService.getHeroById(id))
      )
      .subscribe(hero => {

        if (!hero) return this.router.navigate(['/heroes/list']);


        this.heroForm.reset(hero);

        return;
      })

  }

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  public publisherJson = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' },
  ]

  onSubmit(): void {

    if (!this.heroForm.valid) return;

    if (this.heroForm.value.id) {
      this.heroService.updateHero(this.currentHero)
        .subscribe(hero => {
          this.showSnackbar(`${hero.superhero} updated!`);
        });

      return
    }

    this.heroService.addHero(this.currentHero)
      .subscribe(hero => {
        this.router.navigate([' heroes/edit', hero.id]);
        this.showSnackbar(`${hero.superhero} created!`);

      });

  }

  onDeleteHero(): void {
    if (!this.currentHero.id) throw Error("Hero is required")

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.currentHero,
    });

    dialogRef.afterClosed()
      .pipe(
        filter((result: boolean) => result),
        switchMap(() => this.heroService.deleteteHeroById(this.currentHero.id)),
        filter((wasDeleted: boolean) => wasDeleted)
      )
      .subscribe(() => {
        this.router.navigate(['heroes/list']);
      });



    /*  dialogRef.afterClosed().subscribe(result => {
       if (!result) return;
       this.heroService.deleteteHeroById(this.currentHero.id)
         .subscribe(wasDeleted => {
           if (wasDeleted)
             this.router.navigate(['heroes/list']);
         });
     }); */

  }

  showSnackbar(message: string): void {
    this.snackbar.open(message, 'done', {
      duration: 3000
    })
  }
}
