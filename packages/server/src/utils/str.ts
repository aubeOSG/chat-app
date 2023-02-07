export const toCamelCase = str => {
  let replacedStr = str.replace(/[-_]+(.)?/g, (_, letter) => {
    return letter ? letter.toUpperCase() : '';
  });

  return replacedStr.substr(0, 1).toLowerCase() + replacedStr.substr(1);
};

export const prettyJson = obj => {
  return JSON.stringify(obj, null, 4);
};

export const toLower = str => {
  return str.trim().toLowerCase();
};

export const toCapitalize = str => {
  return str.replace(/^[A-Z|a-z]/g, letter => letter.toUpperCase());
};

export const toPascalCase = str => {
  return toCapitalize(str).replace(/[-_]+(.)?/g, (_, letter) => {
    return letter ? letter.toUpperCase() : '';
  });
};

export const toKebabCase = str => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
};

export const toSnakeCase = (str) => {
  return str
    .toLowerCase()
    .replace(/[^\p{L}0-9]+/gu, '_')
    .replace(/\s/g, '');
};

export default {
  toCamelCase,
  toPascalCase,
  toKebabCase,
  prettyJson,
  toLower,
  toCapitalize,
};
