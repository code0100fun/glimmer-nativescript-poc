import Component, { tracked } from "@glimmer/component";
import injectServices from '../../../utils/inject-services';
import Router from '../../../services/router';
import { showDrawer } from '../../../utils/side-drawer';

@injectServices('router')
export default class Application extends Component {
  router: Router;

  showDrawer() {
    showDrawer();
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
