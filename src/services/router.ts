import Service from './-utils/service';
import { tracked } from '@glimmer/component';
import { getOwner } from '@glimmer/di';
import { Simple } from '@glimmer/interfaces';
import { topmost } from '../utils/frame';
import ElementNode from '../utils/element-node';

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
        const container = this._document.createElement('native_proxy_container');
        this._renderComponent(route.options.component, container);
        await this._rerender();
        const meta = { route };
        const page = container.firstChild as ElementNode;
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

  protected get _document() {
    // @ts-ignore
    return this._application.document as Simple.Document;
  }

  protected _renderComponent(component: string, container: Simple.Element) {
    // @ts-ignore
    return this._application.renderComponent(component, container, null);
  }

  protected async _rerender() {
    // @ts-ignore
    await this._application._rerender();
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
