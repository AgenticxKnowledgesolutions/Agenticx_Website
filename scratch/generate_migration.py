import os
import sys

# Change working directory to backend folder programmatically
os.chdir('/home/fazilvk/Desktop/Agenticx-backend/fastapi_app')

# Add backend directory to sys.path
sys.path.insert(0, '/home/fazilvk/Desktop/Agenticx-backend/fastapi_app')

# Import and execute Alembic revision --autogenerate
from alembic.config import Config
from alembic import command

alembic_cfg = Config("alembic.ini")
command.revision(alembic_cfg, message="create placed_students_table", autogenerate=True)
print("Alembic revision generated successfully!")
