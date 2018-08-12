import Component, { tracked } from "@glimmer/component";
import injectServices from '../../../utils/inject-services';
import Router from '../../../services/router';
import { showDrawer, closeDrawer } from '../../../utils/side-drawer';

@injectServices('router')
export default class Application extends Component {
  router: Router;

  toggleMenu() {
    showDrawer();
  }

  transitionTo(url) {
    closeDrawer();
    this.router.transitionTo(url);
  }

  didInsertElement() {
    this.router.transitionTo('/home', {
      animated: true,
      clearHistory: true,
      transition: {
        name: "fade",
        duration: 250,
      },
    });
  }
}
