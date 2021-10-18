import { Component, Inject, OnInit } from '@angular/core';

import { Dish } from '../shared/dish';
import { DishService } from '../Services/dish.service'; 
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../Services/promotion.service'; 
import { Leader } from '../shared/leader';
import { LeaderService } from '../Services/leader.service'; 



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dish!: Dish;
  promotion!: Promotion;
  leader!: Leader;
  dishErrMess!: string;

  constructor(private dishservice: DishService,
    private promotionservice: PromotionService,
    @Inject('BaseURL') public BaseURL,
    private leaderservice: LeaderService) { }

  ngOnInit() {
    this.dishservice.getFeaturedDish()
    .subscribe(dish => this.dish = dish,
      errmess => this.dishErrMess = <any>errmess);
    this.promotionservice.getFeaturedPromotion()
    .subscribe(promotion => this.promotion = promotion);
    this.leaderservice.getFeaturedLeader()
    .subscribe(leader => this.leader = leader);
  }

}
