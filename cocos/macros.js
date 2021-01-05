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

/////////////////////////////////
var DataTypeID = {
  SimpleType: 0,
  InstanceRef: 1,
  Array_InstanceRef: 2,
  Array_AssetRefByInnerObj: 3,
  Class: 4,
  ValueTypeCreated: 5,
  AssetRefByInnerObj: 6,
  TRS: 7,
  ValueType: 8,
  Array_Class: 9,
  CustomizedClass: 10,
  Dict: 11,
  Array: 12,
  ARRAY_LENGTH: 13,
};
var CLASS_TYPE = 0;
var CLASS_KEYS = 1;
var CLASS_PROP_TYPE_OFFSET = 2;
var MASK_CLASS = 0;
var OBJ_DATA_MASK = 0;
var CUSTOM_OBJ_DATA_CLASS = 0;
var CUSTOM_OBJ_DATA_CONTENT = 1;
var VALUETYPE_SETTER = 0;
var DICT_JSON_LAYOUT = 0;
var ARRAY_ITEM_VALUES = 0;
var Refs = {
  EACH_RECORD_LENGTH: 3,
  OWNER_OFFSET: 0,
  KEY_OFFSET: 1,
  TARGET_OFFSET: 2,
};
var File = {
  Version: 0,
  Context: 0,
  SharedUuids: 1,
  SharedStrings: 2,
  SharedClasses: 3,
  SharedMasks: 4,
  Instances: 5,
  InstanceTypes: 6,
  Refs: 7,
  DependObjs: 8,
  DependKeys: 9,
  DependUuidIndices: 10,
  ARRAY_LENGTH: 11,
};
var PACKED_SECTIONS = 5;

module.exports = {
  macro,
};
