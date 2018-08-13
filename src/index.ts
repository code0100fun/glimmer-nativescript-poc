import 'regenerator-runtime/runtime';
import App, { appContainer } from './main';
import { ComponentManager, setPropertyDidChange } from '@glimmer/component';
import { run, on, launchEvent } from 'tns-core-modules/application';
import { View } from 'tns-core-modules/ui/core/view';
import ElementNode from './utils/element-node';

const app = new App();
let root: View;

setPropertyDidChange(() => {
  app.scheduleRerender();
});

app.registerInitializer({
  initialize(registry) {
    registry.register(`component-manager:/${app.rootName}/component-managers/main`, ComponentManager);
  }
});

app.renderComponent('Application', appContainer, null);

app.boot().then(() => {
  root = (appContainer.firstChild as ElementNode).nativeView;
  run({ backstackVisible: false });
});

on(launchEvent, (args) => {
  args.root = root;
});
