--
-- NOTE:
--
-- File paths need to be edited. Search for $$PATH$$ and
-- replace it with the path to the directory containing
-- the extracted data files.
--
--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.11
-- Dumped by pg_dump version 10.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

DROP TABLE public.lbs_g3_vienna;
DROP SEQUENCE public.seq_vie;
DROP TABLE public.lbs_g3_munich;
DROP TABLE public.lbs_g3_brussels;
DROP EXTENSION postgis;
DROP EXTENSION plpgsql;
DROP SCHEMA public;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry, geography, and raster spatial types and functions';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: lbs_g3_brussels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lbs_g3_brussels (
    user_id bigint,
    created_at timestamp without time zone,
    lang text,
    hashtags text,
    text text,
    point public.geometry(Point,4326),
    arc_id integer
);


ALTER TABLE public.lbs_g3_brussels OWNER TO postgres;

--
-- Name: lbs_g3_munich; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lbs_g3_munich (
    user_id bigint,
    created_at timestamp without time zone,
    lang text,
    hashtags text,
    text text,
    point public.geometry(Point,4326),
    arc_id integer
);


ALTER TABLE public.lbs_g3_munich OWNER TO postgres;

--
-- Name: seq_vie; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_vie
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.seq_vie OWNER TO postgres;

--
-- Name: lbs_g3_vienna; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lbs_g3_vienna (
    user_id bigint,
    created_at timestamp without time zone,
    lang text,
    hashtags text,
    text text,
    point public.geometry(Point,4326),
    arc_id integer DEFAULT nextval('public.seq_vie'::regclass)
);


ALTER TABLE public.lbs_g3_vienna OWNER TO postgres;

--
-- Data for Name: lbs_g3_brussels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lbs_g3_brussels (user_id, created_at, lang, hashtags, text, point, arc_id) FROM stdin;
\.
COPY public.lbs_g3_brussels (user_id, created_at, lang, hashtags, text, point, arc_id) FROM '$$PATH$$/3568.dat';

--
-- Data for Name: lbs_g3_munich; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lbs_g3_munich (user_id, created_at, lang, hashtags, text, point, arc_id) FROM stdin;
\.
COPY public.lbs_g3_munich (user_id, created_at, lang, hashtags, text, point, arc_id) FROM '$$PATH$$/3569.dat';

--
-- Data for Name: lbs_g3_vienna; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lbs_g3_vienna (user_id, created_at, lang, hashtags, text, point, arc_id) FROM stdin;
\.
COPY public.lbs_g3_vienna (user_id, created_at, lang, hashtags, text, point, arc_id) FROM '$$PATH$$/3567.dat';

--
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.spatial_ref_sys (srid, auth_name, auth_srid, srtext, proj4text) FROM stdin;
\.
COPY public.spatial_ref_sys (srid, auth_name, auth_srid, srtext, proj4text) FROM '$$PATH$$/3440.dat';

--
-- Name: seq_vie; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_vie', 18138, true);


--
-- PostgreSQL database dump complete
--

