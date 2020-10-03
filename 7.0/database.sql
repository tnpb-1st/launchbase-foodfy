CREATE DATABASE foodfy;

CREATE TABLE "chefs" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "file_id" integer,
  "created_at" date NOT NULL DEFAULT (now())
);

CREATE TABLE "recipe_files" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "recipe_id" int,
  "file_id" int
);

CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "name" text,
  "path" text NOT NULL
);

CREATE TABLE "recipes" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "chef_id" int NOT NULL,
  "title" text NOT NULL,
  "ingredients" text[],
  "preparation" text[],
  "information" text,
  "user_id" int NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT 'now()',
  "updated_at" timestamp DEFAULT 'now()'
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "email" text UNIQUE NOT NULL,
  "password" text NOT NULL,
  "reset_token" text,
  "reset_token_expires" text,
  "is_admin" boolean DEFAULT false,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" 
ADD CONSTRAINT "session_pkey" 
PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "chefs" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");

ALTER TABLE "recipe_files" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id");

ALTER TABLE "recipe_files" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");

ALTER TABLE "recipes" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

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

-- delete cascada para quando deletar as receitas ou os arquivos, os relacionamentos
-- serem apagados

ALTER TABLE "recipe_files"
DROP CONSTRAINT recipe_files_recipe_id_fkey,
ADD CONSTRAINT recipe_files_recipe_id_fkey
FOREIGN KEY ("recipe_id")
REFERENCES recipes("id")
ON DELETE CASCADE;

ALTER TABLE "recipe_files"
DROP CONSTRAINT "recipe_files_file_id_fkey",
ADD CONSTRAINT "recipe_files_file_id_fkey"
FOREIGN KEY ("file_id")
REFERENCES "files" ("id")
ON DELETE CASCADE;

ALTER TABLE "chefs"
DROP CONSTRAINT "chefs_file_id_fkey",
ADD CONSTRAINT "chefs_file_id_fkey"
FOREIGN KEY ("file_id")
REFERENCES "files" ("id")
ON DELETE CASCADE;
