import express from "express";
import cors from "cors";
import {
  queryEntryCount,
  deleteDefinition,
  insertDefinition,
  updateDefinition,
  queryDefinition,
  queryLanguage,
} from "./database.js";

const NotFoundError = (_req, res) => {
  res.status(404);
  return;
};

const handleError = async (error, res) => {
  const result = await queryEntryCount();
  res
    .status(error.status || 400)
    .json({ error: error.message, entries: result });
  return;
};

const DefinitionRouter = () => {
  const router = express.Router();

  router.post("/", async (req, res) => {
    const { word, definition, word_language, definition_language } = req.body;
    if (!word || !definition || !word_language || !definition_language) {
      return handleError({ status: 400, message: "Missing parameters" }, res);
    }

    const result = await insertDefinition({
      word,
      definition,
      word_language,
      definition_language,
    });

    if (result.error) {
      if (result.error === "Entry already exists") {
        return handleError(
          { status: 409, message: "Entry already exists" },
          res
        );
      }
      return handleError({ status: 500, message: result.error }, res);
    }

    const count = await queryEntryCount();

    res.json({ count, ...result });
    return;
  });

  router.patch("/:word", async (req, res) => {
    const word = req.params.word;
    const { definition, word_language, definition_language } = req.body;

    if (!word) {
      return handleError({ status: 400, message: "Missing word" }, res);
    }

    if (!definition && !word_language && !definition_language) {
      return handleError({ status: 400, message: "Missing parameters" }, res);
    }

    const result = await updateDefinition({
      word,
      definition,
      word_language,
      definition_language,
    });

    const count = await queryEntryCount();

    res.json({ count, ...result });
    return;
  });

  router.get("/:word", async (req, res) => {
    const word = req.params.word;
    if (!word) {
      return handleError({ status: 400, message: "Missing word" }, res);
    }
    const result = await queryDefinition(word);
    res.json(result);
    return;
  });

  /**
   * Deletes entry from database.
   * `deleted` field in response indicates if affected rows > 0.
   * @returns {boolean} true if entry was deleted, false otherwise.
   */
  router.delete("/:word", async (req, res) => {
    const word = req.params.word;
    if (!word) {
      return handleError({ status: 400, message: "Missing word" }, res);
    }
    const result = await deleteDefinition(word);
    const count = await queryEntryCount();

    res.json({ count, ...result });
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
