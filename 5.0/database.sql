CREATE DATABASE foodfy;

CREATE TABLE "recipes" (
  "id" SERIAL UNIQUE PRIMARY KEY NOT NULL,
  "chef_id" integer,
  "title" text,
  "ingredients" text[],
  "preparation" text[],
  "information" text,
  "created_at" date NOT NULL DEFAULT (now())
);

CREATE TABLE "chefs" (
  "id" SERIAL UNIQUE PRIMARY KEY NOT NULL,
  "name" text,
  "file_id" int NOT NULL,
  "created_at" date
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
