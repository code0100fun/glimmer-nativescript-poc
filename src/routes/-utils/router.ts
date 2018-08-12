import RouteRecognizer from 'route-recognizer';

const _routes = [];

export default class Router {
  static get routes() { return _routes; }

  static map(callback) {
    callback.apply(Router);
  }

  static route(name, options) {
    this.routes.push({ name, options });
  }

  static create(options) {
    return new this(options);
  }

  constructor(options) {
    Object.assign(this, options);
    this._routeRecognizer = new RouteRecognizer();
    this.routes.forEach((route) => {
      this._routeRecognizer.add([{
        path: route.options.path,
        handler: route,
      }])
    });
  }

  get routes() { return _routes; }

  urlFor(routeName) {
    this.routes.filterBy('name', routeName)[0].options.path;
  }

  recognize(routeNameOrUrl) {
    return this._routeRecognizer.recognize(routeNameOrUrl);
  }
}
