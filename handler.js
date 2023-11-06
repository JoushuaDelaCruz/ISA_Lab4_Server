import { Schema, Entry } from "./schema.js";
import { queryEntryCount } from "./database.js";

const _handleResponse = async (statusCode, schema, res) => {
  const result = await queryEntryCount();

  res.status(statusCode).json({ ...schema.toJSON(), total: result });
  return;
};

export const handleCreateSuccessResponse = (body, res) => {
  const schema = new Schema();
  const entry = new Entry(body);

  schema.message = "Entry created successfully";
  schema.entry = entry;

  return _handleResponse(201, schema, res);
};

export const handleUpdateSuccessResponse = (param, body, res) => {
  const schema = new Schema();
  const entry = new Entry(body);

  schema.message = `Successfully updated entry for the word '${param}'`;
  schema.entry = entry;

  return _handleResponse(200, schema, res);
};

export const handleDeleteSuccessResponse = (param, res) => {
  const schema = new Schema();

  schema.message = `Successfully deleted entry for the word '${param}'`;

  return _handleResponse(204, schema, res);
};

export const handleValidationResponse = (errors, body, res) => {
  const schema = new Schema();
  const entry = new Entry(body);

  schema.entry = entry.toJSON();
  schema.message = "Entry missing: " + Object.keys(errors).toString();

  return _handleResponse(400, schema, res);
};

export const handleConflictResponse = (body, res) => {
  const schema = new Schema();
  const entry = new Entry(body);

  schema.error = `The word '${body.word}' already exists`;
  schema.entry = entry.toJSON();

  return _handleResponse(409, schema, res);
};

export const handleUnknownResponse = (error, res) => {
  const schema = new Schema();

  schema.message = error;
  return _handleResponse(500, schema, res);
};

export const handleNotFoundError = (param, res) => {
  const schema = new Schema();
  const entry = new Entry();

  entry.word = param;
  schema.entry = entry.toJSON();

  schema.error = "Entry Not Found";
  schema.message = `The word '${param}' does not exist in the dictionary`;

  return _handleResponse(404, schema, res);
};

export const NotFoundError = (_req, res) => {
  res.status(404);
  return;
};
