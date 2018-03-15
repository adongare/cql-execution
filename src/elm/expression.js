/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let Expression, UnimplementedExpression;
const { build } = require('./builder');
const { typeIsArray } = require('../util/util');

module.exports.Expression = (Expression = class Expression {
  constructor(json) {
    if (json.operand != null) {
      const op = build(json.operand);
      if (typeIsArray(json.operand)) { this.args = op; } else { this.arg = op; }
    }
    if (json.localId != null) {
      this.localId = json.localId;
    }
  }
  
  execute(ctx) {
    if (this.localId != null) {
      // Store the localId and result on the root context of this library
      const execValue = this.exec(ctx);
      ctx.rootContext().setLocalIdWithResult(this.localId, execValue);
      return execValue;
    } else { 
      return this.exec(ctx);
    }
  }

  exec(ctx) {
    return this;
  }

  execArgs(ctx) {
    switch (false) {
      case (this.args == null): return ((() => {
        const result = [];
        for (let arg of this.args) {           result.push(arg.execute(ctx));
        }
        return result;
      })());
      case (this.arg == null): return this.arg.execute(ctx);
      default: return null;
    }
  }
});

module.exports.UnimplementedExpression = (UnimplementedExpression = class UnimplementedExpression extends Expression {
  constructor(json) {
    {
      // Hack: trick Babel/TypeScript into allowing this before super.
      if (false) { super(); }
      let thisFn = (() => { this; }).toString();
      let thisName = thisFn.slice(thisFn.indexOf('{') + 1, thisFn.indexOf(';')).trim();
      eval(`${thisName} = this;`);
    }
    this.json = json;
    super(...arguments);
  }

  exec(ctx) {
    throw new Error(`Unimplemented Expression: ${this.json.type}`);
  }
});
