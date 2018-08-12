import { getViewMeta } from './element-registry';
import { insertChild, removeChild } from './utils';

export default class ViewNode {
  constructor() {
    this.nodeType = null;
    this.tagName = null;
    this.parentNode = null;
    this.childNodes = [];
    this.prevSibling = null;
    this.nextSibling = null;

    this._ownerDocument = null;
    this._nativeView = null;
    this._meta = null;

    this.hasAttribute = this.removeAttribute = () => false;
  }

  toString() {
    return `${this.constructor.name}(${this.tagName})`;
  }

  get firstChild() {
    return this.childNodes.length ? this.childNodes[0] : null;
  }

  get lastChild() {
    return this.childNodes.length
      ? this.childNodes[this.childNodes.length - 1]
      : null;
  }

  get nativeView() {
    return this._nativeView;
  }

  set nativeView(view) {
    if (this._nativeView) {
      throw new Error(`Can't override native view.`);
    }

    this._nativeView = view;
  }

  get meta() {
    if (this._meta) {
      return this._meta;
    }

    return (this._meta = getViewMeta(this.tagName));
  }

  get ownerDocument() {
    if (this._ownerDocument) {
      return this._ownerDocument
    }

    let el = this
    while ((el = el.parentNode).nodeType !== 9) {
      // do nothing
    }

    return (this._ownerDocument = el)
  }

  setAttribute(key, value) {
    if (typeof(value) === 'function') {
      this.addEventListener(key, value);
    } else {
      this.nativeView[key] = value;
    }
  }

  setAttributeNS(key, value) {
    this.nativeView._applyXmlAttribute(key, value);
  }

  setStyle(property, value) {
    throw new Error(`setStyle not implemented`);
  }

  setText(text) {
    if (text && text.trim() === '') {
      return;
    }
    if (this.nodeType === 3) {
      this.parentNode.setText(text);
    } else {
      this.setAttribute('text', text);
    }
  }

  addEventListener(event, handler) {
    this.nativeView.on(event, handler);
  }

  removeEventListener(event) {
    this.nativeView.off(event);
  }

  insertBefore(childNode, referenceNode) {
    if (!childNode) {
      throw new Error(`Can't insert child: ${childNode}`);
    }

    if (referenceNode && referenceNode.parentNode !== this) {
      throw new Error(
        `Can't insert child, because the reference node has a different parent.`
      );
    }

    if (childNode.parentNode && childNode.parentNode !== this) {
      throw new Error(
        `Can't insert child, because it already has a different parent.`
      );
    }

    if (childNode.parentNode === this) {
      throw new Error(`Can't insert child, because it is already a child.`);
    }

    let index;
    if (referenceNode) {
      index = this.childNodes.indexOf(referenceNode);
      referenceNode.prevSibling = childNode;
    } else {
      index = this.childNodes.length;
      referenceNode = null;
    }

    childNode.parentNode = this;
    childNode.nextSibling = referenceNode;
    childNode.prevSibling = this.childNodes[index - 1];

    this.childNodes.splice(index, 0, childNode);

    insertChild(this, childNode, index);
  }

  appendChild(childNode) {
    if (!childNode) {
      throw new Error(`Can't append child: ${childNode}`);
    }

    if (childNode.parentNode && childNode.parentNode !== this) {
      throw new Error(
        `Can't append child, because it already has a different parent`
      );
    }

    if (childNode.parentNode === this) {
      throw new Error(`Can't append child, because it is already a child`);
    }

    childNode.parentNode = this

    if (this.lastChild) {
      childNode.prevSibling = this.lastChild;
      this.lastChild.nextSibling = childNode;
    }

    this.childNodes.push(childNode);

    insertChild(this, childNode, this.childNodes.length - 1);
  }

  removeChild(childNode) {
    if (!childNode) {
      throw new Error(`Can't remove child: ${childNode}`);
    }

    if (!childNode.parentNode) {
      throw new Error(`Can't remove child, because it has no parent.`);
    }

    if (childNode.parentNode !== this) {
      throw new Error(`Can't remove child, because it has a different parent.`);
    }

    childNode.parentNode = null;

    if (childNode.prevSibling) {
      childNode.prevSibling.nextSibling = childNode.nextSibling;
    }

    if (childNode.nextSibling) {
      childNode.nextSibling.prevSibling = childNode.prevSibling;
    }

    this.childNodes = this.childNodes.filter(node => node !== childNode);

    removeChild(this, childNode);
  }
}
