
-- I just found out SQLite automatically makes indexes on the
-- primary keys (and UNIQUE constrained fields)
-- Left as a PSA:
-- CREATE INDEX idx_main_object_id ON main (Object_ID);

CREATE INDEX idx_cons_cons_id       ON constituentsxobjects (Constituent_ID);
CREATE INDEX idx_cons_object_id     ON constituentsxobjects (Object_ID);

CREATE INDEX idx_exhb_exhibition_id ON exhibitionsxobjects (Exhibition_ID);
CREATE INDEX idx_exhb_object_id     ON exhibitionsxobjects (Object_ID);

