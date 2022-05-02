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

export function debounce(func, wait) {
  let timeoutId = null;
  return function (...args) {
    if (timeoutId !== null) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.call(this, ...args);
      timeoutId = null;
    }, wait);
  };
}

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

export function withMemo(
  fn,
  { keyResolver = (...args) => args.join("_"), cacheTime = 60 * 1000 } = {}
) {
  return async function (...args) {
    const key = keyResolver(...args);
    let json = localStorage.getItem(key);
    if (!json || Date.now() >= JSON.parse(json).expires) {
      const res = await fn.call(this, ...args);
      json = JSON.stringify({
        data: res,
        expires: Date.now() + cacheTime
      });
      localStorage.setItem(key, json);
    }
    return JSON.parse(json).data;
  };
}
