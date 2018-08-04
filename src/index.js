import 'regenerator-runtime/runtime';
import App, { document } from './main';
import { ComponentManager, setPropertyDidChange } from '@glimmer/component';
import nativeApplication from 'tns-core-modules/application';

const app = new App();

const container = document.createElement('native_proxy_container');
document.documentElement.appendChild(container);

setPropertyDidChange(() => {
  app.scheduleRerender();
});

app.registerInitializer({
  initialize(registry) {
    registry.register(`component-manager:/${app.rootName}/component-managers/main`, ComponentManager);
  }
});

let root;

app.renderComponent('Application', container, null);

app.boot().then(() => {
  root = container.firstChild.nativeView;
  nativeApplication.run();
});

nativeApplication.on(nativeApplication.launchEvent, (args) => {
  args.root = root;
});
