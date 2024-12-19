--
-- PostgreSQL database dump
--

-- Dumped from database version 16.6
-- Dumped by pg_dump version 16.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: channel_access; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.channel_access AS ENUM (
    'open',
    'restricted'
);


ALTER TYPE public.channel_access OWNER TO neondb_owner;

--
-- Name: message_type; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.message_type AS ENUM (
    'message',
    'announcement'
);


ALTER TYPE public.message_type OWNER TO neondb_owner;

--
-- Name: submission_type; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.submission_type AS ENUM (
    'assignment',
    'phase'
);


ALTER TYPE public.submission_type OWNER TO neondb_owner;

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.user_role AS ENUM (
    'student',
    'instructor',
    'admin'
);


ALTER TYPE public.user_role OWNER TO neondb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: assignment; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.assignment (
    assignment_id integer NOT NULL,
    title text NOT NULL,
    max_grade integer NOT NULL,
    description text,
    due_date date,
    course_code character varying(10)
);


ALTER TABLE public.assignment OWNER TO neondb_owner;

--
-- Name: assignment_assignment_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.assignment_assignment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.assignment_assignment_id_seq OWNER TO neondb_owner;

--
-- Name: assignment_assignment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.assignment_assignment_id_seq OWNED BY public.assignment.assignment_id;


--
-- Name: assignmentsubmission; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.assignmentsubmission (
    submission_id integer NOT NULL,
    assignment_id integer NOT NULL
);


ALTER TABLE public.assignmentsubmission OWNER TO neondb_owner;

--
-- Name: attachment; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.attachment (
    attachment_id integer NOT NULL,
    url text NOT NULL,
    format text
);


ALTER TABLE public.attachment OWNER TO neondb_owner;

--
-- Name: attachment_attachment_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.attachment_attachment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attachment_attachment_id_seq OWNER TO neondb_owner;

--
-- Name: attachment_attachment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.attachment_attachment_id_seq OWNED BY public.attachment.attachment_id;


--
-- Name: badge; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.badge (
    badge_id integer NOT NULL,
    picture text NOT NULL,
    title text NOT NULL,
    description text
);


ALTER TABLE public.badge OWNER TO neondb_owner;

--
-- Name: badge_badge_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.badge_badge_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.badge_badge_id_seq OWNER TO neondb_owner;

--
-- Name: badge_badge_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.badge_badge_id_seq OWNED BY public.badge.badge_id;


--
-- Name: channel; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.channel (
    channel_name text NOT NULL,
    channel_num integer NOT NULL,
    group_id integer NOT NULL,
    channel_type public.channel_access NOT NULL
);


ALTER TABLE public.channel OWNER TO neondb_owner;

--
-- Name: chat_group; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.chat_group (
    group_id integer NOT NULL,
    group_name text NOT NULL
);


ALTER TABLE public.chat_group OWNER TO neondb_owner;

--
-- Name: chat_group_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.chat_group_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chat_group_seq OWNER TO neondb_owner;

--
-- Name: chat_group_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.chat_group_seq OWNED BY public.chat_group.group_id;


--
-- Name: course; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.course (
    course_code character varying(10) NOT NULL,
    course_name text NOT NULL,
    course_img text,
    course_description text,
    instructor_id character varying(32),
    max_grade integer NOT NULL
);


ALTER TABLE public.course OWNER TO neondb_owner;

--
-- Name: earnedbadges; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.earnedbadges (
    student_id character varying(32) NOT NULL,
    badge_id integer NOT NULL,
    earned_at date DEFAULT CURRENT_DATE
);


ALTER TABLE public.earnedbadges OWNER TO neondb_owner;

--
-- Name: enrollment; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.enrollment (
    student_id character varying(32) NOT NULL,
    course_code character varying(10) NOT NULL
);


ALTER TABLE public.enrollment OWNER TO neondb_owner;

--
-- Name: message; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.message (
    message_id integer NOT NULL,
    channel_num integer,
    group_id integer,
    time_stamp timestamp without time zone DEFAULT now(),
    type public.message_type NOT NULL,
    content text NOT NULL,
    sender_id character varying(32)
);


ALTER TABLE public.message OWNER TO neondb_owner;

--
-- Name: message_message_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.message_message_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.message_message_id_seq OWNER TO neondb_owner;

--
-- Name: message_message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.message_message_id_seq OWNED BY public.message.message_id;


--
-- Name: messageattachment; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.messageattachment (
    message_id integer NOT NULL,
    attachment_id integer NOT NULL
);


ALTER TABLE public.messageattachment OWNER TO neondb_owner;

--
-- Name: messageread; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.messageread (
    lastmessageread_id integer NOT NULL,
    user_id character varying(32) NOT NULL,
    readat timestamp without time zone
);


ALTER TABLE public.messageread OWNER TO neondb_owner;

--
-- Name: participation; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.participation (
    student_id character varying(32) NOT NULL,
    project_id integer NOT NULL,
    team_num integer NOT NULL,
    leader boolean
);


ALTER TABLE public.participation OWNER TO neondb_owner;

--
-- Name: phase; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.phase (
    project_id integer NOT NULL,
    phase_num integer NOT NULL,
    phase_name text,
    phase_load integer NOT NULL,
    deadline date,
    description text
);


ALTER TABLE public.phase OWNER TO neondb_owner;

--
-- Name: phasesubmission; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.phasesubmission (
    submission_id integer NOT NULL,
    project_id integer NOT NULL,
    phase_num integer NOT NULL
);


ALTER TABLE public.phasesubmission OWNER TO neondb_owner;

--
-- Name: project; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.project (
    project_id integer NOT NULL,
    project_name text NOT NULL,
    course_code character varying(10),
    start_date date DEFAULT CURRENT_DATE,
    end_date date,
    description text,
    max_team_size integer,
    max_grade integer
);


ALTER TABLE public.project OWNER TO neondb_owner;

--
-- Name: project_project_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.project_project_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.project_project_id_seq OWNER TO neondb_owner;

--
-- Name: project_project_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.project_project_id_seq OWNED BY public.project.project_id;


--
-- Name: review; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.review (
    reviewer_id character varying(32) NOT NULL,
    reviewee_id character varying(32) NOT NULL,
    project_id integer NOT NULL,
    content text,
    rating integer
);


ALTER TABLE public.review OWNER TO neondb_owner;

--
-- Name: submission; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.submission (
    submission_id integer NOT NULL,
    type public.submission_type NOT NULL,
    student_id character varying(32) NOT NULL,
    grade integer,
    submission_date date DEFAULT now()
);


ALTER TABLE public.submission OWNER TO neondb_owner;

--
-- Name: submission_submission_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.submission_submission_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.submission_submission_id_seq OWNER TO neondb_owner;

--
-- Name: submission_submission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.submission_submission_id_seq OWNED BY public.submission.submission_id;


--
-- Name: submissionattachment; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.submissionattachment (
    attachment_id integer NOT NULL,
    submission_id integer NOT NULL
);


ALTER TABLE public.submissionattachment OWNER TO neondb_owner;

--
-- Name: team; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.team (
    project_id integer NOT NULL,
    team_num integer NOT NULL,
    team_name text
);


ALTER TABLE public.team OWNER TO neondb_owner;

--
-- Name: technology; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.technology (
    project_id integer NOT NULL,
    team_num integer NOT NULL,
    technology text NOT NULL
);


ALTER TABLE public.technology OWNER TO neondb_owner;

--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    user_id character varying(32) NOT NULL,
    fname text NOT NULL,
    lname text NOT NULL,
    role public.user_role NOT NULL,
    img_url text,
    username text
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: assignment assignment_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.assignment ALTER COLUMN assignment_id SET DEFAULT nextval('public.assignment_assignment_id_seq'::regclass);


--
-- Name: attachment attachment_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attachment ALTER COLUMN attachment_id SET DEFAULT nextval('public.attachment_attachment_id_seq'::regclass);


--
-- Name: badge badge_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.badge ALTER COLUMN badge_id SET DEFAULT nextval('public.badge_badge_id_seq'::regclass);


--
-- Name: chat_group group_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.chat_group ALTER COLUMN group_id SET DEFAULT (nextval('public.chat_group_seq'::regclass) + 1);


--
-- Name: message message_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.message ALTER COLUMN message_id SET DEFAULT nextval('public.message_message_id_seq'::regclass);


--
-- Name: project project_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.project ALTER COLUMN project_id SET DEFAULT nextval('public.project_project_id_seq'::regclass);


--
-- Name: submission submission_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.submission ALTER COLUMN submission_id SET DEFAULT nextval('public.submission_submission_id_seq'::regclass);


--
-- Name: assignment assignment_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.assignment
    ADD CONSTRAINT assignment_pkey PRIMARY KEY (assignment_id);


--
-- Name: assignmentsubmission assignmentsubmission_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.assignmentsubmission
    ADD CONSTRAINT assignmentsubmission_pkey PRIMARY KEY (submission_id, assignment_id);


--
-- Name: attachment attachment_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attachment
    ADD CONSTRAINT attachment_pkey PRIMARY KEY (attachment_id);


--
-- Name: badge badge_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.badge
    ADD CONSTRAINT badge_pkey PRIMARY KEY (badge_id);


--
-- Name: channel channel_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.channel
    ADD CONSTRAINT channel_pkey PRIMARY KEY (channel_num, group_id);


--
-- Name: chat_group chat_group_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.chat_group
    ADD CONSTRAINT chat_group_pkey PRIMARY KEY (group_id);


--
-- Name: course course_instructor_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_instructor_id_key UNIQUE (instructor_id);


--
-- Name: course course_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_pkey PRIMARY KEY (course_code);


--
-- Name: earnedbadges earnedbadges_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.earnedbadges
    ADD CONSTRAINT earnedbadges_pkey PRIMARY KEY (student_id, badge_id);


--
-- Name: enrollment enrollment_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.enrollment
    ADD CONSTRAINT enrollment_pkey PRIMARY KEY (student_id, course_code);


--
-- Name: message message_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_pkey PRIMARY KEY (message_id);


--
-- Name: messageattachment messageattachment_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.messageattachment
    ADD CONSTRAINT messageattachment_pkey PRIMARY KEY (message_id, attachment_id);


--
-- Name: messageread messageread_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.messageread
    ADD CONSTRAINT messageread_pkey PRIMARY KEY (lastmessageread_id, user_id);


--
-- Name: participation participation_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.participation
    ADD CONSTRAINT participation_pkey PRIMARY KEY (student_id, project_id, team_num);


--
-- Name: phase phase_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.phase
    ADD CONSTRAINT phase_pkey PRIMARY KEY (project_id, phase_num);


--
-- Name: phasesubmission phasesubmission_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.phasesubmission
    ADD CONSTRAINT phasesubmission_pkey PRIMARY KEY (submission_id, project_id, phase_num);


--
-- Name: project project_course_code_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT project_course_code_key UNIQUE (course_code);


--
-- Name: project project_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT project_pkey PRIMARY KEY (project_id);


--
-- Name: review review_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_pkey PRIMARY KEY (reviewer_id, reviewee_id, project_id);


--
-- Name: submission submission_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.submission
    ADD CONSTRAINT submission_pkey PRIMARY KEY (submission_id);


--
-- Name: submissionattachment submissionattachment_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.submissionattachment
    ADD CONSTRAINT submissionattachment_pkey PRIMARY KEY (attachment_id, submission_id);


--
-- Name: team team_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.team
    ADD CONSTRAINT team_pkey PRIMARY KEY (project_id, team_num);


--
-- Name: technology technology_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.technology
    ADD CONSTRAINT technology_pkey PRIMARY KEY (project_id, team_num, technology);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: assignment assignment_course_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.assignment
    ADD CONSTRAINT assignment_course_code_fkey FOREIGN KEY (course_code) REFERENCES public.course(course_code) ON DELETE CASCADE;


--
-- Name: assignmentsubmission assignmentsubmission_assignment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.assignmentsubmission
    ADD CONSTRAINT assignmentsubmission_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES public.assignment(assignment_id) ON DELETE CASCADE;


--
-- Name: assignmentsubmission assignmentsubmission_submission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.assignmentsubmission
    ADD CONSTRAINT assignmentsubmission_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.submission(submission_id) ON DELETE CASCADE;


--
-- Name: channel channel_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.channel
    ADD CONSTRAINT channel_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.chat_group(group_id) ON DELETE CASCADE;


--
-- Name: course course_instructor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_instructor_id_fkey FOREIGN KEY (instructor_id) REFERENCES public.users(user_id) ON DELETE SET NULL;


--
-- Name: earnedbadges earnedbadges_badge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.earnedbadges
    ADD CONSTRAINT earnedbadges_badge_id_fkey FOREIGN KEY (badge_id) REFERENCES public.badge(badge_id) ON DELETE CASCADE;


--
-- Name: earnedbadges earnedbadges_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.earnedbadges
    ADD CONSTRAINT earnedbadges_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: enrollment enrollment_course_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.enrollment
    ADD CONSTRAINT enrollment_course_code_fkey FOREIGN KEY (course_code) REFERENCES public.course(course_code) ON DELETE CASCADE;


--
-- Name: enrollment enrollment_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.enrollment
    ADD CONSTRAINT enrollment_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: message message_channel_num_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_channel_num_group_id_fkey FOREIGN KEY (channel_num, group_id) REFERENCES public.channel(channel_num, group_id) ON DELETE CASCADE;


--
-- Name: message message_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: messageattachment messageattachment_attachment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.messageattachment
    ADD CONSTRAINT messageattachment_attachment_id_fkey FOREIGN KEY (attachment_id) REFERENCES public.attachment(attachment_id) ON DELETE CASCADE;


--
-- Name: messageattachment messageattachment_message_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.messageattachment
    ADD CONSTRAINT messageattachment_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.message(message_id) ON DELETE CASCADE;


--
-- Name: messageread messageread_lastmessageread_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.messageread
    ADD CONSTRAINT messageread_lastmessageread_id_fkey FOREIGN KEY (lastmessageread_id) REFERENCES public.message(message_id) ON DELETE SET NULL;


--
-- Name: messageread messageread_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.messageread
    ADD CONSTRAINT messageread_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: participation participation_project_id_team_num_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.participation
    ADD CONSTRAINT participation_project_id_team_num_fkey FOREIGN KEY (project_id, team_num) REFERENCES public.team(project_id, team_num) ON DELETE CASCADE;


--
-- Name: participation participation_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.participation
    ADD CONSTRAINT participation_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(user_id) ON DELETE SET NULL;


--
-- Name: phase phase_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.phase
    ADD CONSTRAINT phase_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.project(project_id) ON DELETE CASCADE;


--
-- Name: phasesubmission phasesubmission_project_id_phase_num_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.phasesubmission
    ADD CONSTRAINT phasesubmission_project_id_phase_num_fkey FOREIGN KEY (project_id, phase_num) REFERENCES public.phase(project_id, phase_num) ON DELETE CASCADE;


--
-- Name: phasesubmission phasesubmission_submission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.phasesubmission
    ADD CONSTRAINT phasesubmission_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.submission(submission_id) ON DELETE CASCADE;


--
-- Name: project project_course_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT project_course_code_fkey FOREIGN KEY (course_code) REFERENCES public.course(course_code) ON DELETE SET NULL;


--
-- Name: review review_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.project(project_id) ON DELETE CASCADE;


--
-- Name: review review_reviewee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_reviewee_id_fkey FOREIGN KEY (reviewee_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: review review_reviewer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: submission submission_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.submission
    ADD CONSTRAINT submission_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: submissionattachment submissionattachment_attachment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.submissionattachment
    ADD CONSTRAINT submissionattachment_attachment_id_fkey FOREIGN KEY (attachment_id) REFERENCES public.attachment(attachment_id) ON DELETE CASCADE;


--
-- Name: submissionattachment submissionattachment_submission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.submissionattachment
    ADD CONSTRAINT submissionattachment_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.submission(submission_id) ON DELETE CASCADE;


--
-- Name: team team_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.team
    ADD CONSTRAINT team_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.project(project_id) ON DELETE CASCADE;


--
-- Name: technology technology_project_id_team_num_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.technology
    ADD CONSTRAINT technology_project_id_team_num_fkey FOREIGN KEY (project_id, team_num) REFERENCES public.team(project_id, team_num);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

