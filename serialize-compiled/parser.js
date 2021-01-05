"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.Parser = void 0);
const e = require("lodash"),
  t = require("../../editor-utils/uuid-utils"),
  r = require("./builder"),
  i = require("./builder"),
  s = require("./pack-jsons"),
  a = cc.Object,
  n = cc.Asset,
  l = cc._BaseNode,
  o = cc.Node,
  u = cc.Component,
  d = cc.ValueType,
  { PersistentMask: c, DontSave: f, DontDestroy: p, EditorOnly: h } = a.Flags,
  _ = (CC_TEST
    ? cc._Test.IntantiateJit
    : Editor.require(
        "unpack://engine-dev/cocos2d/core/platform/instantiate-jit"
      )
  ).equalsToDefault,
  b = CC_TEST
    ? cc.Class.getDefault
    : Editor.require("unpack://engine-dev/cocos2d/core/platform/CCClass")
        .getDefault,
  y = ["_objFlags", "_parent", "_id", "_prefab"].concat(
    "_name",
    "_active",
    "_eulerAngles",
    "_localZOrder"
  ),
  v = cc.Class.Attr,
  g = v.DELIMETER + "editorOnly",
  O = v.DELIMETER + "default",
  C = v.DELIMETER + "formerlySerializedAs";
let E = {
    _depends: new Array(),
    dependsOn: function (e, t) {
      this._depends.push(e, t);
    },
  },
  m = (() => {
    class r {
      constructor(e, t) {
        (this.parsedObjs = new Set()),
          (t = t || {}),
          (this.exporting = !!t.exporting),
          (this.discardInvalid =
            !("discardInvalid" in t) || !!t.discardInvalid),
          (this.dontStripDefault = !(
            this.exporting &&
            "dontStripDefault" in t &&
            !t.dontStripDefault
          )),
          (this.missingClassReporter = t.missingClassReporter),
          (this.missingObjectReporter = t.missingObjectReporter),
          (this.reserveContentsForAllSyncablePrefab = !!t.reserveContentsForSyncablePrefab),
          (this.builder = e),
          (this.assetExists =
            this.missingObjectReporter && Object.create(null));
      }
      parse(e) {
        (this.rootObj = e),
          this.parseField(null, "", e),
          this.builder.setRoot(e);
      }
      checkMissingAsset(e, t) {
        if (this.missingObjectReporter) {
          var r = this.assetExists[t];
          void 0 === r &&
            (r = this.assetExists[t] = !!Editor.assetdb.remote.uuidToFspath(t)),
            r || this.missingObjectReporter(e);
        }
      }
      verifyValue(e, t, i) {
        var s = typeof i;
        if ("object" === s) {
          if (!i) return null;
          if (i instanceof a) {
            if (i instanceof n) {
              var l = i._uuid;
              return l ? (this.checkMissingAsset(i, l), i) : null;
            }
            var u = i._objFlags;
            if (this.exporting && u & h) return r.REMOVED_OBJ;
            if (this.discardInvalid) {
              if (u & f) return r.REMOVED_OBJ;
              if (!i.isValid)
                return (
                  this.missingObjectReporter && this.missingObjectReporter(i),
                  null
                );
            } else {
              if (u & f && u & p) return r.REMOVED_OBJ;
              if (!i.isRealValid) return null;
            }
            if (o && o.isNode(i))
              if (this.canDiscardByPrefabRoot(i) && i !== i._prefab.root)
                return null;
          }
          return i;
        }
        return "function" !== s
          ? e instanceof a && "_objFlags" === t && i > 0
            ? i & c
            : i
          : null;
      }
      canDiscardByPrefabRoot(e) {
        return !(
          this.reserveContentsForAllSyncablePrefab ||
          !(function (e) {
            var t, r;
            return null ===
              (r =
                null ===
                  (t = null === e || void 0 === e ? void 0 : e._prefab) ||
                void 0 === t
                  ? void 0
                  : t.root) || void 0 === r
              ? void 0
              : r._prefab.sync;
          })(e) ||
          this.rootObj === e
        );
      }
      enumerateClass(e, t, i, s) {
        for (
          var a = v.getClassAttrs(t), n = i || t.__values__, o = 0;
          o < n.length;
          o++
        ) {
          var d = n[o],
            c = e[d];
          if ((c = this.verifyValue(e, d, c)) === r.REMOVED_OBJ) continue;
          let t = b(a[d + O]);
          if (this.exporting) {
            if (a[d + g]) continue;
            if (!this.dontStripDefault && _(t, c)) continue;
          }
          var f = a[d + C];
          this.parseField(e, d, c, {
            formerlySerializedAs: f,
            defaultValue: t,
          });
        }
        if ((l && e instanceof l) || (u && e instanceof u)) {
          if (this.exporting) {
            if (!(e instanceof l && e._parent instanceof cc.Scene)) return;
            if (!this.dontStripDefault && !e._id) return;
          }
          this.builder.setProperty_Raw(e, "_id", e._id);
        }
      }
      setTrsOfSyncablePrefabRoot(e) {
        let t = e._trs.slice();
        (t[7] = t[8] = t[9] = 1),
          r.isDefaultTrs(t) ||
            this.builder.setProperty_TypedArray(e, "_trs", t);
      }
      static isDefaultTrs(e) {
        return (
          0 === e[0] &&
          0 === e[1] &&
          0 === e[2] &&
          0 === e[3] &&
          0 === e[4] &&
          0 === e[5] &&
          1 === e[6] &&
          1 === e[7] &&
          1 === e[8] &&
          1 === e[9]
        );
      }
      enumerateNode(e, t) {
        if (this.canDiscardByPrefabRoot(e)) {
          var r = e._prefab.root === e;
          r &&
            (this.enumerateClass(e, t, y, r),
            this.setTrsOfSyncablePrefabRoot(e));
        } else this.enumerateClass(e, t);
      }
      parseField(e, r, i, s) {
        var a = typeof i;
        if ("object" === a) {
          if (!i) return this.builder.setProperty_Raw(e, r, null, s), void 0;
          if (i instanceof n) {
            var l = i._uuid;
            if ((this.exporting && (l = t.compressUuid(l, !0)), e))
              return this.builder.setProperty_AssetUuid(e, r, l, s), void 0;
          }
          if (this.parsedObjs.has(i))
            return this.builder.setProperty_ParsedObject(e, r, i, s), void 0;
          this.parseObjField(e, r, i, s);
        } else
          "function" !== a
            ? this.builder.setProperty_Raw(e, r, i, s)
            : this.builder.setProperty_Raw(e, r, null, s);
      }
      parseObjField(t, i, s, a) {
        this.parsedObjs.add(s);
        var n = s.constructor;
        if (
          (function (e, t) {
            return (
              !!t &&
              (!!cc.Class._isCCClass(t) ||
                (t.__values__ && cc.js._getClassId(e, !1)))
            );
          })(s, n)
        ) {
          if (s instanceof d && this.builder.setProperty_ValueType(t, i, s, a))
            return;
          if (o && o.isNode(s))
            return (
              this.builder.setProperty_Class(t, i, s, a),
              this.enumerateNode(s, n),
              void 0
            );
          if (s._serialize) {
            let e = a || {};
            (e.content = s._serialize(this.exporting, E)),
              this.builder.setProperty_CustomizedClass(t, i, s, e);
            let r = E._depends;
            for (let e = 0; e < r.length; e += 2)
              this.builder.setProperty_AssetUuid(s, r[e], r[e + 1]);
            r.length = 0;
          } else {
            var l = n.__values__;
            if (
              (s._onBeforeSerialize && (l = s._onBeforeSerialize(l)),
              l.length > 0)
            ) {
              if ("_$erialized" !== l[l.length - 1])
                this.builder.setProperty_Class(t, i, s, a),
                  this.enumerateClass(s, n, l);
              else if (s._$erialized) {
                let e = s._$erialized,
                  r = e.__type__,
                  n = a || {};
                (n.expectedType = r),
                  (n.formerlySerializedData = e),
                  this.builder.setProperty_SerializedData(t, i, s, n),
                  this.enumerateDict(e),
                  this.missingClassReporter && this.missingClassReporter(s, r);
              }
            } else this.builder.setProperty_Class(t, i, s, a);
          }
        } else if (ArrayBuffer.isView(s)) {
          if (o && o.isNode(t) && "_trs" === i && r.isDefaultTrs(s)) return;
          this.builder.setProperty_TypedArray(t, i, s, a);
        } else {
          if (n && n !== Object && !Array.isArray(s)) {
            if (!t) throw new Error(`Unknown object to serialize: ${s}`);
            return;
          }
          if (Array.isArray(s)) {
            let n = e(s)
                .map((e, t) => this.verifyValue(s, t, e))
                .filter((e) => e !== r.REMOVED_OBJ)
                .value(),
              l = a || {};
            (l.arrayLength = n.length),
              this.builder.setProperty_Array(t, i, s, l);
            for (let e = 0; e < n.length; ++e) this.parseField(s, e, n[e]);
          } else
            this.builder.setProperty_Dict(t, i, s, a), this.enumerateDict(s);
        }
      }
      enumerateDict(e) {
        for (var t in e) {
          if (
            (e.hasOwnProperty && !e.hasOwnProperty(t)) ||
            (95 === t.charCodeAt(0) && 95 === t.charCodeAt(1))
          )
            continue;
          let i = e[t];
          (i = this.verifyValue(e, t, i)) === r.REMOVED_OBJ && (i = null),
            this.parseField(e, t, i);
        }
      }
    }
    return (r.REMOVED_OBJ = Symbol()), r;
  })();
function D(e, t) {
  let i;
  return (t = t || {}).exporting
    ? ((i = new r.default(t)), new m(i, t).parse(e), (e = null), i.dump())
    : Editor.serialize(e, t);
}
(exports.Parser = m),
  (exports.default = D),
  (Editor.serializeCompiled = function (e, t) {
    return D(
      e,
      (t = Object.assign({ exporting: !0, dontStripDefault: !1 }, t))
    );
  }),
  (Editor.serializeCompiled.getRootData = i.getRootData),
  (Editor.serializeCompiled.packJSONs = s.default);
