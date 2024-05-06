CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    hash VARCHAR(100) NOT NULL
);

INSERT INTO users (name, hash) VALUES
    ('hadrian', '$2b$10$JLeQCoxbTZ/FwEeDLh.ASeq/Aw/0QXhdK5TzlFBI3gPfal3EJO4iO'),
    ('caesar', '$2b$10$WZQfmgKwe6f6tJBeHLZ66e7xAyPyv5indtFCrB/sJxTv6NtKHIYUq');

CREATE TABLE servers (
    guid UUID PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    ip VARCHAR(15) NOT NULL,
    os VARCHAR(20) NOT NULL,
    id_user INTEGER NOT NULL REFERENCES users(id)
);

INSERT INTO servers (guid, name, ip, os, id_user) VALUES
    ('b9ffbd2d-521f-44f1-aead-47a51f59d9f3', 'Augustus', '192.168.0.101', 'Linux', 1),
    ('8d7f4cf3-913e-4ee2-bb78-d4e7c3b5cb89', 'Trajan', '192.168.0.102', 'Windows', 1),
    ('a7f85ecb-c3e8-49ad-9ac5-2d9c6e35f24d', 'Hadrian', '192.168.0.103', 'Linux', 1),
    ('6b765f59-ecb3-4b3a-8a14-3831a6a202a4', 'Diocletian', '192.168.0.104', 'Windows', 2),
    ('92625e1a-4b58-477d-80d5-af33b91e8a18', 'Constantine', '192.168.0.105', 'Linux', 2),
    ('fa0660f0-af3d-470f-82b6-ba2d66f7a42c', 'Julius Caesar', '192.168.0.106', 'Windows', 2);

CREATE TABLE updates (
    id SERIAL PRIMARY KEY,
    os VARCHAR(20) NOT NULL,
    name VARCHAR(50) NOT NULL
);

INSERT INTO updates (os, name) VALUES
    ('Linux', 'CoreLinux'),
    ('Windows', 'CoreWin'),
    ('Linux', 'App'),
    ('Windows', '.NET UPDATE');

CREATE TABLE installations (
    id SERIAL PRIMARY KEY,
    guid_server UUID REFERENCES servers(guid),
    id_update INT REFERENCES updates(id),
    time TIMESTAMP,
    status VARCHAR(10) CHECK (status IN ('planned', 'installed', 'canceled'))
);