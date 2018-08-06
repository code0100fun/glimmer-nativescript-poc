import 'regenerator-runtime/runtime';
import App, { document } from './main';
import { ComponentManager, setPropertyDidChange } from '@glimmer/component';
import nativeApplication from 'tns-core-modules/application';
import Router from './routes/router';

const app = new App();
const container = document.documentElement;
let root;

setPropertyDidChange(() => {
  app.scheduleRerender();
});

app.registerInitializer({
  initialize(registry) {
    registry.register(`component-manager:/${app.rootName}/component-managers/main`, ComponentManager);
  }
});

app.renderComponent('Application', container, null);

app.boot().then(() => {
  root = container.firstChild.nativeView;
  nativeApplication.run({ backstackVisible: false });
});

nativeApplication.on(nativeApplication.launchEvent, (args) => {
  args.root = root;
});
