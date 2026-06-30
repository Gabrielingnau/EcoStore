SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict FAs8O6ByNotHnKEO0j51P1f6CZtNRDlLDR1QeriGFZbEiWzKLXlHgbK8WHCxRYS

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at", "invite_token", "referrer", "oauth_client_state_id", "linking_target_id", "email_optional") VALUES
	('f36045fe-5b5d-451a-997f-d442ed6e37dc', '0994d61d-0405-4dad-9d6b-6dff5d8f0f50', 'cf192b95-ff72-4a76-9d41-ec4c82ee7ded', 's256', '2wFr2iEacblYSCxP4YmRZ5MMvueUoY-ddT08590xPYU', 'email', '', '', '2026-05-09 05:00:58.806733+00', '2026-05-09 05:00:58.806733+00', 'email/signup', NULL, NULL, NULL, NULL, NULL, false),
	('0f3418bc-5386-453e-83eb-d03e9e64b18e', '0994d61d-0405-4dad-9d6b-6dff5d8f0f50', '7b9475fb-4fe6-411e-ae6b-8171ec1d3d54', 's256', 'pZ8815Kc1c67ujitpnZPkTutXNNI2JcDuOX3-x1hAe4', 'email', '', '', '2026-05-09 05:02:19.790005+00', '2026-05-09 05:02:19.790005+00', 'email/signup', NULL, NULL, NULL, NULL, NULL, false),
	('3a52ee2a-4dd0-4628-afd2-2df45dc2b4fa', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '696e7c6b-c4c3-4866-865c-d5153288fb28', 's256', '-LFpeqUtgtlpFqxlyYN7sbYilwz12APF3Hqk1hUMAYs', 'recovery', '', '', '2026-05-13 03:22:07.627133+00', '2026-05-13 03:22:28.568904+00', 'recovery', '2026-05-13 03:22:28.568854+00', NULL, NULL, NULL, NULL, false),
	('7bbdff39-f185-419b-83ca-bb836c1481b0', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '980676dc-1a4f-4a3c-b38f-88ce39436dc1', 's256', '5204xP3TTyC5bO2SLzsAm5ebTHAYJe6RcYvHsS9UXho', 'recovery', '', '', '2026-05-13 03:28:26.318797+00', '2026-05-13 03:28:43.780807+00', 'recovery', '2026-05-13 03:28:43.78076+00', NULL, NULL, NULL, NULL, false),
	('58584db2-979d-4278-9c6b-088b8c38e244', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', 'e7c6a26d-1d7d-4fe1-a0f2-b46ce25af2d2', 's256', 'Zx7J79Pmsy5mOC4PewNuwWvOUEiY7Mz2nJi-lu1cOWo', 'recovery', '', '', '2026-05-13 03:35:03.423561+00', '2026-05-13 03:35:12.107633+00', 'recovery', '2026-05-13 03:35:12.107578+00', NULL, NULL, NULL, NULL, false),
	('93f06a6c-318d-44f4-aaa7-ef4ebbe7c443', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', 'd07f4420-cde2-4b77-9962-8ed12787d277', 's256', 'HMCl6ET_r9MF7qM3EYShgKT0DbpSTkyAYr4pJQcQULs', 'recovery', '', '', '2026-05-13 04:02:12.563375+00', '2026-05-13 04:02:25.18952+00', 'recovery', '2026-05-13 04:02:25.18947+00', NULL, NULL, NULL, NULL, false),
	('14228846-9068-46c1-8bd3-ad92dc10b9bb', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '11b4c13b-ac08-4581-bee5-a57328d9ffcb', 's256', 'w5Zvgp4YTWBGOtBcz5lTmvfjOvG83YD63dk78txAkok', 'recovery', '', '', '2026-05-13 04:06:12.515535+00', '2026-05-13 04:06:21.743934+00', 'recovery', '2026-05-13 04:06:21.743873+00', NULL, NULL, NULL, NULL, false),
	('ccc8843a-9f44-45a6-8d26-30e51125e2cb', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '7a638a0f-ae0b-4eb1-b387-217b7a1673ba', 's256', 'iZ8SLfUC2_13HUXjjxWHPVVFbmlhNJg_vAe26iC1VUU', 'recovery', '', '', '2026-05-13 04:06:52.885473+00', '2026-05-13 04:06:52.885473+00', 'recovery', NULL, NULL, NULL, NULL, NULL, false),
	('210078c8-e3c1-4e25-8e3e-99efefea5f0c', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '37b332e6-720c-4bff-94da-03d1839abcff', 's256', 'tt50_jIPr2380GQFUAmyKe9S27o2CCG7s7ciipy2BA4', 'recovery', '', '', '2026-05-13 04:07:00.901399+00', '2026-05-13 04:07:00.901399+00', 'recovery', NULL, NULL, NULL, NULL, NULL, false),
	('720eae0f-57cc-4a81-b569-8a32c73900f7', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '8c996a38-a09f-4294-ad6f-89b26f3f0d98', 's256', 'Q3uEfuulgAlqj3-JYe9zbzAcIABjPrDLx8hGNCQJ8_g', 'recovery', '', '', '2026-05-13 04:07:21.997962+00', '2026-05-13 04:07:33.300524+00', 'recovery', '2026-05-13 04:07:33.300475+00', NULL, NULL, NULL, NULL, false),
	('18ded8f7-61be-4dc7-9e84-cbfb2bebf0d5', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '250c431b-ddf6-49a5-911e-a87cddf0a14b', 's256', 'CQyn4r_-5Ue-z7vd2SaKIy7lvwUWAEXstZTITVdaRu4', 'recovery', '', '', '2026-05-13 04:10:45.543329+00', '2026-05-13 04:10:53.62283+00', 'recovery', '2026-05-13 04:10:53.622782+00', NULL, NULL, NULL, NULL, false),
	('b7283cf2-e637-45e9-b8ea-4a84c5e79e41', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '7c912275-e2fa-4810-9a88-20cfad50d6f8', 's256', 'MoUE3p-h2NRGIVUQszrgemJxFcLA5PdkoWeFQe2lOWs', 'recovery', '', '', '2026-05-13 04:12:46.927527+00', '2026-05-13 04:12:54.256139+00', 'recovery', '2026-05-13 04:12:54.25609+00', NULL, NULL, NULL, NULL, false);


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'e0163127-71a6-4915-a882-e390dde0cbe0', 'authenticated', 'authenticated', 'teste@gmail.com', '$2a$10$ZoTv7cA7OIgFBW766VYZmeah7CQMt0X2C17rgvdMoWkTNTdLnvrnu', '2026-05-13 00:11:15.300079+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-06-15 14:09:54.861043+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "e0163127-71a6-4915-a882-e390dde0cbe0", "email": "teste@gmail.com", "display_name": "teste", "email_verified": true, "phone_verified": false}', NULL, '2026-05-13 00:11:15.27931+00', '2026-06-15 14:09:54.869381+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', 'authenticated', 'authenticated', 'gabrielingnau@gmail.com', '$2a$10$qpLziIs2YgU68yXZA2mHOu9OyZvcXzAt.tuS14i7I2XjnY3DZZ64G', '2026-05-09 05:13:37.091592+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-06-15 14:32:15.030036+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "d92ab428-f962-4c1e-8ae8-976c9ed85bf1", "email": "gabrielingnau@gmail.com", "phone": "(66) 99244-4525", "display_name": "Gabriel", "email_verified": true, "phone_verified": false}', NULL, '2026-05-09 05:13:37.07236+00', '2026-06-18 23:22:08.334335+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('d92ab428-f962-4c1e-8ae8-976c9ed85bf1', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '{"sub": "d92ab428-f962-4c1e-8ae8-976c9ed85bf1", "email": "gabrielingnau@gmail.com", "phone": "(66) 99244-4525", "display_name": "Gabriel", "email_verified": false, "phone_verified": false}', 'email', '2026-05-09 05:13:37.088423+00', '2026-05-09 05:13:37.088467+00', '2026-05-09 05:13:37.088467+00', '3ef93b75-a193-4cef-8404-2884421bddf3'),
	('e0163127-71a6-4915-a882-e390dde0cbe0', 'e0163127-71a6-4915-a882-e390dde0cbe0', '{"sub": "e0163127-71a6-4915-a882-e390dde0cbe0", "email": "teste@gmail.com", "display_name": "teste", "email_verified": false, "phone_verified": false}', 'email', '2026-05-13 00:11:15.296109+00', '2026-05-13 00:11:15.296178+00', '2026-05-13 00:11:15.296178+00', '4d78043d-bbbc-4f7b-adf9-e909ae9a8cb9');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") VALUES
	('8793e7b3-3196-4aa6-a6bf-522194f31e37', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '2026-06-15 14:32:15.032328+00', '2026-06-18 23:22:08.347927+00', NULL, 'aal1', NULL, '2026-06-18 23:22:08.347811', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15', '186.250.16.206', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('8793e7b3-3196-4aa6-a6bf-522194f31e37', '2026-06-15 14:32:15.073791+00', '2026-06-15 14:32:15.073791+00', 'password', '89a53845-304d-416b-a9e0-9102628a5634');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 146, 'ptwvndnwqron', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', true, '2026-06-15 14:32:15.051729+00', '2026-06-15 16:15:12.149783+00', NULL, '8793e7b3-3196-4aa6-a6bf-522194f31e37'),
	('00000000-0000-0000-0000-000000000000', 147, 'nd2kxljztbpp', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', true, '2026-06-15 16:15:12.172229+00', '2026-06-15 17:14:03.87899+00', 'ptwvndnwqron', '8793e7b3-3196-4aa6-a6bf-522194f31e37'),
	('00000000-0000-0000-0000-000000000000', 148, 'jswtwuvcbrot', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', true, '2026-06-15 17:14:03.895031+00', '2026-06-15 18:12:29.823782+00', 'nd2kxljztbpp', '8793e7b3-3196-4aa6-a6bf-522194f31e37'),
	('00000000-0000-0000-0000-000000000000', 149, 'yekz4lysjike', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', true, '2026-06-15 18:12:29.846359+00', '2026-06-15 19:25:47.060947+00', 'jswtwuvcbrot', '8793e7b3-3196-4aa6-a6bf-522194f31e37'),
	('00000000-0000-0000-0000-000000000000', 150, '6vev3qwodw3j', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', true, '2026-06-15 19:25:47.082604+00', '2026-06-15 21:05:51.785205+00', 'yekz4lysjike', '8793e7b3-3196-4aa6-a6bf-522194f31e37'),
	('00000000-0000-0000-0000-000000000000', 151, 'rzrcay6potgs', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', true, '2026-06-15 21:05:51.798813+00', '2026-06-16 01:31:40.447754+00', '6vev3qwodw3j', '8793e7b3-3196-4aa6-a6bf-522194f31e37'),
	('00000000-0000-0000-0000-000000000000', 152, '7lpyrhh4njv5', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', true, '2026-06-16 01:31:40.466801+00', '2026-06-16 12:41:43.159189+00', 'rzrcay6potgs', '8793e7b3-3196-4aa6-a6bf-522194f31e37'),
	('00000000-0000-0000-0000-000000000000', 153, 'wsqzv2lehhxi', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', true, '2026-06-16 12:41:43.17885+00', '2026-06-16 13:53:01.673621+00', '7lpyrhh4njv5', '8793e7b3-3196-4aa6-a6bf-522194f31e37'),
	('00000000-0000-0000-0000-000000000000', 154, 'mafn3b45jmvq', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', true, '2026-06-16 13:53:01.692683+00', '2026-06-16 14:58:11.063269+00', 'wsqzv2lehhxi', '8793e7b3-3196-4aa6-a6bf-522194f31e37'),
	('00000000-0000-0000-0000-000000000000', 155, 'kq2je7ewolul', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', true, '2026-06-16 14:58:11.084356+00', '2026-06-16 16:08:19.348927+00', 'mafn3b45jmvq', '8793e7b3-3196-4aa6-a6bf-522194f31e37'),
	('00000000-0000-0000-0000-000000000000', 156, 'xqrmjnmaa6zv', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', true, '2026-06-16 16:08:19.358907+00', '2026-06-16 17:24:36.694791+00', 'kq2je7ewolul', '8793e7b3-3196-4aa6-a6bf-522194f31e37'),
	('00000000-0000-0000-0000-000000000000', 157, 'skdvltxckowf', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', true, '2026-06-16 17:24:36.70506+00', '2026-06-16 18:49:10.116522+00', 'xqrmjnmaa6zv', '8793e7b3-3196-4aa6-a6bf-522194f31e37'),
	('00000000-0000-0000-0000-000000000000', 158, '6vsul24et7dw', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', true, '2026-06-16 18:49:10.131589+00', '2026-06-16 19:51:17.117881+00', 'skdvltxckowf', '8793e7b3-3196-4aa6-a6bf-522194f31e37'),
	('00000000-0000-0000-0000-000000000000', 159, 'ggkpmbbws6kn', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', true, '2026-06-16 19:51:17.130739+00', '2026-06-17 21:45:58.131568+00', '6vsul24et7dw', '8793e7b3-3196-4aa6-a6bf-522194f31e37'),
	('00000000-0000-0000-0000-000000000000', 160, 'hod4geh7ucmh', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', true, '2026-06-17 21:45:58.139353+00', '2026-06-18 11:20:40.99581+00', 'ggkpmbbws6kn', '8793e7b3-3196-4aa6-a6bf-522194f31e37'),
	('00000000-0000-0000-0000-000000000000', 161, 'qtgahe2j4amq', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', true, '2026-06-18 11:20:41.021683+00', '2026-06-18 12:19:49.712465+00', 'hod4geh7ucmh', '8793e7b3-3196-4aa6-a6bf-522194f31e37'),
	('00000000-0000-0000-0000-000000000000', 162, '5vaqxrxbxdci', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', true, '2026-06-18 12:19:49.723865+00', '2026-06-18 13:32:43.322883+00', 'qtgahe2j4amq', '8793e7b3-3196-4aa6-a6bf-522194f31e37'),
	('00000000-0000-0000-0000-000000000000', 163, 'd6celqgiz6lm', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', true, '2026-06-18 13:32:43.340557+00', '2026-06-18 14:31:06.7281+00', '5vaqxrxbxdci', '8793e7b3-3196-4aa6-a6bf-522194f31e37'),
	('00000000-0000-0000-0000-000000000000', 164, 'fsybuxd2yjzj', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', true, '2026-06-18 14:31:06.738863+00', '2026-06-18 23:22:08.311329+00', 'd6celqgiz6lm', '8793e7b3-3196-4aa6-a6bf-522194f31e37'),
	('00000000-0000-0000-0000-000000000000', 165, 'uq7yjk6waknr', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', false, '2026-06-18 23:22:08.325674+00', '2026-06-18 23:22:08.325674+00', 'fsybuxd2yjzj', '8793e7b3-3196-4aa6-a6bf-522194f31e37');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: integrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."integrations" ("provider", "access_token", "refresh_token", "expires_at", "created_at", "singleton_id") VALUES
	('melhor_envio', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5ODQ1IiwianRpIjoiYzhjODUxODM2NjBhYmFkMWE2YjU0OWQ3N2VmZjA0NTIyMDdmODMwOTU0YzY0ZjQ2YTczYzIxYzI0OGZkMzBjMmEzMjBkMzY1OWVjODAyM2EiLCJpYXQiOjE3ODE2Mzc3OTMuOTU2NzQ4LCJuYmYiOjE3ODE2Mzc3OTMuOTU2NzUxLCJleHAiOjE3ODQyMjk3OTMuOTMxNzUyLCJzdWIiOiJhMjAwOWFiYy1hOTIxLTRhZGYtYWVlOC05ZmY4ZmU0MTNlMDMiLCJzY29wZXMiOlsic2hpcHBpbmctY2FsY3VsYXRlIiwic2hpcHBpbmctY2hlY2tvdXQiLCJzaGlwcGluZy1wcmludCIsImNhcnQtd3JpdGUiLCJjYXJ0LXJlYWQiLCJzaGlwcGluZy10cmFja2luZyJdfQ.rbsVuyB2RgWRiWYtI5JomQ2iFyDB8w_TbVKLct5mkQiDtaIB6_346P0kmTKAWBr_63ysiobyUT-cEzLFdyYezu8J4SUFaAYlA7f9RQJeBiEmy-HIubrQER_tToPQqK93keD_3q4UDQX8KtqtITUsD8_ySTJZbTFfINQ8jh2cASJIsEnWk0GclakB7MnNHxEh2kJ4bKn5em8D14YjY9d4CZn6ukmbIpZPdL3xwudnDI7hOLa2J8AqAgmKD9XMvj-_HPdt7Cjn3BrlSX0ShmziLYm9W4RtfOI8oBOOkQtMvFhhriE9OsrJbd8HEFcKCANZV9bV9nLHcHuAtaoiSLrPZ-4owcSk2znmU2XwwCdYYuvCoUtH0Kua7e9R-8cmmDLlZWSP5R3yXxM0ZmOBve8RIcqd_jSDBA66-VfmoQ52OHZFbu1-Mu0EhGvgUXO3PH8Vb2wjGD0h9rVDAgkntjwiDt1Xjqjj15Cdbe8TNmwNQIBFZxNPlVByvqNj3LBRlyjvHE1xnOcdDBKHxksLiO3Z8P3kAufDN5P3EMbXCcwmSfmNWlSI8YQO6BxQ9c_LFcwDoO5dRQ_CesLIX5XCLv4mlSJSz6haXRendKfvcuKSKUCAzlVi9ChdgMtirNtvbIj2riZjd_IlDCep3lesfVZXjT706iV52VO6-wajgKKFGRE', 'def50200720367949aa5f69773d35bd84f99404948c990bb88cb6d564039d6509b40685eb7ff97ed80d4bd16ac438183f20543e0e10b1cb5cdf37d1b6c9f1fc2a7f3e251c7fd0b4a347690e4e1736ca6d9c7922e3908dcad255062720559e4cf891cca4ed61827732a2c12133aea2da7f14758b30cfb3ecff11a079a18f02bf6d71de895e0ccad19e10a75f989b5a6f18f8a1f3edfcf50725515e0fe4a78c6dc06005ec010717a0fdd945ca6ab66bd3b3fd2299622c8c2ea8aa095c884a79c9392819bc034b2351793b0a31fc2419eb97ddf39e5c0a656183fc9689ee70441578b5f1d5e6e3f95582a6a6a8a42ffc464a460d37804391745af9212f3707671b8c2ac79c6dc29678db59a7b9f11c379c6b9e05442617febc8b5d05ac9ef9037948d254a605bea5ca083e0cba56099492db3d384eed6354bea7f2765e4171d1a53e8a33f407ee680affa0b1621c2512ae944ca8d4cc0ef3bbe92e0d44e0e6d41392785f67364dd11590ea1f5f35ae3ba5958f1f8688712c62f50b83b0ec3f02e7c4c392b98e3a686e78c0ea0ecb26c1a0b945bfdbc43ab30f75d5a55abad4fa9191d5988a2f19d1ed0dd8d6458b4b0df61feafee65c5dd8dfbbd4591faeb376cc041293755f65c89308b6453ecbdd05f98179904b8a2e86724842002d09f6163eef94dc9e133ac20eb1142c3e9ed2b7f', '2026-07-16 19:23:14.365+00', '2026-06-12 03:33:29.148197+00', true);


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."notifications" ("id", "user_id", "title", "message", "link", "read", "created_at") VALUES
	('2891d57f-6616-4ce0-85ea-66ef8c7d6da5', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', 'Atualização no seu pedido', 'Seu pedido 1688874e mudou para: Em Preparação', '/pedidos/1688874e-2752-430d-8871-46d6883c2d7c', false, '2026-06-18 14:24:03.221383+00'),
	('2747ba7b-683d-40a2-9b40-63e6ec3f43e6', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', 'Atualização no seu pedido', 'Seu pedido 1688874e mudou para: Pronto para Envio', '/pedidos/1688874e-2752-430d-8871-46d6883c2d7c', false, '2026-06-18 14:26:23.658798+00'),
	('c199a9f4-d1d3-41b8-9bbc-c5c912e682c2', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', 'Atualização no seu pedido', 'Seu pedido 1688874e mudou para: Pronto para Envio', '/pedidos/1688874e-2752-430d-8871-46d6883c2d7c', false, '2026-06-18 14:26:24.019098+00'),
	('d2707194-cd2e-4c37-97f4-c28865be7003', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', 'Atualização no seu pedido', 'Seu pedido 1688874e mudou para: A Caminho', '/perfil', false, '2026-06-18 14:45:17.846829+00'),
	('806a286f-c362-4f90-a582-86fd972ea1aa', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', 'Atualização no seu pedido', 'Seu pedido 1688874e mudou para: Entregue', '/perfil', false, '2026-06-18 15:00:26.160609+00');


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."orders" ("id", "user_id", "total", "status", "shipping_name", "shipping_address", "shipping_city", "shipping_zip", "created_at", "refund_status", "shipping_phone", "shipping_email", "shipping_cost", "tracking_code", "estimated_delivery", "last_tracking_event", "total_weight", "shipping_service_id", "shipping_company_name", "shipping_document", "shipping_state", "payment_status", "melhor_envio_protocol", "shipping_type", "is_archived", "updated_at") VALUES
	('109d7a20-0d64-4e49-8cf0-67fa0143e40d', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', 1709.10, 'pronto para retirada', 'Gabriel', 'Avenida dos Ingás', 'Sinop', '78555-000', '2026-06-18 12:25:22.312113+00', 'none', '(66) 99244-4525', 'gabrielingnau@gmail.com', 0.00, 'Não rastreável', '2026-06-19 12:25:22.128+00', NULL, 0.30, 'pickup', 'Retirada na Loja', '246.196.420-37', 'MT', 'Pago', NULL, 'retirada', false, '2026-06-18 12:42:09.000191+00'),
	('1688874e-2752-430d-8871-46d6883c2d7c', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', 1762.92, 'Entregue', 'Gabriel', 'wjdfkhsf. dsfsdfsd', 'Nova Bandeirantes', '78565-000', '2026-06-18 14:23:21.008103+00', 'none', '(66) 99244-4525', 'gabrielingnau@gmail.com', 53.82, 'PX33945448BR', '2026-06-28 14:23:20.827+00', 'Evento: order.delivered | Status: delivered', 0.90, '1', 'Correios', '246.196.420-37', 'MT', 'Pago', 'ORD-202606280366', 'melhor_envio', true, '2026-06-18 15:02:00.10603+00');


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."products" ("id", "nome", "descricao", "preco", "imagem_url", "categoria", "estoque", "destaque", "created_at", "ativo", "weight", "width", "height", "length", "updated_at") VALUES
	('a9722af8-b6e0-4424-bf04-1a10f848cfa7', 'Calça Tóquio', 'Calça jogger em moletom premium, perfeita para o lifestyle moderno.', 159.90, 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80', 'Calças', 12, false, '2026-05-09 04:52:01.894516+00', true, 0, 0, 0, 0, '2026-06-18 14:40:30.362619+00'),
	('7c710b1a-113e-4e84-b6b6-fe3855bdae47', 'Jaqueta Nova York', 'Jaqueta premium em couro sintético, design atemporal e versátil.', 349.90, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80', 'Jaquetas', 5, false, '2026-05-07 23:14:54.819192+00', true, 0, 0, 0, 0, '2026-06-18 14:40:30.362619+00'),
	('19f251b9-b1e6-4029-9d19-8aa9a249b407', 'Camiseta Beyond the Limits', 'Camiseta premium em algodão pima com corte moderno e acabamento impecável. Perfeita para ocasiões casuais e elegantes.', 79.90, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', 'Camisetas', 14, true, '2026-05-07 23:14:54.819192+00', true, 0, 0, 0, 0, '2026-06-18 14:40:30.362619+00'),
	('347d9521-ef06-49e9-bab3-4795f372754a', 'Moletom Maratonisto', 'Moletom de inverno com forro felpado, ideal para os dias mais frios. Estilo urbano e sofisticado.', 189.90, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80', 'Moletons', 10, true, '2026-05-07 23:14:54.819192+00', true, 0, 0, 0, 0, '2026-06-18 14:40:30.362619+00'),
	('f1983388-cb14-4a48-944e-dfb9a6ff1925', 'Moletom Maratonistaa', 'Moletom de inverno com forro felpado, ideal para os dias mais frios. Estilo urbano e sofisticado..', 188.90, 'https://trmbmnjpylozykcyxcuc.supabase.co/storage/v1/object/public/product-images/1ec1836c-4e6a-400b-9719-65efa56e48e4.jpg', 'Moletonss', 10, true, '2026-05-09 04:52:01.894516+00', true, 0.2, 50, 10, 50, '2026-06-18 14:40:30.362619+00'),
	('0c5192c3-e523-41b3-a554-28185c49ee36', 'Boné Skyline', 'Boné dad hat com bordado exclusivo, conforto e estilo em uma peça versátil.', 69.90, 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80', 'Acessórios', 30, false, '2026-05-09 04:52:01.894516+00', true, 0, 0, 0, 0, '2026-06-18 14:40:30.362619+00'),
	('e1bf736f-b777-45d9-9092-97d548c92764', 'qewqwe', 'ewwerewrew', 55.00, 'https://trmbmnjpylozykcyxcuc.supabase.co/storage/v1/object/public/product-images/f01c3cb0-973c-4f33-8749-0f07cee8e183.png', 'qweqwe', 54, true, '2026-05-13 00:29:02.930981+00', true, 0, 0, 0, 0, '2026-06-18 14:40:30.362619+00'),
	('536c9804-b128-4e79-8dfa-8b0515b5479f', 'Tênis Velocity', 'Tênis esportivo de alta performance com tecnologia de amortecimento avançada.', 459.90, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', 'Calçados', 8, true, '2026-05-07 23:14:54.819192+00', true, 0, 0, 0, 0, '2026-06-18 14:40:30.362619+00'),
	('e91cc50f-05a3-4a5b-a5b3-35f299c0414a', 'jsqjsxss', '3434344334', 34.34, 'https://trmbmnjpylozykcyxcuc.supabase.co/storage/v1/object/public/product-images/34f3b387-6a32-4cf8-8e81-81a5277fd454.png', 'sxsx', 34, false, '2026-05-17 05:03:22.989092+00', true, 0, 0, 0, 0, '2026-06-18 14:40:30.362619+00'),
	('3fcf32d8-181e-418e-963b-85bc819a43b1', 'Camiseta Explorerrrr', 'Tecido sustentável, design minimalista e conforto excepcional para o dia a dia.', 89.90, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80', 'Camisetas', 21, true, '2026-05-07 23:14:54.819192+00', true, 0, 0, 0, 0, '2026-06-18 14:40:30.362619+00'),
	('a82fae4b-94d1-495a-8fff-1a50b9a943f8', 'Tênis Velocityyyyyy', 'Tênis esportivo de alta performance com tecnologia de amortecimento avançada.', 459.90, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', 'Calçados', 9, true, '2026-05-09 04:52:01.894516+00', true, 1, 25, 25, 40, '2026-06-18 14:40:30.362619+00'),
	('5d28a3a4-3dfe-4452-aad1-ec817ecd9a6c', 'Mochila Explorerrrr', 'Mochila resistente à água com compartimento para notebook e design moderno.', 249.90, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80', 'Acessórios', 7, false, '2026-05-07 23:14:54.819192+00', true, 2, 50, 60, 30, '2026-06-18 14:40:30.362619+00');


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."order_items" ("id", "order_id", "product_id", "product_name", "product_image", "unit_price", "quantity", "item_weight", "item_width", "item_height", "item_length") VALUES
	('7ff52559-0dcf-42ad-ad98-1f7e08f493ee', '109d7a20-0d64-4e49-8cf0-67fa0143e40d', '347d9521-ef06-49e9-bab3-4795f372754a', 'Moletom Maratonisto', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80', 189.90, 9, 0.30, 10.00, 10.00, 10.00),
	('24b2710e-eb30-46ce-ac5c-949b7f037fce', '1688874e-2752-430d-8871-46d6883c2d7c', '347d9521-ef06-49e9-bab3-4795f372754a', 'Moletom Maratonisto', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80', 189.90, 9, 0.30, 10.00, 10.00, 10.00);


--
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."product_images" ("id", "product_id", "url", "position", "created_at") VALUES
	('82e7155e-f712-47c8-aa40-fc9d68b8dfee', 'e1bf736f-b777-45d9-9092-97d548c92764', 'https://trmbmnjpylozykcyxcuc.supabase.co/storage/v1/object/public/product-images/1c830160-3161-460e-8138-38fa6c611445.png', 0, '2026-05-16 18:43:48.612369+00'),
	('a9b1bed8-a80b-4121-a98c-46c93c092e8e', 'e1bf736f-b777-45d9-9092-97d548c92764', 'https://trmbmnjpylozykcyxcuc.supabase.co/storage/v1/object/public/product-images/15813898-9bff-42d9-9f3e-91211c6ab7dd.png', 1, '2026-05-16 18:43:56.551528+00'),
	('a66156f2-b787-4501-8fd2-529c3e73ac55', '347d9521-ef06-49e9-bab3-4795f372754a', 'https://trmbmnjpylozykcyxcuc.supabase.co/storage/v1/object/public/product-images/238ee199-ee6e-411b-a9df-1d693aaaf158.png', 0, '2026-05-17 05:37:42.902549+00'),
	('c8ccd902-305e-465f-8643-03d08d626180', '347d9521-ef06-49e9-bab3-4795f372754a', 'https://trmbmnjpylozykcyxcuc.supabase.co/storage/v1/object/public/product-images/c43f1a11-334f-443e-9903-65a18c02818d.jpeg', 1, '2026-05-17 05:37:59.907797+00'),
	('eccc4f24-8989-45e2-9029-22a169ca701c', '5d28a3a4-3dfe-4452-aad1-ec817ecd9a6c', 'https://trmbmnjpylozykcyxcuc.supabase.co/storage/v1/object/public/product-images/0860c97b-49a1-4855-b9e1-9cb4c0f8d74b.png', 0, '2026-05-19 09:07:47.860855+00'),
	('d556e7ae-affe-4c67-8cd9-afcd3835bab2', '5d28a3a4-3dfe-4452-aad1-ec817ecd9a6c', 'https://trmbmnjpylozykcyxcuc.supabase.co/storage/v1/object/public/product-images/97b5abb1-8c6f-4076-82ad-ba53c3830a69.png', 1, '2026-05-19 09:07:58.289021+00'),
	('06c2256a-1289-44f4-a4d3-42797b180cfb', 'a82fae4b-94d1-495a-8fff-1a50b9a943f8', 'https://trmbmnjpylozykcyxcuc.supabase.co/storage/v1/object/public/product-images/5ab4d4ed-97e1-4546-85f3-affce5812401.png', 0, '2026-05-19 09:26:54.75744+00'),
	('48801b32-828a-4c95-aaee-850f02daf28f', '0c5192c3-e523-41b3-a554-28185c49ee36', 'https://trmbmnjpylozykcyxcuc.supabase.co/storage/v1/object/public/product-images/85bc0061-3244-4439-b425-7eda2e546a3b.png', 0, '2026-05-19 12:44:46.192602+00');


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profiles" ("id", "user_id", "display_name", "email", "created_at", "phone") VALUES
	('8e93825f-24ca-42f6-82c7-b2b99f59850d', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', 'Gabriel', 'gabrielingnau@gmail.com', '2026-05-09 05:13:37.07195+00', '(66) 99244-4525'),
	('f580ddc0-f1b5-4b73-8045-a34383444a69', 'e0163127-71a6-4915-a882-e390dde0cbe0', 'teste', 'teste@gmail.com', '2026-05-13 00:11:15.279001+00', NULL);


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."reviews" ("id", "product_id", "user_id", "rating", "comment", "created_at") VALUES
	('1a063bf4-d980-46eb-9822-d579fbf3be50', 'a82fae4b-94d1-495a-8fff-1a50b9a943f8', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', 2, 'legalll', '2026-05-13 05:17:48.312647+00'),
	('b0f4acd9-da73-4569-833e-13923da0ab03', '3fcf32d8-181e-418e-963b-85bc819a43b1', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', 4, 'muito bom', '2026-05-16 07:34:09.452332+00'),
	('b5129ff2-3b4e-4a61-9472-8f147db1287e', '0c5192c3-e523-41b3-a554-28185c49ee36', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', 4, 'dfdffd', '2026-05-20 15:17:34.152421+00'),
	('f4d400fc-da53-4440-8fea-855e6dcaf9a1', 'f1983388-cb14-4a48-944e-dfb9a6ff1925', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', 5, 'eedecc', '2026-05-20 15:18:07.757145+00'),
	('d80bd4da-2b21-4a97-8288-5d68976047ed', '7c710b1a-113e-4e84-b6b6-fe3855bdae47', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', 4, 'weefwfewf', '2026-05-20 15:21:46.295165+00'),
	('da365821-6801-41ea-8ba2-8e0c4a28de13', '347d9521-ef06-49e9-bab3-4795f372754a', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', 4, 'teste', '2026-06-18 13:35:27.548327+00'),
	('801ad04e-0a8a-4c81-b916-0491ce7fecd4', 'e1bf736f-b777-45d9-9092-97d548c92764', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', 4, 'teste', '2026-06-18 14:02:41.14774+00'),
	('5cc9d463-70ed-42c4-bd7f-fa200cd0fa42', 'e91cc50f-05a3-4a5b-a5b3-35f299c0414a', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', 4, 'dssdv', '2026-06-18 14:07:09.97759+00'),
	('610a7709-0f47-4b97-8dfa-3ca8a1d914a8', 'a9722af8-b6e0-4424-bf04-1a10f848cfa7', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', 3, 'teste', '2026-06-18 14:21:34.607004+00');


--
-- Data for Name: store_config; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."store_config" ("id", "name", "email", "phone", "city", "state", "zip_code", "address", "updated_at", "allow_local_pickup", "allow_local_delivery", "local_delivery_fee") VALUES
	(true, 'minha loja', 'gabrielingnau@gmail.com', '66992444525', 'Sinop', 'mt', '78555000', 'sdjhfkjsdf jsdhf', '2026-06-16 17:48:40.066388+00', true, true, 0);


--
-- Data for Name: user_addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_addresses" ("id", "user_id", "street", "city", "state", "updated_at", "zip_code", "role", "active") VALUES
	('fbbeb58f-df85-4c24-9d30-5a096772b197', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', 'dsjfjk jshdfk skdjfhs', 'Porto dos Gaúchos', 'MT', '2026-06-18 14:23:02.837888+00', '78560-000', 'customer', false),
	('0c7af248-b0f7-4742-a064-f9f5c131ecf1', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', 'Avenida dos Ingás', 'Sinop', 'MT', '2026-06-18 14:23:02.837888+00', '78555-000', 'customer', false),
	('94945a6b-b46d-4df5-a64a-0d5ebb06a2e2', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', 'wjdfkhsf. dsfsdfsd', 'Nova Bandeirantes', 'MT', '2026-06-18 14:23:03.151224+00', '78565-000', 'customer', true),
	('7b9fc37b-51c4-40c6-9f98-aa63b26f7e3e', 'e0163127-71a6-4915-a882-e390dde0cbe0', 'Avenida dos Ingás', 'Sinop', 'MT', '2026-06-15 14:12:09.746981+00', '78555-000', 'customer', false),
	('a3f81bb9-ae1a-4396-8f30-46bc7aa41863', 'e0163127-71a6-4915-a882-e390dde0cbe0', 'Avenida dos Ingás', 'Sinop', 'MT', '2026-06-15 14:12:09.746981+00', '78555-000', 'customer', false),
	('d970d6c9-f70c-45cd-8210-db95f4fa3ce4', 'e0163127-71a6-4915-a882-e390dde0cbe0', 'sdfsdffsd', 'Nova Bandeirantes', 'MT', '2026-06-15 14:12:10.147776+00', '78565-000', 'customer', true);


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_roles" ("id", "user_id", "role", "created_at") VALUES
	('f5b5492e-2ed6-4210-ab18-d78f898af362', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', 'admin', '2026-05-09 05:13:37.07195+00'),
	('d3d133e2-b2db-4598-8e7e-83f5a7002c82', 'e0163127-71a6-4915-a882-e390dde0cbe0', 'user', '2026-05-13 00:11:15.279001+00');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") VALUES
	('product-images', 'product-images', NULL, '2026-05-09 04:52:01.894516+00', '2026-05-09 04:52:01.894516+00', true, false, NULL, NULL, NULL, 'STANDARD');


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") VALUES
	('e5d15500-79a1-431b-8d2a-d43e8062fefd', 'product-images', 'a8a64408-5d91-4d00-bca7-8f5143d95450/1778304402930-0-20260224_101443.jpg', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '2026-05-09 05:26:45.141831+00', '2026-05-09 05:26:45.141831+00', '2026-05-09 05:26:45.141831+00', '{"eTag": "\"f6074c1750649a1b05801defdd88d82b\"", "size": 1528724, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-09T05:26:46.000Z", "contentLength": 1528724, "httpStatusCode": 200}', '1c9342e6-ed91-400b-8d2b-6929af1a9dea', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '{}'),
	('a4768bb4-8045-4d25-b1fc-22288c0d7c6a', 'product-images', 'a8a64408-5d91-4d00-bca7-8f5143d95450/1778304426800-0-ChatGPT Image 5 de mai. de 2026 06_44_37.png', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '2026-05-09 05:27:09.428681+00', '2026-05-09 05:27:09.428681+00', '2026-05-09 05:27:09.428681+00', '{"eTag": "\"141120b68a0b387714e5ead65cb09389\"", "size": 2842097, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-09T05:27:10.000Z", "contentLength": 2842097, "httpStatusCode": 200}', '5aeb31d9-e215-48fc-bb88-ce660841dec4', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '{}'),
	('fcaf60cb-efe6-4908-80bd-18f098b48b8b', 'product-images', 'a8a64408-5d91-4d00-bca7-8f5143d95450/1778304429803-1-ChatGPT Image 5 de mai. de 2026 07_47_47.png', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '2026-05-09 05:27:10.470498+00', '2026-05-09 05:27:10.470498+00', '2026-05-09 05:27:10.470498+00', '{"eTag": "\"a4ff27e99b1243abfdabfebb43049201\"", "size": 33099, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-09T05:27:11.000Z", "contentLength": 33099, "httpStatusCode": 200}', '756f9c53-8d82-495a-abbd-ae910a21ac92', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '{}'),
	('273132eb-307b-41a5-861b-7f7915242456', 'product-images', 'a8a64408-5d91-4d00-bca7-8f5143d95450/1778304430823-2-ChatGPT Image 5 de mai. de 2026 07_52_26.png', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '2026-05-09 05:27:11.154513+00', '2026-05-09 05:27:11.154513+00', '2026-05-09 05:27:11.154513+00', '{"eTag": "\"5542532e4362114e6b0be6f1d7603346\"", "size": 4430, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-09T05:27:12.000Z", "contentLength": 4430, "httpStatusCode": 200}', '435f2c1e-eaaa-425e-a241-446bd269d5d5', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '{}'),
	('9596b493-ff7d-4cdc-ad84-a87a5381c229', 'product-images', 'f01c3cb0-973c-4f33-8749-0f07cee8e183.png', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '2026-05-13 00:28:42.552763+00', '2026-05-13 00:28:42.552763+00', '2026-05-13 00:28:42.552763+00', '{"eTag": "\"05ab52b2a28dc562cb065301f9c4d782\"", "size": 129002, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-13T00:28:43.000Z", "contentLength": 129002, "httpStatusCode": 200}', '572875be-dabc-4743-9e1f-e5d1541b8303', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '{}'),
	('c1f1fd35-040b-4b6e-b9d7-6d3f8a52127c', 'product-images', '1c830160-3161-460e-8138-38fa6c611445.png', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '2026-05-16 18:43:48.24705+00', '2026-05-16 18:43:48.24705+00', '2026-05-16 18:43:48.24705+00', '{"eTag": "\"05ab52b2a28dc562cb065301f9c4d782\"", "size": 129002, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-16T18:43:49.000Z", "contentLength": 129002, "httpStatusCode": 200}', 'cfe80940-8706-4683-8250-a21cfa28f049', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '{}'),
	('97359309-ebf7-459e-a2e8-a5bef5a6d616', 'product-images', '15813898-9bff-42d9-9f3e-91211c6ab7dd.png', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '2026-05-16 18:43:56.230607+00', '2026-05-16 18:43:56.230607+00', '2026-05-16 18:43:56.230607+00', '{"eTag": "\"141120b68a0b387714e5ead65cb09389\"", "size": 2842097, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-16T18:43:57.000Z", "contentLength": 2842097, "httpStatusCode": 200}', '1bdd7a1f-8701-4180-959e-813ba15654d6', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '{}'),
	('99060d3b-6cc8-4fe0-bb79-3e60bb63b25a', 'product-images', 'b091780d-f6a3-4a9f-9ad5-922d8310545b.jpg', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '2026-05-17 05:03:00.597785+00', '2026-05-17 05:03:00.597785+00', '2026-05-17 05:03:00.597785+00', '{"eTag": "\"f6074c1750649a1b05801defdd88d82b\"", "size": 1528724, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-17T05:03:01.000Z", "contentLength": 1528724, "httpStatusCode": 200}', '38a25d04-3cce-43c4-9f02-e2b328e81e77', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '{}'),
	('e8aff956-c454-4fba-9482-df04f03f69d1', 'product-images', '34f3b387-6a32-4cf8-8e81-81a5277fd454.png', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '2026-05-17 05:03:14.105024+00', '2026-05-17 05:03:14.105024+00', '2026-05-17 05:03:14.105024+00', '{"eTag": "\"05ab52b2a28dc562cb065301f9c4d782\"", "size": 129002, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-17T05:03:15.000Z", "contentLength": 129002, "httpStatusCode": 200}', 'fbbdd4ac-14e1-4bca-a60f-e57e81e9b194', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '{}'),
	('35fbccd9-8c04-4525-ac50-c2e8f6d8e1e7', 'product-images', '4b440fdc-efc7-4726-9615-2589ba0818cd.png', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '2026-05-17 05:12:24.874119+00', '2026-05-17 05:12:24.874119+00', '2026-05-17 05:12:24.874119+00', '{"eTag": "\"5542532e4362114e6b0be6f1d7603346\"", "size": 4430, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-17T05:12:25.000Z", "contentLength": 4430, "httpStatusCode": 200}', 'fb3d4512-77dd-43fa-8308-a4698e636797', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '{}'),
	('26a96e2c-d91d-4aed-835f-71a107fffe83', 'product-images', 'f40edacb-0c62-4964-86cf-21dc17b224ef.png', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '2026-05-17 05:31:16.822121+00', '2026-05-17 05:31:16.822121+00', '2026-05-17 05:31:16.822121+00', '{"eTag": "\"05ab52b2a28dc562cb065301f9c4d782\"", "size": 129002, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-17T05:31:17.000Z", "contentLength": 129002, "httpStatusCode": 200}', 'b6ba28a3-dc91-46c8-b0ef-41d8142a286d', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '{}'),
	('f9442cba-0155-4f99-bf25-e49b7a32704a', 'product-images', 'd6f275a0-594b-4bc2-bcca-9464b41bed9c.png', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '2026-05-17 05:31:50.55686+00', '2026-05-17 05:31:50.55686+00', '2026-05-17 05:31:50.55686+00', '{"eTag": "\"141120b68a0b387714e5ead65cb09389\"", "size": 2842097, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-17T05:31:51.000Z", "contentLength": 2842097, "httpStatusCode": 200}', 'f5c640b4-f766-4225-b400-7cb28a3b83a6', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '{}'),
	('6412e36e-8dbb-4ddb-a878-7a95917b5675', 'product-images', '238ee199-ee6e-411b-a9df-1d693aaaf158.png', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '2026-05-17 05:37:42.392985+00', '2026-05-17 05:37:42.392985+00', '2026-05-17 05:37:42.392985+00', '{"eTag": "\"141120b68a0b387714e5ead65cb09389\"", "size": 2842097, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-17T05:37:43.000Z", "contentLength": 2842097, "httpStatusCode": 200}', '58794293-04d6-4e11-bcd9-05b59b7062fe', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '{}'),
	('5a6a8edf-86ff-4f26-88ce-25446d217086', 'product-images', 'c43f1a11-334f-443e-9903-65a18c02818d.jpeg', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '2026-05-17 05:37:59.517612+00', '2026-05-17 05:37:59.517612+00', '2026-05-17 05:37:59.517612+00', '{"eTag": "\"28e63a85e644287cadb7251482d29da3\"", "size": 302549, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-17T05:38:00.000Z", "contentLength": 302549, "httpStatusCode": 200}', 'c4999345-0dd8-4728-864c-ee2af0d53410', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '{}'),
	('b132a941-084c-4faa-ab34-7833d20e1ad2', 'product-images', '0feada86-3bf5-44cb-a2ab-a0a0f948ee49.png', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '2026-05-17 06:04:42.472811+00', '2026-05-17 06:04:42.472811+00', '2026-05-17 06:04:42.472811+00', '{"eTag": "\"05ab52b2a28dc562cb065301f9c4d782\"", "size": 129002, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-17T06:04:43.000Z", "contentLength": 129002, "httpStatusCode": 200}', '9e930f50-d6bc-4f31-85f2-ca0379e64433', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '{}'),
	('0e159664-f56f-4053-831a-b384d42fa2b1', 'product-images', 'c0d48a20-9777-4960-acd9-19d93cb99f5d.png', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '2026-05-17 06:04:49.909959+00', '2026-05-17 06:04:49.909959+00', '2026-05-17 06:04:49.909959+00', '{"eTag": "\"a4ff27e99b1243abfdabfebb43049201\"", "size": 33099, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-17T06:04:50.000Z", "contentLength": 33099, "httpStatusCode": 200}', '500e9c9c-f8b3-41ee-a6b3-b50582c27d66', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '{}'),
	('c8cd1690-7317-47fd-88c6-96fcdce55b7d', 'product-images', '0860c97b-49a1-4855-b9e1-9cb4c0f8d74b.png', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '2026-05-19 09:07:46.642271+00', '2026-05-19 09:07:46.642271+00', '2026-05-19 09:07:46.642271+00', '{"eTag": "\"05ab52b2a28dc562cb065301f9c4d782\"", "size": 129002, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-19T09:07:47.000Z", "contentLength": 129002, "httpStatusCode": 200}', '179e4384-5bec-4c40-ac6a-5972784ec5bd', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '{}'),
	('d48a240c-7be7-4dd6-ad9f-202419b17c9b', 'product-images', '97b5abb1-8c6f-4076-82ad-ba53c3830a69.png', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '2026-05-19 09:07:58.00652+00', '2026-05-19 09:07:58.00652+00', '2026-05-19 09:07:58.00652+00', '{"eTag": "\"cb44ec65d820a6062e6d9a998a52072b\"", "size": 970108, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-19T09:07:58.000Z", "contentLength": 970108, "httpStatusCode": 200}', '7dcab453-13c8-4572-9134-a7270aaae15b', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '{}'),
	('c858e5e8-73b4-4f49-91a6-21dcd536f5bd', 'product-images', '5ab4d4ed-97e1-4546-85f3-affce5812401.png', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '2026-05-19 09:26:54.350181+00', '2026-05-19 09:26:54.350181+00', '2026-05-19 09:26:54.350181+00', '{"eTag": "\"05ab52b2a28dc562cb065301f9c4d782\"", "size": 129002, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-19T09:26:55.000Z", "contentLength": 129002, "httpStatusCode": 200}', '5b0e6d2c-17a1-4752-aef5-802eaa70fad3', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '{}'),
	('fa1f51a4-0554-40b0-b5fd-cf01ea3bad07', 'product-images', '85bc0061-3244-4439-b425-7eda2e546a3b.png', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '2026-05-19 12:44:45.776084+00', '2026-05-19 12:44:45.776084+00', '2026-05-19 12:44:45.776084+00', '{"eTag": "\"05ab52b2a28dc562cb065301f9c4d782\"", "size": 129002, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-19T12:44:46.000Z", "contentLength": 129002, "httpStatusCode": 200}', '0b46eb1c-2892-4ae5-ae8a-389e1a517425', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '{}'),
	('6aea0438-745d-4cb0-a1d0-54d01ce7b98f', 'product-images', 'a0a55230-72cc-42f8-9b88-560d6b2c5a6a.pages', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '2026-06-16 19:44:27.483527+00', '2026-06-16 19:44:27.483527+00', '2026-06-16 19:44:27.483527+00', '{"eTag": "\"eb498b04f46b8d354041a45554702eb5\"", "size": 621736, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2026-06-16T19:44:28.000Z", "contentLength": 621736, "httpStatusCode": 200}', '2927a856-b826-41fe-82de-457f8b80e5f3', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '{}'),
	('3408725e-0728-4c29-848f-273e3e44f41f', 'product-images', '1ec1836c-4e6a-400b-9719-65efa56e48e4.jpg', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '2026-06-16 19:44:49.01103+00', '2026-06-16 19:44:49.01103+00', '2026-06-16 19:44:49.01103+00', '{"eTag": "\"f6074c1750649a1b05801defdd88d82b\"", "size": 1528724, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-06-16T19:44:49.000Z", "contentLength": 1528724, "httpStatusCode": 200}', '1df535d1-614a-4b74-9e5a-06ae6624350b', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '{}'),
	('ed7decb3-0a70-4141-ad38-fcdf5f57497f', 'product-images', '658f738e-ee45-4a76-82da-a97e0d0637b7.mp4', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '2026-06-16 19:44:52.93469+00', '2026-06-16 19:44:52.93469+00', '2026-06-16 19:44:52.93469+00', '{"eTag": "\"3baf6aadc4a5d0e2b96f560511bb5ac0-3\"", "size": 47714296, "mimetype": "video/mp4", "cacheControl": "max-age=3600", "lastModified": "2026-06-16T19:44:52.000Z", "contentLength": 47714296, "httpStatusCode": 200}', '706c743d-3761-4af6-89b6-91ae0541d0cf', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '{}'),
	('1f2b2899-6da3-48e4-b13e-20bcf0a34f13', 'product-images', 'a2dea5d0-bc61-4117-a5fb-f84ac06d584b.jpg', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '2026-06-16 19:45:11.129506+00', '2026-06-16 19:45:11.129506+00', '2026-06-16 19:45:11.129506+00', '{"eTag": "\"f6074c1750649a1b05801defdd88d82b\"", "size": 1528724, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-06-16T19:45:12.000Z", "contentLength": 1528724, "httpStatusCode": 200}', '35a34763-acba-4ef6-bbd1-6ead3fa41be1', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '{}'),
	('4de47e5a-66e4-4c33-b1c6-e027ce5f650e', 'product-images', '7a62a129-488b-4c8f-9c0e-4ac4cd07f01f.jpg', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '2026-06-16 19:45:58.017461+00', '2026-06-16 19:45:58.017461+00', '2026-06-16 19:45:58.017461+00', '{"eTag": "\"f6074c1750649a1b05801defdd88d82b\"", "size": 1528724, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-06-16T19:45:58.000Z", "contentLength": 1528724, "httpStatusCode": 200}', 'b336fdfa-d9a2-4d95-86dd-54b8cec511cc', 'd92ab428-f962-4c1e-8ae8-976c9ed85bf1', '{}');


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 165, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict FAs8O6ByNotHnKEO0j51P1f6CZtNRDlLDR1QeriGFZbEiWzKLXlHgbK8WHCxRYS

RESET ALL;
