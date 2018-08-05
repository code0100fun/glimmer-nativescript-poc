import Component, { tracked } from "@glimmer/component";
import * as app from "application";

export default class Home extends Component {
  toggleMenu() {
    let sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
  }
}
