import { body, param, validationResult } from "express-validator";
import { handleValidationResponse } from "./handler.js";

export const validateQuery = async (req, res, next) => {
  await param("word").exists().isString().run(req);
  const result = validationResult(req);
  if (!result.isEmpty()) {
    handleValidationResponse(result.mapped(), req.body, res);
    return;
  }
  next();
};

export const validateBody = async (req, res, next) => {
  const validationChain = [
    body("definition").exists().isString(),
    body("word_language").exists().isInt(),
    body("definition_language").exists().isInt(),
  ];

  await Promise.all(validationChain.map((validation) => validation.run(req)));

  const result = validationResult(req);
  if (!result.isEmpty()) {
    handleValidationResponse(result.mapped(), req.body, res);
    return;
  }
  next();
};

export const validateBodyWithWord = async (req, res, next) => {
  const validationChain = [
    body("word").exists().isString(),
    body("definition").exists().isString(),
    body("word_language").exists().isInt(),
    body("definition_language").exists().isInt(),
  ];

  await Promise.all(validationChain.map((validation) => validation.run(req)));

  const result = validationResult(req);
  if (!result.isEmpty()) {
    handleValidationResponse(result.mapped(), req.body, res);
    return;
  }
  next();
};
