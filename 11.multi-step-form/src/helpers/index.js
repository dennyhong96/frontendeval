export const validate = (val) => val.length > 0;

export const getInitialState = (fields) =>
  fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {});
