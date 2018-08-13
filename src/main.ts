import Application, { DOMBuilder, RuntimeCompilerLoader, SyncRenderer } from '@glimmer/application';
import Resolver, { BasicModuleRegistry } from '@glimmer/resolver';
import moduleMap from '../config/module-map';
import resolverConfiguration from '../config/resolver-configuration';
import DocumentNode from './utils/document-node';
import { Simple } from '@glimmer/interfaces';

const documentNode = new DocumentNode();
export const document = documentNode as Simple.Document;
export const appContainer = documentNode.documentElement;

export default class App extends Application {
  constructor() {
    let moduleRegistry = new BasicModuleRegistry(moduleMap);
    let resolver = new Resolver(resolverConfiguration, moduleRegistry);

    super({
      document: document,
      builder: new DOMBuilder({ element: appContainer, nextSibling: null }),
      loader: new RuntimeCompilerLoader(resolver),
      renderer: new SyncRenderer(),
      rootName: resolverConfiguration.app.rootName,
      resolver
    });
  }
}

// @ts-ignore
const didError = Application.prototype._didError;
// @ts-ignore
Application.prototype._didError = function _customDidError(err) {
  console.trace(err);
  return didError.apply(this, arguments);
};
