--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.19
-- Dumped by pg_dump version 9.5.19

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
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
-- Name: events; Type: TABLE; Schema: public; Owner: cjativa
--

CREATE TABLE public.events (
    id integer NOT NULL,
    event_name character varying NOT NULL,
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone NOT NULL,
    member_only boolean NOT NULL,
    category character varying NOT NULL
);


ALTER TABLE public.events OWNER TO cjativa;

--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: cjativa
--

CREATE SEQUENCE public.events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.events_id_seq OWNER TO cjativa;

--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cjativa
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: cjativa
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    date_placed timestamp with time zone NOT NULL,
    customer_name character varying NOT NULL,
    event_id integer NOT NULL,
    ticket_type_id integer NOT NULL,
    ticket_quantity integer NOT NULL,
    is_member_purchase boolean NOT NULL
);


ALTER TABLE public.orders OWNER TO cjativa;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: cjativa
--

CREATE SEQUENCE public.orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orders_id_seq OWNER TO cjativa;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cjativa
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: tickets; Type: TABLE; Schema: public; Owner: cjativa
--

CREATE TABLE public.tickets (
    name character varying NOT NULL,
    id integer NOT NULL,
    max_purchasable integer NOT NULL,
    price money NOT NULL,
    description character varying NOT NULL
);


ALTER TABLE public.tickets OWNER TO cjativa;

--
-- Name: tickets_id_seq; Type: SEQUENCE; Schema: public; Owner: cjativa
--

CREATE SEQUENCE public.tickets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tickets_id_seq OWNER TO cjativa;

--
-- Name: tickets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cjativa
--

ALTER SEQUENCE public.tickets_id_seq OWNED BY public.tickets.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: cjativa
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: cjativa
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: cjativa
--

ALTER TABLE ONLY public.tickets ALTER COLUMN id SET DEFAULT nextval('public.tickets_id_seq'::regclass);


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: cjativa
--

COPY public.events (id, event_name, start_date, end_date, member_only, category) FROM stdin;
1	General Admission	2020-02-29 23:00:00-05	2020-03-29 00:00:00-04	f	Admissions
2	Member Only Admission	2020-02-29 23:00:00-05	2020-03-20 00:00:00-04	t	Admissions
3	The History and Life of Albert C. Barnes	2020-03-25 00:00:00-04	2020-04-15 00:00:00-04	f	Public Events
4	Free First Sundays	2020-01-31 23:00:00-05	2020-06-01 00:00:00-04	f	Public Events
5	Exhibition of Picasso, Renoir, and Modigliani	2020-01-31 23:00:00-05	2020-04-01 00:00:00-04	f	Exhibitions
\.


--
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cjativa
--

SELECT pg_catalog.setval('public.events_id_seq', 5, true);


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: cjativa
--

COPY public.orders (id, date_placed, customer_name, event_id, ticket_type_id, ticket_quantity, is_member_purchase) FROM stdin;
1	2020-03-11 00:00:00-04	John Doe	2	6	2	t
\.


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cjativa
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, true);


--
-- Data for Name: tickets; Type: TABLE DATA; Schema: public; Owner: cjativa
--

COPY public.tickets (name, id, max_purchasable, price, description) FROM stdin;
Adolescent	1	5	$0.00	For children below the age of 5
Child	2	5	$5.00	For children from ages 5 - 18
Adult	3	10	$25.00	For adults age 18 and over
Senior	4	10	$10.00	For seniors age 65 and over
Member - Child	5	3	$3.00	For children of members, from ages 5 - 18
Member - Adult	6	5	$20.00	For member adults, age 18 and over
Member - Senior	9	5	$6.00	For member seniors, age 65 and over
\.


--
-- Name: tickets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cjativa
--

SELECT pg_catalog.setval('public.tickets_id_seq', 9, true);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

