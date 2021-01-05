"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getRootData = exports.reduceEmptyArray = exports.FORMAT_VERSION = void 0);
const e = require("./types"),
  t = require("./create-class-mask"),
  s = cc._deserializeCompiled._serializeBuiltinValueTypes,
  {
    EMPTY_PLACEHOLDER: r,
    CUSTOM_OBJ_DATA_CLASS: i,
    CUSTOM_OBJ_DATA_CONTENT: n,
  } = cc._deserializeCompiled.macros;
exports.FORMAT_VERSION = 1;
const a = 0;
var o;
function d(e) {
  return e && e.length > 0 ? e : r;
}
(function (e) {
  e.Impl = class {
    constructor(e) {
      (this.beforeOffsetRefs = new Array()),
        (this.afterOffsetRefs = new Array()),
        (this.ctx = e);
    }
    addRef(e, t, s) {
      if (s.instanceIndex < e.instanceIndex) return s.instanceIndex;
      let r = [NaN, t, s.instanceIndex];
      return e.indexed
        ? ((r[0] = e.instanceIndex), this.afterOffsetRefs.push(r), NaN)
        : ((r[0] = a),
          this.beforeOffsetRefs.push(r),
          ~(this.beforeOffsetRefs.length - 1));
    }
    build() {
      if (
        0 === this.beforeOffsetRefs.length &&
        0 === this.afterOffsetRefs.length
      )
        return null;
      let e = this.beforeOffsetRefs.length,
        t = this.beforeOffsetRefs.concat(this.afterOffsetRefs),
        s = new Array(3 * t.length + 1),
        r = 0;
      for (const e of t) {
        s[r++] = e[0];
        let t = e[1];
        "number" == typeof t
          ? (s[r++] = ~t)
          : this.ctx.sharedStrings.traceString(t, s, r++),
          (s[r++] = e[2]);
      }
      return (s[r] = e), s;
    }
  };
})(o || (o = {})),
  (exports.reduceEmptyArray = d);
class h {
  constructor(t) {
    (this.sharedUuids = new e.TraceableDict()),
      (this.sharedStrings = new e.TraceableDict()),
      (this.dependAssets = new Array()),
      (this.objects = new Map()),
      (this.normalNodes = new Array()),
      (this.advancedNodes = new Array()),
      (this.classNodes = new Array()),
      (this.data = new Array(11)),
      (t = t || {}),
      (this.stringify = !("stringify" in t && !t.stringify)),
      (this.minify = !!t.minify),
      (this.noNativeDep = !("noNativeDep" in t && !t.noNativeDep)),
      (this.refsBuilder = new o.Impl(this));
  }
  setProperty_Array(t, s, r, i) {
    let n = new e.ArrayNode(i.arrayLength);
    this.advancedNodes.push(n), this.setDynamicProperty(t, s, r, n);
  }
  setProperty_Dict(t, s, r, i) {
    let n = new e.DictNode();
    this.advancedNodes.push(n), this.setDynamicProperty(t, s, r, n);
  }
  setProperty_Class(e, t, s, r) {
    let i = cc.js._getClassId(s.constructor, !1);
    this.doSetClassProperty(e, t, s, i);
  }
  setProperty_SerializedData(e, t, s, r) {
    let { expectedType: i, formerlySerializedData: n } = r,
      a = this.doSetClassProperty(e, t, s, i);
    this.addNode(n, a);
  }
  setProperty_CustomizedClass(t, s, r, i) {
    let n = cc.js._getClassId(r.constructor, !1),
      a = new e.CustomClassNode(n, i.content);
    this.advancedNodes.push(a),
      this.classNodes.push(a),
      this.setDynamicProperty(t, s, r, a);
  }
  setProperty_ParsedObject(e, t, s, r) {
    if (!e)
      return (
        console.error("Owner is unspecified for ParsedObject: " + s), void 0
      );
    let i = this.getExistsNode(s);
    this.getExistsNode(e).setDynamic(i, t);
  }
  setProperty_Raw(e, t, s, r) {
    this.getExistsNode(e).setStatic(t, 0, s);
  }
  setProperty_ValueType(e, t, r, i) {
    let n = s(r);
    if (!n) return !1;
    let a = 8;
    return (
      i && i.defaultValue instanceof cc.ValueType && (a = 5),
      this.getExistsNode(e).setStatic(t, a, n),
      !0
    );
  }
  setProperty_TypedArray(e, t, s, r) {
    if (!(e instanceof cc.Node) || "_trs" !== t)
      throw new Error(
        "Not support to serialize TypedArray yet. Can only use TypedArray in TRS."
      );
    if (10 !== s.length)
      throw new Error(`TRS ${s} should contains 10 elements.`);
    let i = this.getExistsNode(e),
      n = Array.from(s);
    i.setStatic(t, 7, n);
  }
  setProperty_AssetUuid(t, s, r, i) {
    let n = this.getExistsNode(t);
    this.dependAssets.push(n, s, r),
      n instanceof e.CustomClassNode && (n.shouldBeIndexed = !0);
  }
  doSetClassProperty(t, s, r, i) {
    let n = new e.ClassNode(i);
    return (
      this.normalNodes.push(n),
      this.classNodes.push(n),
      this.setDynamicProperty(t, s, r, n),
      n
    );
  }
  setRoot(e) {
    this.rootNode = this.getExistsNode(e);
  }
  setDynamicProperty(e, t, s, r) {
    if ((this.addNode(s, r), e)) {
      this.getExistsNode(e).setDynamic(r, t);
    }
  }
  addNode(e, t) {
    this.objects.has(e) &&
      console.error(`The object ${e} already registered in the builder`),
      this.objects.set(e, t);
  }
  getExistsNode(e) {
    let t = this.objects.get(e);
    if (!t) throw new Error(`The object ${e} is referenced before register`);
    return t;
  }
  collectInstances() {
    (this.normalNodes = this.normalNodes.filter((e) => e.refCount > 1)),
      this.normalNodes.sort(e.BaseNode.compareByRefCount),
      (this.advancedNodes = this.advancedNodes.filter(
        (e) => e.shouldBeIndexed || e.refCount > 1
      )),
      this.advancedNodes.sort(e.BaseNode.compareByRefCount);
    let t = this.rootNode;
    if (t instanceof e.ClassNode) {
      let e = this.normalNodes.indexOf(t);
      -1 !== e && this.normalNodes.splice(e, 1), this.normalNodes.unshift(t);
    } else {
      -1 === this.advancedNodes.indexOf(t) &&
        (this.advancedNodes.length, this.advancedNodes.push(t));
    }
    let s = this.normalNodes.length;
    for (let e = 0; e < s; ++e) {
      let t = this.normalNodes[e];
      (t.instanceIndex = e), (t.indexed = !0);
    }
    for (let e = 0; e < this.advancedNodes.length; ++e) {
      let t = this.advancedNodes[e];
      (t.instanceIndex = s + e), (t.indexed = !0);
    }
  }
  dumpInstances() {
    let t = this.normalNodes.length + this.advancedNodes.length,
      s = new Array(t),
      r = this.normalNodes.length;
    for (let e = 0; e < r; ++e) {
      let t = this.normalNodes[e];
      s[e] = t.dumpRecursively(this.refsBuilder);
    }
    for (let t = 0; t < this.advancedNodes.length; ++t) {
      let i = this.advancedNodes[t],
        a = i.dumpRecursively(this.refsBuilder);
      i instanceof e.CustomClassNode ? (s[r + t] = a[n]) : (s[r + t] = a);
    }
    if (
      0 !== this.rootNode.instanceIndex ||
      "number" == typeof s[s.length - 1] ||
      !this.noNativeDep
    ) {
      let e = this.rootNode.instanceIndex;
      s.push(this.noNativeDep ? e : ~e);
    }
    this.data[5] = s;
  }
  dumpInstanceTypes() {
    let t = this.advancedNodes.map((t) =>
      t instanceof e.CustomClassNode ? t.dumped[i] : ~t.selfType
    );
    this.data[6] = d(t);
  }
  dumpDependUuids() {
    let e = { owners: new Array(), keys: new Array(), uuids: new Array() },
      t = { owners: new Array(), keys: new Array(), uuids: new Array() },
      s = this.dependAssets;
    for (let r = 0; r < s.length; r += 3) {
      let i,
        n = s[r],
        o = s[r + 1],
        d = s[r + 2];
      n.indexed
        ? ((i = t),
          n.setAssetRefPlaceholderOnIndexed(o),
          i.owners.push(n.instanceIndex))
        : ((i = e), n.setStatic(o, 6, i.owners.length), i.owners.push(a)),
        "number" == typeof o && (o = ~o),
        i.keys.push(o),
        i.uuids.push(d);
    }
    this.data[8] = e.owners.concat(t.owners);
    let r = (this.data[9] = e.keys.concat(t.keys));
    for (let e = 0; e < r.length; ++e) {
      let t = r[e];
      "string" == typeof t && this.sharedStrings.traceString(t, r, e);
    }
    let i = (this.data[10] = e.uuids.concat(t.uuids));
    for (let e = 0; e < i.length; ++e) {
      let t = i[e];
      this.sharedUuids.traceString(t, i, e);
    }
  }
  dump() {
    this.collectInstances(),
      this.dumpDependUuids(),
      this.dumpInstances(),
      (this.data[0] = exports.FORMAT_VERSION);
    let { sharedClasses: e, sharedMasks: s } = t.default(this.classNodes);
    (this.data[3] = e),
      (this.data[4] = d(s)),
      this.dumpInstanceTypes(),
      (this.data[7] = this.refsBuilder.build() || r);
    let i = this.sharedStrings.dump();
    this.data[2] = d(i);
    let n = this.sharedUuids.dump();
    return (
      (this.data[1] = d(n)),
      this.stringify
        ? JSON.stringify(this.data, null, this.minify ? 0 : 2)
        : this.data
    );
  }
}
(exports.default = h),
  (exports.getRootData = function (e) {
    let t = e[5];
    if (Array.isArray(t)) {
      let e = t[t.length - 1];
      return "number" == typeof e ? t[e >= 0 ? e : ~e] : t[0];
    }
    return t;
  }),
  CC_TEST &&
    (cc._Test.serialize = { TraceableDict: e.TraceableDict, Builder: h });
