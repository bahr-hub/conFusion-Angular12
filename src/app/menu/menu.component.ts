import { Component, OnInit, Inject  } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../Services/dish.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {


   dishes!: Dish[] ;
   selectedDish!: Dish;
   errMess!: string ;

  // selectedDish: Dish = DISHES[0];

  constructor(private dishService: DishService,
              @Inject('BaseURL') public BaseURL) { }

  ngOnInit() {
    this.dishService.getDishes()
      .subscribe(dishes => this.dishes = dishes,
      errmess => this.errMess = <any>errmess);
  }

}
