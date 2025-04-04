import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { FavouriteLabComponent } from "../favourite-lab/favourite-lab.component";
import { FavouritePharmacyComponent } from "../favourite-pharmacy/favourite-pharmacy.component";
import { FavouriteProviderComponent } from "../favourite-provider/favourite-provider.component";
import { FavouriteRadiologyComponent } from "../favourite-radiology/favourite-radiology.component";

@Component({
  selector: "app-favorite",
  templateUrl: "./favorite.component.html",
  styleUrls: ["./favorite.component.css"],
})
export class FavoriteComponent implements OnInit {
  @ViewChild("tabContent", { read: ViewContainerRef })
  private tabContent!: ViewContainerRef;

  favoriteTabs: any;
  selectedIndex: number = 0;

  constructor(private cfr: ComponentFactoryResolver) {
    this.favoriteTabs = [
      { TabName: "Favourite Provider", Component: FavouriteProviderComponent },
      { TabName: "Favourite Pharmacy", Component: FavouritePharmacyComponent },
      { TabName: "Favourite Lab", Component: FavouriteLabComponent },
      { TabName: "Favourite Radiology", Component: FavouriteRadiologyComponent }
    ];
  }

  ngOnInit() {
    this.loadChild("Favourite Provider");
  }
  loadComponent(eventType: any): any {
    console.log(eventType);
    this.loadChild(eventType.tab.textLabel);
  }
  loadChild(childName: string) {
    let factory: any;
    factory = this.cfr.resolveComponentFactory(
      this.favoriteTabs.find((x:any) => x.TabName == childName).Component
    );
    this.tabContent.clear();
    let comp: ComponentRef<FavouriteProviderComponent> =
      this.tabContent.createComponent(factory);
  }
  handleTabChange(data: any): any {
    this.selectedIndex = this.favoriteTabs.findIndex(
      (s:any) => s.TabName == data.tab
    );

    this.loadChild(data.tab);
  }
}
