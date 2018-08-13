import { getViewMeta, ViewClassMeta } from './element-registry';
import { insertChild, removeChild } from './utils';
import { Simple } from '@glimmer/interfaces';
import { View } from 'tns-core-modules/ui/core/view';
import BaseNode from './base-node';

export default class Node extends BaseNode implements Simple.Node {

  public readonly nodeType: Simple.NodeType;

  constructor(
    ownerDocument: Simple.Document,
    tagName: string | null) {
    super(ownerDocument, tagName);
  }
}
