import { View } from 'tns-core-modules/ui/core/view';

const elementMap = new Map<string, { resolver: ViewResolver, meta?: ViewClassMeta }>();

export interface ViewClass {
  new (): View;
}

export type ViewResolver = () => ViewClass;

export interface ViewClassMeta {
  skipAddToDom?: boolean;
  insertChild?: (parent: any, child: any, next?: any) => void;
  removeChild?: (parent: any, child: any) => void;
}

const defaultViewMeta: ViewClassMeta = { skipAddToDom: false };

export function normalizeElementName(elementName) {
  return elementName && elementName.toLowerCase();
}

function getElement(elementName) {
  return elementMap.get(normalizeElementName(elementName));
}

function hasElement(elementName) {
  return elementMap.has(normalizeElementName(elementName));
}

function setElement(elementName, entry) {
  return elementMap.set(normalizeElementName(elementName), entry);
}

export function registerElement(
  elementName: string,
  resolver: ViewResolver,
  meta?: ViewClassMeta) {

  meta = Object.assign({}, defaultViewMeta, meta);

  if (hasElement(elementName)) {
    throw new Error(`Element for ${elementName} already registered.`);
  }

  const entry = { resolver: resolver, meta: meta };
  setElement(elementName, entry)
}

export function getViewClass(elementName) {
  const entry = getElement(elementName);

  if (!entry) {
    throw new TypeError(`No known component for element ${elementName}.`);
  }

  try {
    return entry.resolver();
  } catch (e) {
    throw new TypeError(`Could not load view for: ${elementName}. ${e}`);
  }
}

export function getViewMeta(elementName) {
  const entry = getElement(elementName);

  if (entry) {
    return entry.meta;
  }
}

export function isKnownView(elementName) {
  return hasElement(elementName);
}

registerElement(
  'div',
  () => require('tns-core-modules/ui/proxy-view-container').ProxyViewContainer,
  {
    skipAddToDom: true
  }
);

registerElement(
  'a',
  () => require('tns-core-modules/ui/proxy-view-container').ProxyViewContainer,
  {
    skipAddToDom: true
  }
);

registerElement(
  '#document',
  () => require('tns-core-modules/ui/proxy-view-container').ProxyViewContainer,
  {
    skipAddToDom: true
  }
);

registerElement(
  'Document',
  () => require('tns-core-modules/ui/proxy-view-container').ProxyViewContainer,
  {
    skipAddToDom: true
  }
);

registerElement(
  'native_proxy_container',
  () => require('tns-core-modules/ui/proxy-view-container').ProxyViewContainer,
);

registerElement(
  '#comment',
  () => require('tns-core-modules/ui/placeholder').Placeholder
);

registerElement(
  'native_label',
  () => require('tns-core-modules/ui/label').Label
);

registerElement(
  'native_text_view',
  () => require('tns-core-modules/ui/text-view').TextView
);

registerElement(
  'native_page',
  () => require('tns-core-modules/ui/page').Page,
);

registerElement(
  'native_stack_layout',
  () =>  require('tns-core-modules/ui/layouts/stack-layout').StackLayout
);

registerElement(
  'native_grid_layout',
  () => require('tns-core-modules/ui/layouts/grid-layout').GridLayout
);

registerElement(
  'FlexboxLayout',
  () => require('tns-core-modules/ui/layouts/flexbox-layout').FlexboxLayout
);

registerElement(
  'native_frame',
  () => require('tns-core-modules/ui/frame').Frame,
  {
    insertChild(parentNode, childNode, atIndex) {
      if (normalizeElementName(childNode.tagName) === 'native_page') {
        parentNode.nativeView.navigate({ create: () => childNode.nativeView })
      }
    }
  }
);

registerElement(
  'native_action_bar',
  () => require('tns-core-modules/ui/action-bar').ActionBar
);

registerElement(
  'native_navigation_button',
  () => require('tns-core-modules/ui/action-bar').NavigationButton
);

registerElement(
  'native_scroll_view',
  () => require('tns-core-modules/ui/scroll-view').ScrollView
);

registerElement(
  'native_rad_side_drawer',
  () => require('nativescript-ui-sidedrawer').RadSideDrawer,
  {
    insertChild(parentNode, childNode, atIndex) {
      if (normalizeElementName(childNode.tagName) === 'native_drawer_content') {
        parentNode.nativeView.drawerContent = childNode.nativeView;
      } else if (normalizeElementName(childNode.tagName) === 'native_main_content') {
        parentNode.nativeView.mainContent = childNode.nativeView;
      }
    }
  }
);

registerElement(
  'native_drawer_content',
  () => require('tns-core-modules/ui/page').Page,
);

registerElement(
  'native_main_content',
  () => require('tns-core-modules/ui/page').Page,
);

registerElement('native_image', () => require('tns-core-modules/ui/image').Image)
registerElement('img', () => require('tns-core-modules/ui/image').Image)
