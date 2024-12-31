import { PostMixins } from "./mixins/PostMixins"

export class StepPost extends PostMixins {
  protected _cid: string;

  constructor(agent, parent, cid: string) {
    super(agent, parent)
    this._cid = cid
  }

  async apply() {
    console.log('Get post')
  }
}
