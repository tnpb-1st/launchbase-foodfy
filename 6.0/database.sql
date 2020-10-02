CREATE DATABASE foodfy;

CREATE TABLE "recipes" (
  "id" SERIAL UNIQUE PRIMARY KEY NOT NULL,
  "chef_id" integer,
  "title" text,
  "ingredients" text[],
  "preparation" text[],
  "information" text,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp DEFAULT 'now()'
);

CREATE TABLE "chefs" (
  "id" SERIAL UNIQUE PRIMARY KEY NOT NULL,
  "name" text,
  "file_id" int NOT NULL
);

CREATE TABLE "files" (
  "id" SERIAL UNIQUE PRIMARY KEY NOT NULL,
  "name" text,
  "path" text NOT NULL
);

CREATE TABLE "recipe_files" (
  "id" SERIAL UNIQUE PRIMARY KEY NOT NULL,
  "recipe_id" int NOT NULL,
  "file_id" int NOT NULL
);

ALTER TABLE "chefs" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");

ALTER TABLE "recipe_files" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id");

ALTER TABLE "recipe_files" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");

CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
