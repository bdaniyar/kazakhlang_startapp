from sqlalchemy import Column, ForeignKey, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session, sessionmaker
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./qamqorzoo.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


class Animal(Base):
    __tablename__ = "animals"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    image_url = Column(String, nullable=False)
    story = Column(String, nullable=False)
    progress = Column(Integer, default=0)


class Donation(Base):
    __tablename__ = "donations"

    id = Column(Integer, primary_key=True, index=True)
    animal_id = Column(Integer, ForeignKey("animals.id"), nullable=False)
    amount = Column(Integer, nullable=False)


class DonationCreate(BaseModel):
    animal_id: int
    amount: int


app = FastAPI(title="QamqorZoo API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in os.getenv("CORS_ORIGINS", "*").split(",") if origin.strip()]
    if os.getenv("CORS_ORIGINS", "*").strip() != "*"
    else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


SEED_ANIMALS = [
    {
        "name": "Киік",
        "description": "Сирек дала жануары, ашық кеңістік пен тыныш орта қажет.",
        "image_url": "https://images.unsplash.com/photo-1599907339757-bcd005a3fb0d?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2FpZ2F8ZW58MHx8MHx8fDA%3D",
        "story": "Киік — Қазақстан даласының символы.\n\nОған кең қозғалыс аймағы мен тыныш орта қажет.\n\nҚоғамдық қолдау арқылы бұл сирек түрді қорғауға болады.",
        "progress": 35,
    },
    {
        "name": "Жолбарыс",
        "description": "Күшті жыртқыш, белсенді қозғалыс пен кең аймақ қажет.",
        "image_url": "https://images.unsplash.com/photo-1500463959177-e0869687df26?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "story": "Жолбарыс табиғатта үлкен аумақты қажет етеді.\n\nҚозғалыс пен дұрыс күтім оның денсаулығына әсер етеді.\n\nҚолдау арқылы оған қолайлы жағдай жасауға болады.",
        "progress": 42,
    },
    {
        "name": "Қоңыр аю",
        "description": "Ірі жануар, кең орын мен байыту элементтері қажет.",
        "image_url": "https://images.unsplash.com/photo-1595173425119-1c54835c1874?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YnJvd24lMjBiZWFyfGVufDB8fDB8fHww",
        "story": "Қоңыр аю ойын мен қозғалысты жақсы көреді.\n\nБайыту құралдары оның күйзелісін азайтады.\n\nҚоғамдық қолдау күтім сапасын жақсартады.",
        "progress": 28,
    },
    {
        "name": "Қасқыр",
        "description": "Әлеуметтік жыртқыш, топтық орта маңызды.",
        "image_url": "https://images.unsplash.com/photo-1562522845-b2d5197e3b23?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d29sZiUyMHpvb3xlbnwwfHwwfHx8MA%3D%3D",
        "story": "Қасқырлар топпен өмір сүреді.\n\nОларға қозғалыс пен байланыс маңызды.\n\nЖоба олардың табиғи мінезін сақтауға көмектеседі.",
        "progress": 31,
    },
    {
        "name": "Піл",
        "description": "Ақылды әрі сезімтал жануар, кең орын қажет.",
        "image_url": "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1200&q=80",
        "story": "Піл — ең ақылды жануарлардың бірі.\n\nОған кеңістік пен тұрақты күтім қажет.\n\nҚоғам қолдауы оның өмір сапасын жақсартады.",
        "progress": 53,
    },
    {
        "name": "Түйе",
        "description": "Төзімді жануар, құрғақ климатқа бейімделген.",
        "image_url": "https://images.unsplash.com/photo-1634471815607-1794ba38e4d9?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2FtZWwlMjB6b298ZW58MHx8MHx8fDA%3D",
        "story": "Түйе шөлейт аймақтарға бейімделген.\n\nДұрыс қорек пен күтім маңызды.\n\nҚолдау жануар әл-ауқатына әсер етеді.",
        "progress": 24,
    },
    {
        "name": "Бегемот",
        "description": "Су жануары, бассейн мен ылғалды орта қажет.",
        "image_url": "https://images.unsplash.com/photo-1682172050888-b380af1b08b3?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aGlwcG9wb3RhbXVzJTIwem9vfGVufDB8fDB8fHww",
        "story": "Бегемоттар суға тәуелді.\n\nОларға таза су мен қауіпсіз орта қажет.\n\nҚолдау күтім сапасын арттырады.",
        "progress": 38,
    },
    {
        "name": "Бизон",
        "description": "Күшті тұяқты жануар, кең жайылым қажет.",
        "image_url": "https://images.unsplash.com/photo-1564059440318-dbe81576d63b?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ymlzb24lMjB6b298ZW58MHx8MHx8fDA%3D",
        "story": "Бизондарға қозғалыс өте маңызды.\n\nЖақсы күтім олардың денсаулығын сақтайды.\n\nҚоғамдық қолдау инфрақұрылымды жақсартады.",
        "progress": 34,
    },
    {
        "name": "Елік",
        "description": "Нәзік жануар, тыныш орта қажет.",
        "image_url": "https://images.unsplash.com/photo-1647784025602-df1cd69178b1?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGVlciUyMHpvb3xlbnwwfHwwfHx8MA%3D%3D",
        "story": "Елік өте сақ жануар.\n\nТыныштық пен қауіпсіз орта маңызды.\n\nҚолдау олардың өміріне оң әсер етеді.",
        "progress": 30,
    },
    {
        "name": "Қоқиқаз",
        "description": "Әсем құс, су ортасы қажет.",
        "image_url": "https://images.unsplash.com/photo-1649601697362-ceb083e22100?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmxhbWluZ28lMjB6b298ZW58MHx8MHx8fDA%3D",
        "story": "Қоқиқаздар су аймағында өмір сүреді.\n\nСу сапасы өте маңызды.\n\nҚолдау олардың ортасын жақсартады.",
        "progress": 46,
    },
]


def seed_data(db: Session) -> None:
    expected_names = {item["name"] for item in SEED_ANIMALS}
    current_animals = db.query(Animal).all()
    current_by_name = {animal.name: animal for animal in current_animals}

    for item in SEED_ANIMALS:
        existing = current_by_name.get(item["name"])
        if existing:
            existing.description = item["description"]
            existing.image_url = item["image_url"]
            existing.story = item["story"]
            existing.progress = item["progress"]
        else:
            db.add(Animal(**item))

    stale_animals = [
        animal for animal in current_animals if animal.name not in expected_names
    ]
    stale_ids = [animal.id for animal in stale_animals]
    if stale_ids:
        db.query(Donation).filter(Donation.animal_id.in_(stale_ids)).delete(
            synchronize_session=False
        )
        db.query(Animal).filter(Animal.id.in_(stale_ids)).delete(
            synchronize_session=False
        )

    db.commit()


@app.on_event("startup")
def startup() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()


@app.get("/animals")
def get_animals():
    db = SessionLocal()
    try:
        return db.query(Animal).all()
    finally:
        db.close()


@app.get("/animals/{animal_id}")
def get_animal(animal_id: int):
    db = SessionLocal()
    try:
        animal = db.query(Animal).filter(Animal.id == animal_id).first()
        if not animal:
            raise HTTPException(status_code=404, detail="Жануар табылмады")
        return animal
    finally:
        db.close()


@app.post("/donate")
def donate(payload: DonationCreate):
    db = SessionLocal()
    try:
        animal = db.query(Animal).filter(Animal.id == payload.animal_id).first()
        if not animal:
            raise HTTPException(status_code=404, detail="Жануар табылмады")
        donation = Donation(animal_id=payload.animal_id, amount=payload.amount)
        db.add(donation)
        db.commit()
        db.refresh(donation)
        return {
            "id": donation.id,
            "animal_id": donation.animal_id,
            "amount": donation.amount,
        }
    finally:
        db.close()
