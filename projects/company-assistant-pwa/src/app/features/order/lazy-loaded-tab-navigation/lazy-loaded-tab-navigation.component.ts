import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { tabs } from './TabData';
import { ITabItem } from './ITabItem';

@Component({
  selector: 'app-lazy-loaded-tab-navigation',
  templateUrl: './lazy-loaded-tab-navigation.component.html',
  styleUrls: ['./lazy-loaded-tab-navigation.component.scss']
})
export class LazyLoadedTabNavigationComponent implements OnInit {
  public paramOrderId;
  public tabs: ITabItem[] = tabs;
  public tabsWithRoutes = [];
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.paramOrderId = params['id'];

      // ToDo: in config fuer enable / disable feature
      tabs.forEach((tab) => {
        switch (tab.feature) {
          case 'workingHours': {
            this.tabsWithRoutes.push({
              label: tab.label,
              icon: tab.icon,
              route: '/orders/' + this.paramOrderId + '/working-hours'
            });
            break;
          }
          case 'materials': {
            this.tabsWithRoutes.push({
              label: tab.label,
              icon: tab.icon,
              route: '/orders/' + this.paramOrderId + '/material'
            });
            break;
          }
          case 'notes': {
            this.tabsWithRoutes.push({
              label: tab.label,
              icon: tab.icon,
              route: '/orders/' + this.paramOrderId + '/notes'
            });
            break;
          }
        }
      });
    });
  }
}
