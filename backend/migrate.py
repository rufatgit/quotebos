# USING THIS FILE WHEN UPDATING MODELS.PY OR SCHEMAS.PY FILES SO IN ORDER NOT TO LOOSE DATABASE DATA

# from sqlalchemy import text
# from backend.database import engine

# with engine.connect() as conn:
#     conn.execute(text("ALTER TABLE Author ADD COLUMN bio VARCHAR"))
#     conn.execute(text("ALTER TABLE Author ADD COLUMN born VARCHAR"))
#     conn.execute(text("ALTER TABLE Author ADD COLUMN died VARCHAR"))
#     conn.execute(text("ALTER TABLE Author ADD COLUMN genre VARCHAR"))
#     conn.commit()

# print("Migration complete — added bio, born, died, genre to Author table")


from sqlalchemy import text
from backend.database import engine

with engine.connect() as conn:
    conn.execute(text("ALTER TABLE Author RENAME COLUMN genre TO profession"))
    conn.commit()

print("Migration complete — renamed genre to profession")
