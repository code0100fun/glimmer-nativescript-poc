import * as app from "application";

export function showDrawer() {
  let sideDrawer = app.getRootView();
  sideDrawer.showDrawer();
}

export function closeDrawer() {
  let sideDrawer = app.getRootView();
  sideDrawer.closeDrawer();
}
