import asyncio
import os
import sys

# Change working directory to backend folder programmatically
os.chdir('/home/fazilvk/Desktop/Agenticx-backend/fastapi_app')

# Add backend directory to sys.path
sys.path.insert(0, '/home/fazilvk/Desktop/Agenticx-backend/fastapi_app')

from app.core.database import AsyncSessionLocal
from sqlalchemy import select
from app.models.placed_student import PlacedStudent


async def main():
    async with AsyncSessionLocal() as db:
        # Check if any placed students exist
        result = await db.execute(select(PlacedStudent))
        existing = result.scalars().all()
        if existing:
            print("Placed students already exist in the database — skipping seeding.")
            return

        students = [
            PlacedStudent(
                student_name="Arjun Kumar",
                company_name="KeyValue Software Systems",
                job_role="AI Engineer",
                photo_url="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&h=256&q=80",
                display_order=1,
                is_active=True,
            ),
            PlacedStudent(
                student_name="Anjali Nair",
                company_name="TCS",
                job_role="Data Scientist",
                photo_url="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&h=256&q=80",
                display_order=2,
                is_active=True,
            ),
            PlacedStudent(
                student_name="Rahul Sharma",
                company_name="UST Global",
                job_role="Machine Learning Associate",
                photo_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80",
                display_order=3,
                is_active=True,
            ),
            PlacedStudent(
                student_name="Sneha Joseph",
                company_name="Infosys",
                job_role="Full Stack Developer",
                photo_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80",
                display_order=4,
                is_active=True,
            ),
        ]

        for s in students:
            db.add(s)
        await db.commit()
        print(f"✅ Successfully seeded {len(students)} placed student records.")


if __name__ == "__main__":
    asyncio.run(main())
