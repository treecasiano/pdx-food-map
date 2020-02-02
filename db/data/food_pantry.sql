-- Table: public.food_pantry
-- DROP TABLE public.food_pantry;
CREATE TABLE public.food_pantry (
  gid serial PRIMARY KEY,
  date_created timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  location_name character varying(250) COLLATE pg_catalog."default",
  street_address_1 character varying(250) COLLATE pg_catalog."default",
  street_address_2 character varying(100) COLLATE pg_catalog."default",
  city character varying(150) COLLATE pg_catalog."default",
  "state" character varying(2) COLLATE pg_catalog."default",
  zip character varying(10) COLLATE pg_catalog."default",
  hours_of_operation character varying(250) COLLATE pg_catalog."default",
  website character varying(250) COLLATE pg_catalog."default",
  phone character varying(15) COLLATE pg_catalog."default",
  geom geometry(Point, 4326)
) WITH (OIDS = FALSE) TABLESPACE pg_default;
ALTER TABLE
  public.food_pantry OWNER to postgres;
-- Index: food_pantry_geom_idx
  -- DROP INDEX public.food_pantry_geom_idx;
  CREATE INDEX food_pantry_geom_idx ON public.food_pantry USING gist (geom) TABLESPACE pg_default;
