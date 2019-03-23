--
-- PostgreSQL database dump
--

-- Dumped from database version 10.7 (Debian 10.7-1.pgdg90+1)
-- Dumped by pg_dump version 10.7 (Debian 10.7-1.pgdg90+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: hello_table; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hello_table (
    user_id integer NOT NULL,
    username character varying(50) NOT NULL,
    created_on timestamp with time zone NOT NULL,
    first_name character varying(100),
    last_name character varying(100),
    favorite_color character varying(50)
);


ALTER TABLE public.hello_table OWNER TO postgres;

--
-- Name: account_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.account_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.account_user_id_seq OWNER TO postgres;

--
-- Name: account_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.account_user_id_seq OWNED BY public.hello_table.user_id;


--
-- Name: hello_table user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hello_table ALTER COLUMN user_id SET DEFAULT nextval('public.account_user_id_seq'::regclass);


--
-- Data for Name: hello_table; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hello_table (user_id, username, created_on, first_name, last_name, favorite_color) FROM stdin;
2	rkd	2019-03-23 17:55:39.339483+00	Roberto	Serra	black
1	blackbird127	2019-03-23 17:30:01.639481+00	Tereza	Averescu	teal
3	northstar27	2019-03-23 18:00:39.369594+00	Anthea	Christopoulos	chartreuse
4	meridianprime	2019-03-23 18:01:46.522031+00	Cristofer	Romano	burgundy
5	melodia	2019-03-23 18:02:41.248391+00	Adalynd	Jones	black
6	mixolydia	2019-03-23 18:04:01.980239+00	Yzobel	Mirren	green
7	craftywench	2019-03-23 18:05:41.260574+00	Evelyn	Dunlap	navy blue
\.


--
-- Name: account_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.account_user_id_seq', 7, true);


--
-- Name: hello_table account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hello_table
    ADD CONSTRAINT account_pkey PRIMARY KEY (user_id);


--
-- Name: hello_table account_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hello_table
    ADD CONSTRAINT account_username_key UNIQUE (username);


--
-- PostgreSQL database dump complete
--

