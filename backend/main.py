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


SEED_ANIMALS = [{'name': 'Киік',
  'description': 'Сирек дала жануары, ашық кеңістік пен тыныш орта қажет.',
  'image_url': 'https://images.unsplash.com/photo-1599907339757-bcd005a3fb0d?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2FpZ2F8ZW58MHx8MHx8fDA%3D',
  'story': 'Киік — Қазақстан даласының символы және ерекше нәзік жануар.\n'
           '\n'
           'Оған кең қозғалыс аймағы, ашық кеңістік әрі үркітпейтін тыныш орта қажет. Табиғатта киіктер үлкен топпен '
           'көшіп-қонып жүреді, сондықтан қауіпсіздік пен бақылау маңызды.\n'
           '\n'
           'Сіздің қолдауыңыз қорек қорын тұрақтандыруға, ветеринарлық тексерулерге және қоршаған ортаны жақсартуға '
           'көмектеседі. Қоғамдық қолдау арқылы бұл сирек түрді қорғауға және болашақ ұрпаққа сақтауға болады.',
  'progress': 35},
 {'name': 'Жолбарыс',
  'description': 'Күшті жыртқыш, белсенді қозғалыс пен кең аймақ қажет.',
  'image_url': 'https://images.unsplash.com/photo-1500463959177-e0869687df26?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'story': 'Жолбарыс — күшті жыртқыш әрі табиғаттағы тепе-теңдіктің маңызды бөлігі.\n'
           '\n'
           'Оған белсенді қозғалыс, кең аумақ және мінез-құлқын табиғи түрде көрсетуге мүмкіндік беретін орта қажет. '
           'Дұрыс күтім, байыту элементтері және тұрақты ветеринарлық бақылау оның денсаулығына тікелей әсер етеді.\n'
           '\n'
           'Қолдау арқылы қауіпсіз қоршауларды жетілдіруге, сапалы азықтандыруға және жануардың күйзелісін азайтатын '
           'жағдай жасауға үлес қоса аласыз.',
  'progress': 42},
 {'name': 'Қоңыр аю',
  'description': 'Ірі жануар, кең орын мен байыту элементтері қажет.',
  'image_url': 'https://images.unsplash.com/photo-1595173425119-1c54835c1874?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YnJvd24lMjBiZWFyfGVufDB8fDB8fHww',
  'story': 'Қоңыр аю — ірі әрі ақылды жануар, ол ортадағы өзгерістерге өте сезімтал.\n'
           '\n'
           'Оған кең орын, көлеңкелі аймақ, суат және белсенділікке арналған байыту құралдары қажет. Аюлардың табиғи '
           'мінезін қолдау үшін ойын, иіс арқылы іздеу және қорек табу тапсырмалары маңызды.\n'
           '\n'
           'Сіздің көмегіңіз орта байыту элементтерін көбейтуге, дұрыс рационды қамтамасыз етуге және күтім сапасын '
           'жақсартуға бағытталады.',
  'progress': 28},
 {'name': 'Қасқыр',
  'description': 'Әлеуметтік жыртқыш, топтық орта маңызды.',
  'image_url': 'https://images.unsplash.com/photo-1562522845-b2d5197e3b23?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d29sZiUyMHpvb3xlbnwwfHwwfHx8MA%3D%3D',
  'story': 'Қасқыр — әлеуметтік жыртқыш, ол топтық өмірге бейімделген және өзара байланысқа мұқтаж.\n'
           '\n'
           'Қасқырларға қозғалыс, иіс арқылы зерттеу және топ ішінде қауіпсіз қарым-қатынасты сақтайтын орта маңызды. '
           'Қоршаған орта неғұрлым бай болса, жануардың мінез-құлқы соғұрлым табиғи болады.\n'
           '\n'
           'Қоғамдық қолдау серуен аймақтарын жақсартуға, байыту құралдарын қосуға және жануарлардың табиғи мінезін '
           'сақтауға көмектеседі.',
  'progress': 31},
 {'name': 'Піл',
  'description': 'Ақылды әрі сезімтал жануар, кең орын қажет.',
  'image_url': 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1200&q=80',
  'story': 'Піл — ең ақылды әрі сезімтал жануарлардың бірі, оның эмоциясы мен жады өте күшті.\n'
           '\n'
           'Оған кеңістік, тұрақты күтім, әлеуметтік байланыс және су процедуралары қажет. Дұрыс рацион, аяқ-қол '
           'күтімі және күнделікті белсенділік — пілдің әл-ауқатының негізгі бөлігі.\n'
           '\n'
           'Сіздің қолдауыңыз инфрақұрылымды жақсартуға, күтім жабдықтарын толықтыруға және жануарға қолайлы орта '
           'жасауға бағытталады.',
  'progress': 53},
 {'name': 'Түйе',
  'description': 'Төзімді жануар, құрғақ климатқа бейімделген.',
  'image_url': 'https://images.unsplash.com/photo-1634471815607-1794ba38e4d9?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2FtZWwlMjB6b298ZW58MHx8MHx8fDA%3D',
  'story': 'Түйе — төзімді жануар, ол құрғақ климатқа жақсы бейімделгенімен, тұрақты күтім мен дұрыс қорек қажет '
           'етеді.\n'
           '\n'
           'Оған таза су, минералды қоспалар, көлеңке және тынығу аймағы маңызды. Маусымдық күтім, жүнін тазалау және '
           'ветеринарлық бақылау түйенің денсаулығын сақтауға көмектеседі.\n'
           '\n'
           'Қолдау арқылы қорек сапасын арттыруға, күтім құралдарын жаңартуға және жануардың әл-ауқатын жақсартуға '
           'үлес қоса аласыз.',
  'progress': 24},
 {'name': 'Бегемот',
  'description': 'Су жануары, бассейн мен ылғалды орта қажет.',
  'image_url': 'https://images.unsplash.com/photo-1682172050888-b380af1b08b3?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aGlwcG9wb3RhbXVzJTIwem9vfGVufDB8fDB8fHww',
  'story': 'Бегемот — суға тәуелді ірі жануар, оның денсаулығы үшін су ортасының тазалығы шешуші рөл атқарады.\n'
           '\n'
           'Оған бассейн, жеткілікті тереңдік, көлеңке және құрғақ демалыс аймағы қажет. Су сапасы, температура және '
           'қауіпсіздік — күнделікті бақылауды талап етеді.\n'
           '\n'
           'Сіздің көмегіңіз су жүйесін күтіп ұстауға, бассейнді тазалауға және қауіпсіз орта қалыптастыруға '
           'бағытталады.',
  'progress': 38},
 {'name': 'Бизон',
  'description': 'Күшті тұяқты жануар, кең жайылым қажет.',
  'image_url': 'https://images.unsplash.com/photo-1564059440318-dbe81576d63b?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ymlzb24lMjB6b298ZW58MHx8MHx8fDA%3D',
  'story': 'Бизон — күшті тұяқты жануар, оған кең жайылым және тұрақты қозғалыс өте маңызды.\n'
           '\n'
           'Табиғи мінез-құлқын қолдау үшін кең аумақ, сапалы шөп, минералды тұз және ауа райынан қорғайтын паналау '
           'орны қажет.\n'
           '\n'
           'Қоғамдық қолдау жайылым инфрақұрылымын жақсартуға, қорек қорын толықтыруға және жануарлардың денсаулығын '
           'бақылауға көмектеседі.',
  'progress': 34},
 {'name': 'Елік',
  'description': 'Нәзік жануар, тыныш орта қажет.',
  'image_url': 'https://images.unsplash.com/photo-1647784025602-df1cd69178b1?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGVlciUyMHpvb3xlbnwwfHwwfHx8MA%3D%3D',
  'story': 'Елік — нәзік әрі сақ жануар, ол кенет дыбыстар мен стресс факторларына тез әсерленеді.\n'
           '\n'
           'Оған тыныш орта, жасырынатын бұталар, жұмсақ қозғалыс аймақтары және тұрақты қорек қажет. Қауіпсіздік пен '
           'бақылау еліктің өзін сенімді сезінуіне ықпал етеді.\n'
           '\n'
           'Сіздің қолдауыңыз қоректендіру сапасын көтеруге, қоршаған ортаны жақсартуға және жануардың қауіпсіздігін '
           'күшейтуге бағытталады.',
  'progress': 30},
 {'name': 'Қоқиқаз',
  'description': 'Әсем құс, су ортасы қажет.',
  'image_url': 'https://images.unsplash.com/photo-1649601697362-ceb083e22100?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmxhbWluZ28lMjB6b298ZW58MHx8MHx8fDA%3D',
  'story': 'Қоқиқаз — әсем құс, ол су аймағында өмір сүруге бейімделген және топпен жүргенді ұнатады.\n'
           '\n'
           'Оларға таза су, қолайлы тереңдік, тыныштық және дұрыс қорек (минералдар мен микроэлементтерге бай) қажет. '
           'Су сапасы тұрақты сақталса, құстардың денсаулығы да жақсарады.\n'
           '\n'
           'Қолдау арқылы су аймағын күтіп ұстауға, қоректі жақсартуға және құстарға қолайлы орта жасауға көмектесе '
           'аласыз.',
  'progress': 46}]


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
