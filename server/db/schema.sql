CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'to-read'
        CHECK (status IN ('to-read', 'reading', 'finished')),
    rating SMALLINT
        CHECK (rating BETWEEN 1 AND 5),
    date_started DATE,
    date_finished DATE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE books ADD CONSTRAINT UC_Books UNIQUE (title, author);
ALTER TABLE books ADD cover_url VARCHAR(255);