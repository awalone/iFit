// App
import { Component } from '@angular/core';
import { ActionSheetController, AlertController, IonicPageMetadata, InfiniteScroll, Loading, LoadingController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

// Models
import { Food } from '../../models';

// Pages
import { FoodDetailsPage } from '../food-details/food-details';

// Providers
import { FOOD_GROUPS, FoodService } from '../../providers';

@Component({
  selector: 'page-food-list',
  templateUrl: 'food-list.html'
})
export class FoodListPage {
  private _dismissedLoader: boolean = false;
  private _foodSubscription: Subscription;
  private _loader: Loading;
  private _nutrients: Array<{ key: string, name: string }>;
  public detailsPage: IonicPageMetadata = FoodDetailsPage;
  public foods: Array<Food>;
  public limit: number = 50;
  public searchQuery: string = '';
  public selectedGroup: string = FOOD_GROUPS[0];
  public selectedNutrient = '';
  constructor(
    private _actionSheetCtrl: ActionSheetController,
    private _alertCtrl: AlertController,
    private _foodSvc: FoodService,
    private _loadCtrl: LoadingController
  ) {
    let food: Food = new Food();
    this._nutrients = Object.keys(food.nutrition).map((nutrientKey: string) => {
      return {
        key: nutrientKey,
        name: food.nutrition[nutrientKey].name
      }
    })
  }

  private _selectGroup(): void {
    this._alertCtrl.create({
      title: 'Filter by groups',
      subTitle: 'Pick a food group',
      inputs: [...FOOD_GROUPS.map((group: string) => {
        return {
          type: 'radio',
          label: group,
          value: group,
          checked: this.selectedGroup === group
        }
      })],
      buttons: [
        {
          text: 'Done',
          handler: (data: string) => {
            this.selectedGroup = data;
            this.selectedNutrient = '';
            this._dismissedLoader = false;
            this._foodSvc.changeFoodGroup(this.selectedGroup);
            this._loader = this._loadCtrl.create({
              content: 'Loading...',
              spinner: 'crescent'
            });
            this._loader.present();
            setTimeout(() => {
              if (!this._dismissedLoader) {
                this._loader.dismiss();
              }
            }, 30000);
          }
        }
      ]
    }).present();
  }

  private _selectNutrient(): void {
    this._alertCtrl.create({
      title: 'Filter by nutrients',
      subTitle: 'Pick a nutrient',
      inputs: [...this._nutrients.map((nutrient: { key: string, name: string }) => {
        return {
          type: 'radio',
          label: nutrient.name,
          value: nutrient.key,
          checked: this.selectedNutrient === `nutrition.${nutrient.key}.value`
        }
      })],
      buttons: [
        {
          text: 'Done',
          handler: (data: string) => {
            this.selectedNutrient = `nutrition.${data}.value`;
          }
        }
      ]
    }).present();
  }

  public clearSearch(ev): void {
    this.searchQuery = '';
  }

  public loadMore(ev: InfiniteScroll) {
    this.limit += 50;
    setTimeout(() => {
      ev.complete();
    }, 1000);
  }

  public showFilter(): void {
    this._actionSheetCtrl.create({
      title: 'Change ingredient',
      buttons: [
        {
          text: 'Change food group',
          handler: () => {
            this._selectGroup();
          }
        }, {
          text: 'Sort by nutrients',
          handler: () => {
            this._selectNutrient();
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).present();
  }

  ionViewWillLoad(): void {
    this._loader = this._loadCtrl.create({
      content: 'Loading...',
      spinner: 'crescent'
    });
    this._loader.present();
    setTimeout(() => {
      if (!this._dismissedLoader) {
        this._loader.dismiss();
      }
    }, 30000);
    this._foodSubscription = this._foodSvc.getFoods$(this.selectedGroup).subscribe((data: Array<Food>) => {
      this.foods = [...data];
      if (!this._dismissedLoader) {
        this._loader.dismiss();
      }
    }, (err: { status: string, message: string }) => {
      if (!this._dismissedLoader) {
        this._loader.dismiss();
      }
      this._alertCtrl.create({
        title: 'Uhh ohh...',
        subTitle: 'Something went wrong',
        message: `Error ${err.status}! ${err.message}`,
        buttons: ['OK']
      }).present();
    });
    this._loader.onDidDismiss(() => this._dismissedLoader = true);
  }

  ionViewWillLeave(): void {
    this._foodSubscription.unsubscribe();
  }
}