-- Database: bixi

-- DROP DATABASE IF EXISTS bixi;

CREATE DATABASE bixi
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_Canada.1252'
    LC_CTYPE = 'English_Canada.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;


    -- Table: public.locations

-- DROP TABLE IF EXISTS public.locations;

CREATE TABLE IF NOT EXISTS public.locations
(
    id integer NOT NULL DEFAULT nextval('locations_id_seq'::regclass),
    hub_location character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT locations_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.locations
    OWNER to postgres;


-- Table: public.bikes

-- DROP TABLE IF EXISTS public.bikes;

CREATE TABLE IF NOT EXISTS public.bikes
(
    id integer NOT NULL DEFAULT nextval('bikes_id_seq'::regclass),
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    damage boolean,
    location_id integer,
    available boolean,
    CONSTRAINT bikes_pkey PRIMARY KEY (id),
    CONSTRAINT location_id FOREIGN KEY (location_id)
        REFERENCES public.locations (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.bikes
    OWNER to postgres;
-- Index: fki_location_id

-- DROP INDEX IF EXISTS public.fki_location_id;

CREATE INDEX IF NOT EXISTS fki_location_id
    ON public.bikes USING btree
    (location_id ASC NULLS LAST)
    TABLESPACE pg_default;

-- Index: fki_location_id

-- DROP INDEX IF EXISTS public.fki_location_id;

CREATE INDEX IF NOT EXISTS fki_location_id
    ON public.bikes USING btree
    (location_id ASC NULLS LAST)
    TABLESPACE pg_default;




-- Table: public.rentals

-- DROP TABLE IF EXISTS public.rentals;

CREATE TABLE IF NOT EXISTS public.rentals
(
    id integer NOT NULL DEFAULT nextval('rentals_id_seq'::regclass),
    user_id integer,
    location_id integer,
    bike_id integer,
    start_time timestamp without time zone,
    end_time timestamp without time zone,
    CONSTRAINT rentals_pkey PRIMARY KEY (id),
    CONSTRAINT rentals_bike_id_fkey FOREIGN KEY (bike_id)
        REFERENCES public.bikes (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT rentals_location_id_fkey FOREIGN KEY (location_id)
        REFERENCES public.locations (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT rentals_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.rentals
    OWNER to postgres;
	
	
-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    email character varying(255) COLLATE pg_catalog."default",
    password character varying(255) COLLATE pg_catalog."default",
    "createdAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    firstname character varying(255) COLLATE pg_catalog."default",
    lastname character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT users_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;