import Service from './-utils/service';
import { tracked } from '@glimmer/component';
import { getOwner } from '@glimmer/di';
import { topmost } from '../utils/frame';

export default class Router extends Service {

  get appRoutes() {
    return getOwner(this).lookup('route:router');
  }

  @tracked('_currentRoute')
  get currentURL() {
    return this._currentRoute.options.path;
  }

  @tracked('_currentRoute')
  get currentRouteName() {
    return this._currentRoute.name;
  }

  urlFor(routeName) {
    return this.appRoutes.urlFor(routeName);
  }

  replaceWith(routeNameOrUrl, options={}) {
    this.transitionTo(routeNameOrUrl, { backstackVisible: false, ...options});
  }

  transitionTo(routeNameOrUrl, options={}) {
    return this._buildTransitionTo(routeNameOrUrl, options).then((navigationEntry) => {
      if (navigationEntry) {
        return this._navigate(navigationEntry);
      }
    });
  }

  // Private

  async _buildTransitionTo(routeNameOrUrl, options={}) {
    const routes = this.appRoutes.recognize(routeNameOrUrl);
    if (routes && routes.length > 0) {
      const route = routes[0].handler;
      if (route.options.path !== this.currentURL) {
        const app = this._application;
        const container = app.document.createElement('native_proxy_container');
        app.renderComponent(route.options.component, container, null);
        await app._rerender();
        const meta = { route };
        const page = container.firstChild;
        page.nativeView.meta = meta;
        this._currentRouteMeta = meta;
        container.removeChild(page);
        return this._buildNavigationEntry(page.nativeView, options);
      }
    } else {
      return Promise.reject('Route not found');
    }
  }

  _buildNavigationEntry(page, options={}) {
    return {
      create: () => {
        return page;
      },
      animated: true,
      transition: {
        name: "slide",
        duration: 380,
        curve: "easeIn"
      },
      ...options,
    };
  }

  _navigate(navigationEntry) {
    this._frame.navigate(navigationEntry);
  }

  get _application() {
    return getOwner(this);
  }

  get _frame() {
    return topmost();
  }

  @tracked _currentRouteMeta = null;

  @tracked('_currentRouteMeta')
  get _currentRoute() {
    if (this._currentRouteMeta) {
      return this._currentRouteMeta.route;
    } else {
      return { name: 'application', options: { path: '/', component: 'Application' } };
    }
  }

}
