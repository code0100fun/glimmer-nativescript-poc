import ElementBaseNode from './element-base-node';
import { Simple } from '@glimmer/interfaces';

export default class ElementNode extends ElementBaseNode implements Simple.Element {
  nodeType: Simple.NodeType.Element;
}
