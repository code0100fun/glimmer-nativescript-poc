import Component, { tracked } from '@glimmer/component';
import { showDrawer } from '../../../utils/side-drawer';

export default class Home extends Component {
  toggleMenu() {
    showDrawer();
  }
}
