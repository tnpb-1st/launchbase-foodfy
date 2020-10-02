CREATE DATABASE "foodfy"

CREATE TABLE "recipes" (
  "id" SERIAL UNIQUE PRIMARY KEY NOT NULL,
  "chef_id" integer,
  "image" text,
  "title" text,
  "ingredients" text[],
  "preparation" text[],
  "information" text,
  "created_at" date NOT NULL DEFAULT (now())
);

CREATE TABLE "chefs" (
  "id" SERIAL UNIQUE PRIMARY KEY NOT NULL,
  "name" text,
  "avatar_url" text,
  "created_at" date
);
