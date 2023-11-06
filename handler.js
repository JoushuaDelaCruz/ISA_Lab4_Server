import { Schema, Entry } from "./schema.js";
import { queryEntryCount } from "./database.js";
import {
  EntryNotFound,
  EntryNotFoundMessage,
  ExistingEntry,
  SuccessfulDelete,
  SuccessfulEntry,
  SuccessfulUpdate,
} from "./constants.js";

const _handleResponse = async (statusCode, schema, res) => {
  const result = await queryEntryCount();

  res.status(statusCode).json({ ...schema.toJSON(), total: result });
  return;
};

export const handleCreateSuccessResponse = (body, res) => {
  const schema = new Schema();
  const entry = new Entry(body);

  schema.message = SuccessfulEntry;
  schema.entry = entry;

  return _handleResponse(201, schema, res);
};

export const handleUpdateSuccessResponse = (param, body, res) => {
  const schema = new Schema();
  const entry = new Entry(body);

  schema.message = SuccessfulUpdate(param);
  schema.entry = entry;

  return _handleResponse(200, schema, res);
};

export const handleDeleteSuccessResponse = (param, res) => {
  const schema = new Schema();

  schema.message = SuccessfulDelete(param);

  return _handleResponse(204, schema, res);
};

export const handleValidationResponse = (errors, body, res) => {
  const schema = new Schema();
  const entry = new Entry(body);

  schema.entry = entry.toJSON();
  schema.message = MissingEntry(errors);

  return _handleResponse(400, schema, res);
};

export const handleConflictResponse = (body, res) => {
  const schema = new Schema();
  const entry = new Entry(body);

  schema.error = ExistingEntry(body.word);
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

  schema.error = EntryNotFound;
  schema.message = EntryNotFoundMessage(param);

  return _handleResponse(404, schema, res);
};

export const NotFoundError = (_req, res) => {
  res.status(404);
  return;
};
