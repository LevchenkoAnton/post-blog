import { Pipe, PipeTransform } from '@angular/core';
import {Post} from '../../../shared/interfaces';

@Pipe({
  name: 'filterPost'
})
export class FilterPostPipe implements PipeTransform {

  transform(posts: Post[], filter: string): Post[] {
    if ( !filter.trim() ) {
      return posts;
    }

    return posts.filter(post => post.title.toLowerCase().includes(filter.toLowerCase()));
  }

}
