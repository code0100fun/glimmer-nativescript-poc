import { getRootView } from 'tns-core-modules/application';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';

export function showDrawer() {
  let sideDrawer = getRootView() as RadSideDrawer;
  sideDrawer.showDrawer();
}

export function closeDrawer() {
  let sideDrawer = getRootView() as RadSideDrawer;
  sideDrawer.closeDrawer();
}
