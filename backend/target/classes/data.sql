-- IPC Sections
INSERT OR IGNORE INTO legal_sections (code, title, description, act_type, is_bailable) VALUES
('IPC 302', 'Murder', 'Whoever commits murder shall be punished with death or imprisonment for life.', 'IPC', 0),
('IPC 307', 'Attempt to Murder', 'Whoever does any act with such intention or knowledge and under such circumstances that if by that act he caused death he would be guilty of murder.', 'IPC', 0),
('IPC 376', 'Rape', 'Whoever commits rape shall be punished with rigorous imprisonment.', 'IPC', 0),
('IPC 420', 'Cheating', 'Whoever cheats and thereby dishonestly induces the person deceived to deliver any property.', 'IPC', 1),
('IPC 379', 'Theft', 'Whoever intending to take dishonestly any moveable property out of the possession of any person without that person''s consent.', 'IPC', 1),
('IPC 380', 'Theft in Dwelling', 'Whoever commits theft in any building, tent or vessel which is used as a human dwelling.', 'IPC', 1),
('IPC 498A', 'Cruelty by Husband', 'Whoever, being the husband or the relative of the husband of a woman, subjects such woman to cruelty.', 'IPC', 0),
('IPC 506', 'Criminal Intimidation', 'Whoever threatens another with any injury to his person, reputation or property.', 'IPC', 1),
('IPC 323', 'Voluntarily Causing Hurt', 'Whoever, except in the case provided for by section 334, voluntarily causes hurt.', 'IPC', 1),
('IPC 354', 'Assault on Woman', 'Whoever assaults or uses criminal force to any woman, intending to outrage or knowing it to be likely that he will thereby outrage her modesty.', 'IPC', 0);

-- CrPC Sections
INSERT OR IGNORE INTO legal_sections (code, title, description, act_type, is_bailable) VALUES
('CrPC 154', 'FIR Registration', 'Information in cognizable cases - Every information relating to the commission of a cognizable offence shall be reduced to writing by the officer in charge.', 'CrPC', 1),
('CrPC 156', 'Police Investigation', 'Officer in charge of police station may investigate any cognizable case without the order of a Magistrate.', 'CrPC', 1),
('CrPC 161', 'Examination of Witnesses', 'Any police officer making an investigation may examine orally any person supposed to be acquainted with the facts and circumstances of the case.', 'CrPC', 1),
('CrPC 167', 'Remand Proceedings', 'Procedure when investigation cannot be completed in twenty-four hours.', 'CrPC', 1),
('CrPC 173', 'Police Report / Chargesheet', 'Every investigation under this Chapter shall be completed without unnecessary delay, and the report shall be forwarded to a Magistrate.', 'CrPC', 1),
('CrPC 197', 'Prosecution of Public Servants', 'Previous sanction necessary for prosecution of public servants.', 'CrPC', 1),
('CrPC 320', 'Compounding of Offences', 'Certain offences may be compounded.', 'CrPC', 1),
('CrPC 437', 'Bail in Bailable Offences', 'Any person accused of a bailable offence may be given bail by any police officer or court.', 'CrPC', 1),
('CrPC 438', 'Anticipatory Bail', 'Direction for grant of bail to person apprehending arrest.', 'CrPC', 1),
('CrPC 439', 'Special Powers of High Court for Bail', 'Special powers of High Court or Court of Session regarding bail.', 'CrPC', 1);
