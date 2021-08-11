
export const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

export const isNumber = (text: unknown): text is number => {
  return typeof text === "number";
};

export const getString = (text: unknown, name: string): string => {
  if (!text || !isString(text)) {
    throw new Error('Incorrect or missing field for ' + name);
  }
  return text;
};

export const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};


