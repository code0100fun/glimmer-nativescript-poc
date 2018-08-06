import { tracked } from '@glimmer/component';
import { getOwner } from '@glimmer/di';

export const REGISTER_TRACKING = Symbol('register-component');

const dasherize = (str: string) => str.replace(
  /[A-Z](?:(?=[^A-Z])|[A-Z]*(?=[A-Z][^A-Z]|$))/g,
  (s, i) => (i > 0 ? '-' : '') + s.toLowerCase()
);

const PROPERTY_CACHE = Symbol('injection-cache');

export default function injectServices(...properties: string[]): any {
  return (baseConstructor: any) => {
    class SubClassWithInjections extends baseConstructor { }

    let pdm: PropertyDescriptorMap = properties.reduce((acc, item) => {
      let pd: PropertyDescriptor = {
        get() {
          let self: any = this;
          if (!self[PROPERTY_CACHE]) {
            self[PROPERTY_CACHE] = {};
          }
          let resolved = self[PROPERTY_CACHE][item];
          if (!resolved) {
            resolved = getOwner(this).lookup(`service:${dasherize(item)}`);
            if (resolved[REGISTER_TRACKING]) {
              resolved[REGISTER_TRACKING](() => {
                self[item] = resolved;
              });
            }
            self[PROPERTY_CACHE][item] = resolved;
          }
          return resolved;
        },
        set(value) {
          let self: any = this;
          if (!self[PROPERTY_CACHE]) {
            self[PROPERTY_CACHE] = {};
          }
          self[PROPERTY_CACHE][item] = value;
        }
      };
      return Object.assign({
        [`${item}`]: tracked(SubClassWithInjections.prototype, item, pd)
      }, acc);
    }, {});

    Object.defineProperties(SubClassWithInjections.prototype, pdm);

    return SubClassWithInjections;
  };
}
