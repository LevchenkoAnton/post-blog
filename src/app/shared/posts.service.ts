import { Injectable } from '@angular/core';
import {FbCreateResponse, Post} from './interfaces';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class PostsService {
  constructor(
    private http: HttpClient
    ) { }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${environment.fbDbUrl}/${environment.postCollection}.json`)
      .pipe(
        map((response: {[key: string]: any}) => {
          return Object
            .keys(response)
            .map(key => ({
              ...response[key],
              id: key,
              date: new Date(response[key].date)
            }));
        })
      );
  }

  getById(id: string): Observable<Post> {
    return this.http.get(`${environment.fbDbUrl}/${environment.postCollection}/${id}.json`)
      .pipe(
        map((post: Post) => ({
          ...post,
          id,
          date: new Date(post.date)
        }))
      );
  }

  create(post: Post): Observable<Post> {
    return this.http.post(`${environment.fbDbUrl}/${environment.postCollection}.json`, post)
      .pipe(
        map((response: FbCreateResponse) => ({
          ...post,
          id: response.name,
          date: new Date(post.date)
        }))
      );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.fbDbUrl}/${environment.postCollection}/${id}.json`);
  }

  update(post: Post): Observable<Post> {
    return this.http.patch<Post>(`${environment.fbDbUrl}/${environment.postCollection}/${post.id}.json`, post);
  }
}
