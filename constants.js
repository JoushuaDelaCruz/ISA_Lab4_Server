export const SuccessfulEntry = "Entry created successfully";
export const SuccessfulUpdate = (name) =>
  `Successfully updated entry for the word '${name}'`;

export const SuccessfulDelete = (name) =>
  `Successfully deleted entry for the word '${name}'`;

export const MissingEntry = (errors) =>
  "Entry missing: " + Object.keys(errors).toString();

export const ExistingEntry = (name) => `The word '${name}' already exists`;

export const EntryNotFound = "Entry Not Found";
export const EntryNotFoundMessage = (param) =>
  `The word '${param}' does not exist in the dictionary`;
