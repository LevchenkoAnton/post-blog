import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostsService} from '../../shared/posts.service';
import {Post} from '../../shared/interfaces';
import {Subscription} from 'rxjs';
import {AlertService} from '../shared/services/alert.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  searchField = '';
  pSub: Subscription;
  dSub: Subscription;

  constructor(
    private postsService: PostsService,
    private alert: AlertService
    ) { }

  ngOnInit() {
    this.pSub = this.postsService.getPosts().subscribe((posts: Post[]) => {
      this.posts = posts;
    });
  }

  ngOnDestroy(): void {
    if (this.pSub) {
      this.pSub.unsubscribe();
    }

    if (this.dSub) {
      this.dSub.unsubscribe();
    }
  }

  deletePost(id: string) {
    this.dSub = this.postsService.delete(id).subscribe(() => {
      this.posts = this.posts.filter(post => {
        return post.id !== id;
      });
      this.alert.danger('Post deleted');
    });
  }
}
