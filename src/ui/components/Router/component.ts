import Component, { tracked } from "@glimmer/component";
import { showDrawer } from '../../../utils/side-drawer';

export default class Router extends Component {
  toggleMenu() {
    showDrawer();
  }
}
