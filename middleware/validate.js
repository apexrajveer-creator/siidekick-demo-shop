"use strict";

function isEmail(value) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validate(shape) {
  return function validateMiddleware(req, res, next) {
    for (const [field, type] of Object.entries(shape)) {
      const value = req.body && req.body[field];
      let ok = true;
      if (type === "string") ok = typeof value === "string";
      else if (type === "number") ok = typeof value === "number" && Number.isFinite(value);
      else if (type === "boolean") ok = typeof value === "boolean";
      else if (type === "email") ok = isEmail(value);
      if (!ok) {
        return res.status(400).json({ error: "invalid input", field });
      }
    }
    next();
  };
}

module.exports = { validate };
module.exports.validate = validate;
