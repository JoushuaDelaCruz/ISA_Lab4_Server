import cors from "cors";
import express from "express";
import {
  deleteDefinition,
  insertDefinition,
  queryDefinition,
  queryLanguage,
  updateDefinition,
} from "./database.js";
import {
  NotFoundError,
  handleConflictResponse,
  handleCreateSuccessResponse,
  handleUnknownResponse,
} from "./handler.js";
import {
  validateBody,
  validateBodyWithWord,
  validateQuery,
} from "./validator.js";
const DefinitionRouter = () => {
  const router = express.Router();

  router.post("/", validateBodyWithWord, async (req, res) => {
    const { word, definition, word_language, definition_language } = req.body;
    const result = await insertDefinition({
      word,
      definition,
      word_language,
      definition_language,
    });

    if (result.error) {
      if (result.error === "Entry already exists") {
        return handleConflictResponse(req.body, res);
      }
      return handleUnknownResponse(result.error, res);
    }

    return handleCreateSuccessResponse(req.body, res);
  });

  router.patch("/:word", validateQuery, validateBody, async (req, res) => {
    const word = req.params.word;
    const { definition, word_language, definition_language } = req.body;

    const result = await updateDefinition({
      word,
      definition,
      word_language,
      definition_language,
    });

    return;
  });

  router.get("/:word", validateQuery, async (req, res) => {
    const word = req.params.word;
    const result = await queryDefinition(word);
    res.json(result);
    return;
  });

  /**
   * Deletes entry from database.
   * `deleted` field in response indicates if affected rows > 0.
   * @returns {boolean} true if entry was deleted, false otherwise.
   */
  router.delete("/:word", validateQuery, async (req, res) => {
    const word = req.params.word;
    const result = await deleteDefinition(word);

    res.json({ result });
    return;
  });

  return router;
};

const LanguagesRouter = () => {
  const router = express.Router();

  router.get("/", async (_req, res) => {
    const result = await queryLanguage();
    res.json({ languages: result });
    return;
  });

  return router;
};

const App = () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(cors());

  app.use("/api/v1/definition", DefinitionRouter());
  app.use("/api/v1/languages", LanguagesRouter());
  app.use("*", NotFoundError);

  app.listen(process.env.PORT || 3000, () => {
    console.log("Serving...");
  });
};

App();
