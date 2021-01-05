const EMPTY_PLACEHOLDER = 0;
const CUSTOM_OBJ_DATA_CLASS = 0;
const CUSTOM_OBJ_DATA_CONTENT = 1;
const CLASS_TYPE = 0;
const CLASS_KEYS = 1;
const CLASS_PROP_TYPE_OFFSET = 2;
const MASK_CLASS = 0;
const OBJ_DATA_MASK = 0;
const DICT_JSON_LAYOUT = 0;
const ARRAY_ITEM_VALUES = 0;
const PACKED_SECTIONS = 5;

const macro = {
  EMPTY_PLACEHOLDER,
  CUSTOM_OBJ_DATA_CLASS,
  CUSTOM_OBJ_DATA_CONTENT,
  CLASS_TYPE,
  CLASS_KEYS,
  CLASS_PROP_TYPE_OFFSET,
  MASK_CLASS,
  OBJ_DATA_MASK,
  DICT_JSON_LAYOUT,
  ARRAY_ITEM_VALUES,
  PACKED_SECTIONS,
};

const { Vec2, Vec3, Vec4, Quat, Color, Size, Rect, Mat4 } = cc;

const BuiltinValueTypes = [Vec2, Vec3, Vec4, Quat, Color, Size, Rect, Mat4];

function serializeBuiltinValueTypes(obj) {
  let ctor = obj.constructor;
  let typeId = BuiltinValueTypes.indexOf(ctor);
  switch (ctor) {
    case Vec2:
      return [typeId, obj.x, obj.y];

    case Vec3:
      return [typeId, obj.x, obj.y, obj.z];

    case Vec4:
    case Quat:
      return [typeId, obj.x, obj.y, obj.z, obj.w];

    case Color:
      return [typeId, obj._val];

    case Size:
      return [typeId, obj.width, obj.height];

    case Rect:
      return [typeId, obj.x, obj.y, obj.width, obj.height];

    case Mat4:
      var res = new Array(17);
      res[0] = typeId;
      Mat4.toArray(res, obj, 1);
      return res;

    default:
      return null;
  }
}

class FileInfo {
  preprocessed = true;
  constructor(version) {
    this.version = version;
  }
}

const deser = cc.deserialize;

deser.isCompiledJson = function (json) {
  if (Array.isArray(json)) {
    let version = json[0];
    return typeof version === 'number' || version instanceof FileInfo;
  } else {
    return false;
  }
};

deser.macros = {
  EMPTY_PLACEHOLDER,
  CUSTOM_OBJ_DATA_CLASS,
  CUSTOM_OBJ_DATA_CONTENT,
  CLASS_TYPE,
  CLASS_KEYS,
  CLASS_PROP_TYPE_OFFSET,
  MASK_CLASS,
  OBJ_DATA_MASK,
  DICT_JSON_LAYOUT,
  ARRAY_ITEM_VALUES,
  PACKED_SECTIONS,
};
deser._BuiltinValueTypes = BuiltinValueTypes;
deser._serializeBuiltinValueTypes = serializeBuiltinValueTypes;

cc._deserializeCompiled = deser;
