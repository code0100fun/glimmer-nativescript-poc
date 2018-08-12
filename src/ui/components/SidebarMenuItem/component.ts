import Component from "@glimmer/component";
import injectServices from '../../../utils/inject-services';
import Router from '../../../services/router';
import { closeDrawer } from '../../../utils/side-drawer';

@injectServices('router')
export default class Application extends Component {
  router: Router;

  transitionTo(url) {
    this.router.transitionTo(url);
    closeDrawer();
  }
}
