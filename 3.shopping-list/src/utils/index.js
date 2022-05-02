export const randomId = (prefix = "") =>
  prefix + "_" + Math.random().toString(36).substr(2, 9);

// export const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

export const deepClone = (obj, cloned = new Map()) => {
  // handle primitives and primitives wrapped in object
  if (
    typeof obj !== "object" ||
    obj === null ||
    [
      "[object String]",
      "[object Number]",
      "[object Boolean]",
      "[object BigInt]",
      "[object Symbol]",
      "[object Undefined]"
    ].includes(Object.prototype.toString.call(obj))
  ) {
    return obj;
  }
  // handle circular reference
  if (cloned.has(obj)) return cloned.get(obj);
  // handle arrays
  if (Array.isArray(obj)) {
    const result = [];
    cloned.set(obj, result);
    for (const el of obj) {
      result.push(deepClone(el, cloned));
    }
    return result;
  }
  // handle objects
  const keys = [...Object.keys(obj), ...Object.getOwnPropertySymbols(obj)];
  const result = {};
  cloned.set(obj, result);
  for (const key of keys) {
    result[key] = deepClone(obj[key], cloned);
  }
  return result;
};

export function throttle(func, wait, { trailing = true } = {}) {
  let timeoutId = null;
  let context = null;
  const freeze = () => {
    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (trailing && context !== null) {
        const [lastThis, lastArgs] = context;
        func.call(lastThis, ...lastArgs);
        context = null;
        freeze();
      }
    }, wait);
  };
  return function (...args) {
    if (timeoutId === null) {
      func.call(this, ...args);
      freeze();
    } else if (trailing) {
      context = [this, args];
    }
  };
}

export function debounce(fn, wait) {
  let timeoutId = null;
  return function (...args) {
    if (timeoutId !== null) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.call(this, ...args);
      timeoutId = null;
    }, wait);
  };
}

export function withMemo(
  func,
  { keyResolver = (...args) => args.join("_"), cacheTime = 60 * 1000 } = {}
) {
  const cache = new Map();
  return async function (...args) {
    const key = keyResolver(...args);
    if (!cache.has(key) || Date.now() >= cache.get(key).expires) {
      const res = await func.call(this, ...args);
      cache.set(key, {
        value: res,
        expires: Date.now() + cacheTime
      });
    }
    return cache.get(key).value;
  };
}

export function isEqual(a, b, compared = new Map()) {
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object") return false;
  if (compared.has(a) && compared.get(a) === b) return true;
  compared.set(a, b);
  const aKeys = [...Object.keys(a), ...Object.getOwnPropertySymbols(a)];
  const bKeys = [...Object.keys(b), ...Object.getOwnPropertySymbols(b)];
  if (aKeys.length !== bKeys.length) return false;
  for (let i = 0; i < aKeys.length; i++) {
    const aKey = aKeys[i];
    const bKey = bKeys[i];
    if (!isEqual(aKey, bKey, compared)) return false;
    const aVal = a[aKey];
    const bVal = b[bKey];
    if (!isEqual(aVal, bVal, compared)) return false;
  }
  return true;
}
