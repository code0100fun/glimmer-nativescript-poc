import 'regenerator-runtime/runtime';
import App, { document } from './main';
import { ComponentManager, setPropertyDidChange } from '@glimmer/component';
import nativeApplication from 'tns-core-modules/application';

const app = new App();

const container = document.createElement('Frame');
document.documentElement.appendChild(container);

setPropertyDidChange(() => {
  app.scheduleRerender();
});

app.registerInitializer({
  initialize(registry) {
    registry.register(`component-manager:/${app.rootName}/component-managers/main`, ComponentManager);
  }
});

nativeApplication.on(nativeApplication.launchEvent, (args) => {
  app.renderComponent('x-home', container, null);
  app.boot();
  args.root = container.nativeView;
});

nativeApplication.run();
