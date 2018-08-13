import ElementBaseNode from './element-base-node';
import { Simple } from '@glimmer/interfaces';

export default class CommentNode extends ElementBaseNode implements Simple.Comment {

  private _text: string | null = null;

  nodeType: Simple.NodeType.Comment;

  constructor(
    ownerDocument: Simple.Document,
    text: string) {

    super(ownerDocument, '#comment');

    this._text = text;
  }
}
