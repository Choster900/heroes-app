import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { Hero } from '../interfaces/hero.interface';
import { environments } from '../../../environments/environments';

@Injectable({ providedIn: 'root' })
export class HeroesService {

  private baseUrl: string = environments.baseUrl;

  constructor(private http: HttpClient) { }

  // Obtener todos los heroes
  getHeroes(): Observable<Hero[]> {

    return this.http.get<Hero[]>(`${this.baseUrl}/heroes`);

  }

  // Obtener heroes por id

  getHeroById(id: string): Observable<Hero | undefined> {
    return this.http.get<Hero>(`${this.baseUrl}/heroes/${id}`)
      .pipe(
        catchError(error => of(undefined))
      );
  }

  // AutoComplete

  getSuggestions(query: string): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes?q=${query}&_limit=6`)
  }

  // agregara hero
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(`${this.baseUrl}/heroes`, hero);
  }

  // actualizar hero
  updateHero(hero: Hero): Observable<Hero> {
    if (!hero.id) throw Error("Invalid hero id");

    return this.http.patch<Hero>(`${this.baseUrl}/heroes/${hero.id}`, hero);
  }

  // delete hero
  deleteteHeroById(id:string): Observable<boolean> {
    if (!id) throw Error("Invalid hero id");

    return this.http.delete<Hero>(`${this.baseUrl}/heroes/${id}`)
      .pipe( // El pipe es como manejar lo que se va hacer con la respuesta.
        map( resp => true),
        catchError( err => of(false) ),
      )
  }
}
