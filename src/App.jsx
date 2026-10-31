import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import loadingImage from '../LoadingPage.png'
import introVideo from '../1.mp4'
import introAudio from '../audio1.mp3'
import logoImage from '../logo.png'
import { tracks } from './tracks.js'
import { circuitLayouts } from './circuitLayouts.js'
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, CalendarDays, ChevronDown,
  ChevronLeft, ChevronRight, Clock3, ExternalLink, Gauge, MapPin, Menu,
  Play, Radio, Search, ShieldCheck, Trophy, Volume2, VolumeX, X, Zap, Globe2,
} from 'lucide-react'

const races = [
  { round: '20', name: 'Mexico City Grand Prix', location: 'Mexico City, Mexico', date: 'NOV 01–02', flag: '🇲🇽', next: true },
  { round: '21', name: 'São Paulo Grand Prix', location: 'São Paulo, Brazil', date: 'NOV 06–08', flag: '🇧🇷' },
  { round: '22', name: 'Las Vegas Grand Prix', location: 'Las Vegas, United States', date: 'NOV 19–21', flag: '🇺🇸' },
  { round: '23', name: 'Qatar Grand Prix', location: 'Lusail, Qatar', date: 'NOV 27–29', flag: '🇶🇦' },
  { round: '24', name: 'Abu Dhabi Grand Prix', location: 'Yas Island, UAE', date: 'DEC 04–06', flag: '🇦🇪' },
]

const eras = [
  { years: '1950s–1960s', name: 'The pioneers', engine: 'Naturally aspirated · front to mid-engine', rivalry: 'Fangio vs. Moss · Clark vs. Hill', safety: 'From open roads to purpose-built circuits.', story: 'The first world championship begins. Lightweight chassis, new engineering ideas and fearless drivers turn grand prix racing into Formula 1.' },
  { years: '1970s–1980s', name: 'Ground effect & turbo', engine: 'Flat-12 · V8 · turbocharged V6', rivalry: 'Lauda vs. Hunt · Prost vs. Senna', safety: 'Survival cells and circuit safety become essential.', story: 'Ground-effect aerodynamics and turbo power raise the stakes as charismatic rivalries define a golden age of racing.' },
  { years: '1990s–2000s', name: 'The V10 soundtrack', engine: '3.0L V10 · later 2.4L V8', rivalry: 'Schumacher vs. Häkkinen · Schumacher vs. Alonso', safety: 'The HANS device advances driver protection.', story: 'High-revving engines soundtrack a data revolution, with Ferrari and a new generation of champions at the center.' },
  { years: '2010s–2025', name: 'Hybrid & ground effect', engine: '1.6L turbo-hybrid V6 · sustainable fuels', rivalry: 'Hamilton vs. Rosberg · Hamilton vs. Verstappen', safety: 'The Halo and stronger crash structures save lives.', story: 'Hybrid efficiency becomes a performance advantage. Ground effect returns and the championship becomes a global, data-rich spectacle.' },
  { years: '2026+', name: 'A new grid', engine: 'Advanced sustainable fuel · next-gen hybrid', rivalry: 'A new generation writes the next chapter.', safety: 'Efficiency meets ever-higher safety standards.', story: 'A fresh power-unit formula, sustainable fuels and an 11-team grid set the stage for Formula 1’s next era.' },
]

const portraits = {
  'Michael Schumacher': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/Michael_Schumacher%2C_September_2005.jpg/500px-Michael_Schumacher%2C_September_2005.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'Lewis Hamilton': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d3/Prime_Minister_Keir_Starmer_meets_Sir_Lewis_Hamilton_%2854566928382%29_%28cropped%29.jpg/500px-Prime_Minister_Keir_Starmer_meets_Sir_Lewis_Hamilton_%2854566928382%29_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'Juan Manuel Fangio': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/20/Fangio_in_1955_%28cropped%29.jpg/500px-Fangio_in_1955_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'Alain Prost': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/74/Festival_automobile_international_2015_-_Photocall_-_065_%28cropped3%29.jpg/500px-Festival_automobile_international_2015_-_Photocall_-_065_%28cropped3%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'Sebastian Vettel': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/af/Sebastian_Vettel_at_the_2026_Italian_Grand_Prix.jpg/500px-Sebastian_Vettel_at_the_2026_Italian_Grand_Prix.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'Max Verstappen': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3973_by_Stepro_%28medium_crop%29.jpg/500px-2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3973_by_Stepro_%28medium_crop%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'Ayrton Senna': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/Ayrton_Senna_Pesawat_RC_Cropped.jpg/500px-Ayrton_Senna_Pesawat_RC_Cropped.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'Niki Lauda': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2d/Lauda_at_1982_Dutch_Grand_Prix.jpg/500px-Lauda_at_1982_Dutch_Grand_Prix.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'Sir Jackie Stewart': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4b/Jackie_Stewart_at_the_2014_WEC_Silverstone_round.jpg/500px-Jackie_Stewart_at_the_2014_WEC_Silverstone_round.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'George Russell': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7f/KingsLeonSilverstne040724_%2828_of_112%29_%2853838006028%29_%28cropped%29.jpg/500px-KingsLeonSilverstne040724_%2828_of_112%29_%2853838006028%29_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'Andrea Kimi Antonelli': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/ff/2026-08-23_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2026_STP_3010_%28cropped2%29.jpg/500px-2026-08-23_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2026_STP_3010_%28cropped2%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'Charles Leclerc': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d5/Charles_Leclerc_at_the_2026_Cannes_Film_Festival_%28cropped%29.jpg/500px-Charles_Leclerc_at_the_2026_Cannes_Film_Festival_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'Lando Norris': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3968_by_Stepro_%28cropped2%29.jpg/500px-2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3968_by_Stepro_%28cropped2%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'Oscar Piastri': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e5/2026_Chinese_GP_-_Oscar_Piastri_%28cropped%29_%28cropped%29.jpg/500px-2026_Chinese_GP_-_Oscar_Piastri_%28cropped%29_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'Isack Hadjar': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/75/Isack_Hadjar_at_the_Melbourne_Walk_during_the_2026_Australian_Grand_Prix_%28028A8753%29_%28cropped%29.jpg/500px-Isack_Hadjar_at_the_Melbourne_Walk_during_the_2026_Australian_Grand_Prix_%28028A8753%29_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'Liam Lawson': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/88/Liam_Lawson_at_the_Red_Bull_Fan_Zone_%E2%80%93_Crown_Riverwalk%2C_Melbourne_%28028A7795%29.jpg/500px-Liam_Lawson_at_the_Red_Bull_Fan_Zone_%E2%80%93_Crown_Riverwalk_%2C_Melbourne_%28028A7795%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'Arvid Lindblad': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0c/Arvid_Lindblad_at_the_Red_Bull_Fan_Zone_%E2%80%93_Crown_Riverwalk%2C_Melbourne_%28028A7869%29_%28cropped%29.jpg/500px-Arvid_Lindblad_at_the_Red_Bull_Fan_Zone_%E2%80%93_Crown_Riverwalk%2C_Melbourne_%28028A7869%29_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'Pierre Gasly': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3e/Pierre_Gasly_2017_Malaysia.jpg/500px-Pierre_Gasly_2017_Malaysia.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'Franco Colapinto': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1c/Franco_Colapinto_at_the_Melbourne_Walk_during_the_2026_Australian_Grand_Prix_%28028A8698%29_cropped.jpg/500px-Franco_Colapinto_at_the_Melbourne_Walk_during_the_2026_Australian_Grand_Prix_%28028A8698%29_cropped.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'Oliver Bearman': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9a/2025_Japan_GP_-_Haas_-_Oliver_Bearman_-_Thursday_%28cropped%29.jpg/500px-2025_Japan_GP_-_Haas_-_Oliver_Bearman_-_Thursday_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'Esteban Ocon': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2e/Esteban_Ocon_2024_Suzuka_%28cropped%29.jpg/500px-Esteban_Ocon_2024_Suzuka_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'Nico Hülkenberg': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/de/2019_Formula_One_tests_Barcelona%2C_Hulkenberg_%2840287128313%29.jpg/500px-2019_Formula_One_tests_Barcelona%2C_Hulkenberg_%2840287128313%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'Gabriel Bortoleto': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/25/Gabriel_Bortoleto_at_the_Melbourne_Walk_during_the_2026_Australian_Grand_Prix_%28028A8581%29_cropped.jpg/500px-Gabriel_Bortoleto_at_the_Melbourne_Walk_during_the_2026_Australian_Grand_Prix_%28028A8581%29_cropped.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'Carlos Sainz Jr.': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/01/Carlos_Sainz_at_the_83rd_Venice_FILM_festival-9_%28cropped%29.jpg/500px-Carlos_Sainz_at_the_83rd_Venice_FILM_festival-9_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'Alex Albon': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4a/Alex_Albon_at_the_Melbourne_Walk_during_the_2026_Australian_Grand_Prix_%28028A8626%29_%28cropped%29.jpg/500px-Alex_Albon_at_the_Melbourne_Walk_during_the_2026_Australian_Grand_Prix_%28028A8626%29_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'Fernando Alonso': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/97/Alonso-68_%2824710447098%29.jpg/500px-Alonso-68_%2824710447098%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'Lance Stroll': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/2025_Japan_GP_-_Aston_Martin_-_Lance_Stroll_-_Fanzone_Stage_%28cropped%29.jpg/500px-2025_Japan_GP_-_Aston_Martin_-_Lance_Stroll_-_Fanzone_Stage_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'Valtteri Bottas': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/20/Valtteri_Bottas_at_the_2026_Adelaide_Motorsport_Festival_%28028A7556%29.jpg/500px-Valtteri_Bottas_at_the_2026_Adelaide_Motorsport_Festival_%28028A7556%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'Sergio Pérez': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7a/Sergio_P%C3%A9rez_2019_%28cropped%29.jpg/500px-Sergio_P%C3%A9rez_2019_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'Yuki Tsunoda': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a0/Yuki_Tsunoda_at_the_Melbourne_Walk_during_the_2026_Australian_Grand_Prix_%28028A8096%29.jpg/500px-Yuki_Tsunoda_at_the_Melbourne_Walk_during_the_2026_Australian_Grand_Prix_%28028A8096%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
}

const champions = [
  { name: 'Michael Schumacher', titles: 7, years: '1991–2006, 2010–2012', teams: 'Benetton · Ferrari · Mercedes', flag: '🇩🇪', highlight: 'Five consecutive titles; Ferrari’s defining modern champion.' },
  { name: 'Lewis Hamilton', titles: 7, years: '2007–present', teams: 'McLaren · Mercedes · Ferrari', flag: '🇬🇧', highlight: 'A record-equalling champion and a standard-bearer for the sport.' },
  { name: 'Juan Manuel Fangio', titles: 5, years: '1950–1958', teams: 'Alfa Romeo · Mercedes · Ferrari', flag: '🇦🇷', highlight: 'Five titles with four different teams in just eight seasons.' },
  { name: 'Alain Prost', titles: 4, years: '1980–1993', teams: 'McLaren · Renault · Williams', flag: '🇫🇷', highlight: 'The Professor: measured, precise, and a four-time champion.' },
  { name: 'Sebastian Vettel', titles: 4, years: '2007–2022', teams: 'Red Bull · Ferrari · Aston Martin', flag: '🇩🇪', highlight: 'Four consecutive titles and a run of extraordinary precision.' },
  { name: 'Max Verstappen', titles: 4, years: '2015–present', teams: 'Toro Rosso · Red Bull', flag: '🇳🇱', highlight: 'A fierce, instinctive racer who redefined the modern benchmark.' },
  { name: 'Ayrton Senna', titles: 3, years: '1984–1994', teams: 'Toleman · Lotus · McLaren · Williams', flag: '🇧🇷', highlight: 'Three titles, 65 poles, and a legacy beyond the sport.' },
  { name: 'Niki Lauda', titles: 3, years: '1971–1979, 1982–1985', teams: 'Ferrari · Brabham · McLaren', flag: '🇦🇹', highlight: 'A remarkable comeback and three championships across two eras.' },
  { name: 'Sir Jackie Stewart', titles: 3, years: '1965–1973', teams: 'BRM · Matra · Tyrrell', flag: '🇬🇧', highlight: 'Three-time champion and a tireless advocate for driver safety.' },
]

const constructors = [
  { name: 'Mercedes-AMG Petronas F1 Team', short: 'Mercedes', color: '#00D2BE', engine: 'Mercedes', logo: '', drivers: [{ name: 'George Russell', number: '63', flag: '🇬🇧' }, { name: 'Andrea Kimi Antonelli', number: '12', flag: '🇮🇹' }] },
  { name: 'Scuderia Ferrari HP', short: 'Ferrari', color: '#E10600', engine: 'Ferrari', logo: 'https://cdn.simpleicons.org/ferrari/E10600', drivers: [{ name: 'Lewis Hamilton', number: '44', flag: '🇬🇧', url: 'https://www.lewishamilton.com' }, { name: 'Charles Leclerc', number: '16', flag: '🇲🇨' }] },
  { name: 'McLaren F1 Team', short: 'McLaren', color: '#FF8000', engine: 'Mercedes', logo: 'https://cdn.simpleicons.org/mclaren/FF8000', drivers: [{ name: 'Lando Norris', number: '1', flag: '🇬🇧', url: 'https://landonorris.com' }, { name: 'Oscar Piastri', number: '81', flag: '🇦🇺' }] },
  { name: 'Oracle Red Bull Racing', short: 'Red Bull', color: '#3671C6', engine: 'Red Bull Ford', logo: 'https://cdn.simpleicons.org/redbull/3671C6', drivers: [{ name: 'Max Verstappen', number: '3', flag: '🇳🇱', url: 'https://www.verstappen.com' }, { name: 'Isack Hadjar', number: '6', flag: '🇫🇷' }] },
  { name: 'Visa Cash App RB', short: 'Racing Bulls', color: '#6692FF', engine: 'Red Bull Ford', logo: 'https://cdn.simpleicons.org/visa/6692FF', drivers: [{ name: 'Liam Lawson', number: '30', flag: '🇳🇿' }, { name: 'Arvid Lindblad', number: '41', flag: '🇬🇧' }, { name: 'Yuki Tsunoda', number: '22', flag: '🇯🇵', reserve: true }] },
  { name: 'BWT Alpine F1 Team', short: 'Alpine', color: '#FF87BC', engine: 'Mercedes', logo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4a/BWT_Alpine_F1_Team_Logo.png/330px-BWT_Alpine_F1_Team_Logo.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', drivers: [{ name: 'Pierre Gasly', number: '10', flag: '🇫🇷' }, { name: 'Franco Colapinto', number: '43', flag: '🇦🇷' }] },
  { name: 'MoneyGram Haas F1 Team', short: 'Haas', color: '#B6BABD', engine: 'Ferrari', logo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/18/TGR_Haas_F1_Team_Logo_%282026%29.svg/330px-TGR_Haas_F1_Team_Logo_%282026%29.svg.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', drivers: [{ name: 'Oliver Bearman', number: '87', flag: '🇬🇧' }, { name: 'Esteban Ocon', number: '31', flag: '🇫🇷' }] },
  { name: 'Audi Revolut F1 Team', short: 'Audi', color: '#F50537', engine: 'Audi', logo: 'https://cdn.simpleicons.org/audi/F50537', drivers: [{ name: 'Nico Hülkenberg', number: '27', flag: '🇩🇪' }, { name: 'Gabriel Bortoleto', number: '5', flag: '🇧🇷' }] },
  { name: 'Atlassian Williams Racing', short: 'Williams', color: '#64C4FF', engine: 'Mercedes', logo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/12/Atlassian_Williams_F1_Team_logo.svg/330px-Atlassian_Williams_F1_Team_logo.svg.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', drivers: [{ name: 'Carlos Sainz Jr.', number: '55', flag: '🇪🇸' }, { name: 'Alex Albon', number: '23', flag: '🇹🇭' }] },
  { name: 'Aston Martin Aramco F1 Team', short: 'Aston Martin', color: '#229971', engine: 'Honda', logo: 'https://cdn.simpleicons.org/astonmartin/229971', drivers: [{ name: 'Fernando Alonso', number: '14', flag: '🇪🇸' }, { name: 'Lance Stroll', number: '18', flag: '🇨🇦' }] },
  { name: 'Cadillac Formula 1 Team', short: 'Cadillac', color: '#D5D5D5', engine: 'Ferrari', logo: 'https://cdn.simpleicons.org/cadillac/D5D5D5', drivers: [{ name: 'Valtteri Bottas', number: '77', flag: '🇫🇮' }, { name: 'Sergio Pérez', number: '11', flag: '🇲🇽' }] },
]

const pastTeams = [
  { name: 'Team Lotus', years: '1958–1994', titles: 7, note: 'Revolutionary engineering. A racing dynasty.', mark: 'LOTUS', color: '#D7AE36' },
  { name: 'Brabham', years: '1962–1992', titles: 2, note: 'A constructor built by racers, for racers.', mark: 'BT', color: '#3D8EDB' },
  { name: 'Tyrrell Racing', years: '1970–1998', titles: 1, note: 'The little team that took on the giants.', mark: 'TYRRELL', color: '#2D9B6F' },
  { name: 'Benetton Formula', years: '1986–2001', titles: 1, note: 'Bold colors. A fearless route to the top.', mark: 'B', color: '#55BFE8' },
  { name: 'Brawn GP', years: '2009', titles: 1, note: 'One season. One double championship. 100%.', mark: 'BRAWN', color: '#C8D647' },
]

const results = [
  { place: '01', driver: 'Andrea Kimi Antonelli', team: 'Mercedes', time: '1:35:16.650', points: 25, flag: '🇮🇹' },
  { place: '02', driver: 'Charles Leclerc', team: 'Ferrari', time: '+13.078s', points: 18, flag: '🇲🇨' },
  { place: '03', driver: 'Max Verstappen', team: 'Red Bull Racing', time: '+17.485s', points: 15, flag: '🇳🇱' },
  { place: '04', driver: 'Lewis Hamilton', team: 'Ferrari', time: '+18.515s', points: 12, flag: '🇬🇧' },
  { place: '05', driver: 'Lando Norris', team: 'McLaren', time: '+30.521s', points: 10, flag: '🇬🇧' },
]

const standings = [
  { pos: '01', driver: 'Andrea Kimi Antonelli', team: 'Mercedes', points: 365, flag: '🇮🇹' },
  { pos: '02', driver: 'George Russell', team: 'Mercedes', points: 242, flag: '🇬🇧' },
  { pos: '03', driver: 'Lewis Hamilton', team: 'Ferrari', points: 241, flag: '🇬🇧' },
  { pos: '04', driver: 'Max Verstappen', team: 'Red Bull Racing', points: 236, flag: '🇳🇱' },
  { pos: '05', driver: 'Charles Leclerc', team: 'Ferrari', points: 233, flag: '🇲🇨' },
]

const driverAchievements = {
  'George Russell': '2022 São Paulo Grand Prix winner; multiple-time race winner with Mercedes.',
  'Andrea Kimi Antonelli': 'Italian F4 and Formula Regional European champion; Mercedes junior graduate.',
  'Lewis Hamilton': 'Seven-time World Champion; more than 100 Grand Prix wins and pole positions.',
  'Charles Leclerc': 'Multiple Grand Prix winner; first F1 victory at Spa in 2019; Monaco winner in 2024.',
  'Lando Norris': 'First Grand Prix victory at Miami in 2024; 2024 Formula One World Championship runner-up.',
  'Oscar Piastri': 'Grand Prix winner and 2024 constructors’ champion with McLaren; former F2 and F3 champion.',
  'Max Verstappen': 'Four-time World Champion (2021–2024); youngest Grand Prix winner in F1 history.',
  'Isack Hadjar': '2024 Formula 2 runner-up; earned his first F1 podium in 2025.',
  'Liam Lawson': '2023 Super Formula runner-up; multiple points finishes in Formula 1.',
  'Arvid Lindblad': '2024 Formula Regional Oceania champion and FIA Formula 3 race winner.',
  'Yuki Tsunoda': 'Multiple F1 top-five finishes; made his Formula 1 debut in 2021.',
  'Pierre Gasly': '2020 Italian Grand Prix winner; 2016 GP2 Series champion.',
  'Franco Colapinto': 'Spanish F4 champion; race winner in both Formula 3 and Formula 2.',
  'Oliver Bearman': '2021 Italian F4 champion; scored points on his Formula 1 debut.',
  'Esteban Ocon': '2021 Hungarian Grand Prix winner; champion in GP3 and FIA Formula 3.',
  'Nico Hülkenberg': '2009 GP2 Asia champion; claimed his first Formula 1 podium at Silverstone in 2025.',
  'Gabriel Bortoleto': 'Back-to-back junior champion: FIA Formula 3 in 2023 and Formula 2 in 2024.',
  'Carlos Sainz Jr.': 'Four-time Grand Prix winner; first F1 victory at Silverstone in 2022.',
  'Alex Albon': 'Multiple Formula 1 podium finisher; best championship result of seventh in 2020.',
  'Fernando Alonso': 'Two-time World Champion (2005, 2006) and 32-time Grand Prix winner.',
  'Lance Stroll': 'Three-time podium finisher; took pole position at the 2020 Turkish Grand Prix.',
  'Valtteri Bottas': 'Ten Grand Prix wins, 20 pole positions and 67 podiums.',
  'Sergio Pérez': 'Six-time Grand Prix winner; first Mexican driver to win a Formula 1 Grand Prix.',
}

const navigation = [['Weekend', '#hero'], ['The story', '#history'], ['Legends', '#legends'], ['The grid', '#grid'], ['Circuits', '#circuits'], ['Archive', '#archive'], ['Race center', '#race-center']]

const trackCountries = [...new Set(tracks.map((track) => track.country))].sort()
function circuitPaths(layout) {
  if (!layout || layout.length < 3) return null

  const leftBoundary = layout.map(([x, y, leftWidth], index) => {
    const previous = layout[(index + layout.length - 1) % layout.length]
    const next = layout[(index + 1) % layout.length]
    const dx = next[0] - previous[0]
    const dy = next[1] - previous[1]
    const length = Math.hypot(dx, dy) || 1
    return [x - (dy / length) * leftWidth, y + (dx / length) * leftWidth]
  })
  const rightBoundary = layout.map(([x, y, , rightWidth], index) => {
    const previous = layout[(index + layout.length - 1) % layout.length]
    const next = layout[(index + 1) % layout.length]
    const dx = next[0] - previous[0]
    const dy = next[1] - previous[1]
    const length = Math.hypot(dx, dy) || 1
    return [x + (dy / length) * rightWidth, y - (dx / length) * rightWidth]
  })

  const bounds = [...leftBoundary, ...rightBoundary]
  const minX = Math.min(...bounds.map(([x]) => x))
  const maxX = Math.max(...bounds.map(([x]) => x))
  const minY = Math.min(...bounds.map(([, y]) => y))
  const maxY = Math.max(...bounds.map(([, y]) => y))
  const scale = Math.min(336 / (maxX - minX || 1), 116 / (maxY - minY || 1))
  const offsetX = (360 - (maxX - minX) * scale) / 2
  const offsetY = (140 - (maxY - minY) * scale) / 2
  const toSvg = ([x, y]) => [
    (offsetX + (x - minX) * scale).toFixed(2),
    (offsetY + (maxY - y) * scale).toFixed(2),
  ]
  const path = (points) => points.map((point, index) => {
    const [x, y] = toSvg(point)
    return `${index === 0 ? 'M' : 'L'}${x} ${y}`
  }).join(' ')
  const centerline = `${path(layout.map(([x, y]) => [x, y]))} Z`
  const outline = `${path(leftBoundary)} ${path(rightBoundary.slice().reverse()).replace(/^M/, 'L')} Z`

  return { centerline, outline }
}

function SectionHeading({ eyebrow, title, copy, light = false }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      className="section-heading mb-9 flex flex-wrap items-end justify-between gap-5"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div>
        <div className={`section-kicker ${light ? 'text-[#e10600]' : ''}`}>{eyebrow}</div>
        <h2 className={`section-title ${light ? 'text-[#101116]' : ''}`}>{title}</h2>
        {copy && <p className={`mt-3 max-w-xl text-sm leading-6 ${light ? 'text-black/50' : 'text-white/45'}`}>{copy}</p>}
      </div>
    </motion.div>
  )
}

function IntroSequence({ onComplete }) {
  const [stage, setStage] = useState('loading')
  const [videoReady, setVideoReady] = useState(false)
  const [loadingDelayComplete, setLoadingDelayComplete] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [videoError, setVideoError] = useState(false)
  const videoRef = useRef(null)
  const audioRef = useRef(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoadingDelayComplete(true), 1200)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (videoReady && loadingDelayComplete && stage === 'loading') {
      setStage('video')
    }
  }, [videoReady, loadingDelayComplete, stage])

  useEffect(() => {
    if (stage === 'video') {
      startPlayback()
    }
  }, [stage])

  const startPlayback = async () => {
    const video = videoRef.current
    const audio = audioRef.current
    if (!video) return

    // Video is muted, so modern browsers always allow it to autoplay without user interaction
    try {
      await video.play()
    } catch (err) {
      console.warn('Video play deferred:', err)
    }

    // Try playing audio: if browser policy allows, it plays; otherwise wait for click to unmute
    if (audio) {
      try {
        audio.currentTime = video.currentTime || 0
        await audio.play()
        setIsMuted(false)
      } catch (err) {
        console.info('Audio autoplay waiting for user interaction (click anywhere to unmute).')
        setIsMuted(true)
      }
    }
  }

  const toggleSound = async (e) => {
    e?.stopPropagation()
    const video = videoRef.current
    const audio = audioRef.current
    if (!audio || !video) return

    if (isMuted) {
      try {
        audio.currentTime = video.currentTime || 0
        await audio.play()
        setIsMuted(false)
      } catch (err) {
        console.error('Failed to unmute audio:', err)
      }
    } else {
      audio.pause()
      setIsMuted(true)
    }
  }

  const handleContainerClick = (e) => {
    if (e.target.closest('.intro-skip') || e.target.closest('.intro-sound-toggle') || e.target.closest('.intro-start-btn')) return
    if (isMuted && stage === 'video') {
      toggleSound()
    }
  }

  const startNowWithGesture = (e) => {
    e?.stopPropagation()
    setStage('video')
    setTimeout(() => {
      startPlayback()
      toggleSound()
    }, 50)
  }

  const handleTimeUpdate = () => {
    const video = videoRef.current
    const audio = audioRef.current
    if (!video || !audio || isMuted || audio.paused) return
    // Resync if audio and video drift by more than 0.3s
    if (Math.abs(video.currentTime - audio.currentTime) > 0.3) {
      audio.currentTime = video.currentTime
    }
  }

  const handleVideoPlay = () => {
    const video = videoRef.current
    const audio = audioRef.current
    if (!video || !audio || isMuted) return
    audio.currentTime = video.currentTime || 0
    audio.play().catch(() => {})
  }

  const handlePlaybackError = (error) => {
    const video = videoRef.current
    if (video?.error) {
      console.error('Video failed to load:', error)
      setVideoError(true)
    }
  }

  const finishIntro = () => {
    videoRef.current?.pause()
    audioRef.current?.pause()
    onComplete()
  }

  return (
    <div className="intro-screen" onClick={handleContainerClick}>
      {stage === 'loading' && (
        <>
          <img className="intro-loading-image" src={loadingImage} alt="Formula Vault" />
          <div className="intro-loading-shade" />
          <div className="intro-loading-ui" aria-live="polite">
            <div className="intro-loading-brand">
              <img src={logoImage} alt="" />
              <span>FORMULA VAULT <i>//</i> RACE CENTER</span>
            </div>
            <div className="intro-loading-status"><span /> {videoReady ? 'GRID READY' : 'PREPARING YOUR GRID'}</div>
            <div className="intro-loading-message">
              <span className="mono-label">THE RACE STARTS HERE</span>
              <p>Every lap. Every legend.<br /><strong>One destination.</strong></p>
              <div className="intro-loading-progress" role="progressbar" aria-label="Preparing intro">
                <span />
              </div>
              <span className="intro-loading-caption">LOADING YOUR RACE WEEKEND</span>
              <div style={{ marginTop: '18px', pointerEvents: 'auto' }}>
                <button
                  type="button"
                  className="intro-start-btn"
                  onClick={startNowWithGesture}
                >
                  START RACE EXPERIENCE <Play size={13} fill="currentColor" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <video
        ref={videoRef}
        className={`intro-video ${stage === 'loading' ? 'intro-video-preload' : ''}`}
        src={introVideo}
        preload="auto"
        muted
        playsInline
        autoPlay
        onCanPlay={() => setVideoReady(true)}
        onLoadedData={() => setVideoReady(true)}
        onPlay={handleVideoPlay}
        onPause={() => audioRef.current?.pause()}
        onWaiting={() => audioRef.current?.pause()}
        onTimeUpdate={handleTimeUpdate}
        onEnded={finishIntro}
        onError={(event) => handlePlaybackError(event.currentTarget.error)}
      />

      <div className="intro-controls">
        <button
          className={`intro-sound-toggle ${isMuted ? 'muted' : ''}`}
          type="button"
          onClick={toggleSound}
          title={isMuted ? "Click to unmute sound" : "Mute sound"}
          aria-label={isMuted ? "Unmute sound" : "Mute sound"}
        >
          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          <span>{isMuted ? 'UNMUTE SOUND' : 'SOUND ON'}</span>
        </button>

        <button className="intro-skip" type="button" onClick={finishIntro}>
          SKIP INTRO <ArrowRight size={15} />
        </button>
      </div>

      {stage === 'video' && isMuted && (
        <button
          type="button"
          className="intro-unmute-banner"
          onClick={toggleSound}
        >
          <Volume2 size={14} />
          <span>CLICK ANYWHERE FOR SOUND</span>
        </button>
      )}

      <audio
        ref={audioRef}
        src={introAudio}
        preload="auto"
      />

      {videoError && (
        <div className="intro-error" role="alert">
          <p>The intro video could not be loaded on your network connection.</p>
          <div>
            <button type="button" onClick={() => { setVideoError(false); startPlayback(); }}>TRY AGAIN</button>
            <button type="button" onClick={finishIntro}>CONTINUE TO SITE</button>
          </div>
        </div>
      )}
    </div>
  )
}

function App() {
  const [introComplete, setIntroComplete] = useState(false)

  useEffect(() => {
    if (introComplete && window.location.hash) {
      const target = document.querySelector(window.location.hash)
      if (target) {
        setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 120)
      }
    }
  }, [introComplete])

  if (!introComplete) {
    return <IntroSequence onComplete={() => setIntroComplete(true)} />
  }

  return <Site />
}

function Site() {
  const prefersReducedMotion = useReducedMotion()
  const [activeEra, setActiveEra] = useState(4)
  const [search, setSearch] = useState('')
  const [titleFilter, setTitleFilter] = useState('All champions')
  const [teamSearch, setTeamSearch] = useState('')
  const [trackSearch, setTrackSearch] = useState('')
  const [trackCountry, setTrackCountry] = useState('All countries')
  const [raceTab, setRaceTab] = useState('Upcoming')
  const [remaining, setRemaining] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' })
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const update = () => {
      const difference = Math.max(0, new Date('2026-11-01T14:00:00-06:00').getTime() - Date.now())
      const values = {
        days: Math.floor(difference / 86400000),
        hours: Math.floor((difference / 3600000) % 24),
        minutes: Math.floor((difference / 60000) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
      setRemaining(Object.fromEntries(Object.entries(values).map(([key, value]) => [key, String(value).padStart(2, '0')])))
    }
    update()
    const timer = window.setInterval(update, 1000)
    return () => window.clearInterval(timer)
  }, [])

  const filteredChampions = useMemo(() => champions.filter((driver) => {
    const matchesText = `${driver.name} ${driver.teams} ${driver.highlight}`.toLowerCase().includes(search.trim().toLowerCase())
    const matchesTitles = titleFilter === 'All champions' || (titleFilter === '7 titles' ? driver.titles === 7 : titleFilter === '4+ titles' ? driver.titles >= 4 : driver.titles === 3)
    return matchesText && matchesTitles
  }), [search, titleFilter])

  const filteredConstructors = useMemo(() => constructors.filter((team) => `${team.name} ${team.drivers.map((driver) => driver.name).join(' ')}`.toLowerCase().includes(teamSearch.trim().toLowerCase())), [teamSearch])
  const filteredTracks = useMemo(() => tracks.filter((track) => {
    const matchesText = `${track.name} ${track.city} ${track.country}`.toLowerCase().includes(trackSearch.trim().toLowerCase())
    return matchesText && (trackCountry === 'All countries' || track.country === trackCountry)
  }), [trackSearch, trackCountry])
  const circuitShapes = useMemo(
    () => Object.fromEntries(tracks.map((track) => [track.id, circuitPaths(circuitLayouts[track.id])])),
    [],
  )

  return (
    <main>
      <header className="topbar">
        <div className="topbar-inner">
          <a className="brand" href="#hero" aria-label="FormulaVault home" onClick={() => setMenuOpen(false)}>
            <img className="brand-mark" src={logoImage} alt="Formula Vault logo" /><span className="brand-name">FORMULA<span>VAULT</span></span>
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navigation.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
          </nav>
          <div className="live-pill"><span /> LIVE TRACK RADAR</div>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}>{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
        </div>
        <AnimatePresence>
          {menuOpen && <motion.nav className="mobile-nav" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            {navigation.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}<ArrowUpRight size={13} /></a>)}
          </motion.nav>}
        </AnimatePresence>
      </header>

      <section id="hero" className="hero">
        <img className="hero-photo" src="https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4b/FIA_F1_Austria_2026_Nr._12_Antonelli_%281%29.jpg/1280px-FIA_F1_Austria_2026_Nr._12_Antonelli_%281%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail" alt="Formula 1 car on track at the 2026 Austrian Grand Prix" />
        <div className="hero-shade" />
        <div className="hero-grid" />
        <div className="hero-content">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="round-chip"><span className="pulse-dot" /> ROUND 20 <span className="chip-divider" /> 2026 SEASON</div>
            <p className="hero-overline">THE COUNTDOWN IS ON</p>
            <h1>MEXICO CITY<br /><span>GRAND PRIX</span></h1>
            <div className="hero-place"><MapPin size={15} /> Autódromo Hermanos Rodríguez <span>·</span> NOV 01–02, 2026</div>
            <div className="hero-actions">
              <a className="button-primary" href="#race-center">VIEW RACE CENTER <ArrowRight size={15} /></a>
              <a className="button-outline" href="#grid">MEET THE GRID <ArrowDownRight size={14} /></a>
            </div>
          </motion.div>

          <motion.aside className="countdown-card" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65, delay: 0.18 }}>
            <div className="countdown-top"><div><div className="mono-label">LIGHTS OUT IN</div><div className="countdown-title">Mexico City Grand Prix</div></div><Clock3 size={17} /></div>
            <div className="countdown-units">
              {Object.entries(remaining).map(([label, value]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
            </div>
            <div className="countdown-footer"><span><CalendarDays size={13} /> NOV 01 · 14:00 LOCAL</span><span>UTC−6</span></div>
          </motion.aside>
        </div>
        <div className="hero-bottom">
          <div className="hero-bottom-inner">
            <div className="circuit-label"><span className="mexico-flag">🇲🇽</span><div><strong>HERMANOS RODRÍGUEZ</strong><small>19 TURNS <i>·</i> 4.304 KM <i>·</i> 2,240 M ALTITUDE</small></div></div>
            <div className="telemetry">
              {[['TRACK', '42°', 'C'], ['AIR', '24°', 'C'], ['HUMIDITY', '38', '%']].map(([label, value, unit]) => <div key={label}><small>{label}</small><strong>{value}<em>{unit}</em></strong></div>)}
              <div><small>TRACK STATUS</small><strong className="clear-status"><span /> CLEAR</strong></div>
            </div>
          </div>
        </div>
      </section>

      <div className="ticker" aria-label="Upcoming race schedule">
        <div className="ticker-label"><Radio size={12} /> NEXT ON THE CALENDAR</div>
        <div className="ticker-races">{races.map((race) => <a href="#race-center" key={race.round} className={race.next ? 'ticker-next' : ''}><span>{race.flag}</span><b>{race.name.replace(' Grand Prix', ' GP')}</b><small>{race.date}</small></a>)}</div>
      </div>

      <section id="history" className="section section-history">
        <div className="page-wrap">
          <SectionHeading eyebrow="01 — The timeline" title="75 years. One obsession." copy="The technology changes. The pursuit never does." />
          <div className="era-selector" role="tablist" aria-label="Formula 1 eras">
            {eras.map((era, index) => <button key={era.years} role="tab" aria-selected={activeEra === index} onClick={() => setActiveEra(index)} className={activeEra === index ? 'era-tab active' : 'era-tab'}><span>{era.years}</span><b>{era.name}</b></button>)}
          </div>
          <motion.article key={activeEra} className="era-feature" initial={{ opacity: 0, y: 9 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              <div className="era-feature-main"><span className="eyebrow-red">{String(activeEra + 1).padStart(2, '0')} / {eras[activeEra].years}</span><h3>{eras[activeEra].name}</h3><p>{eras[activeEra].story}</p><div className="era-controls"><span className="mono-label">ERA {String(activeEra + 1).padStart(2, '0')} OF 05</span><div><button aria-label="Previous era" onClick={() => setActiveEra((activeEra + eras.length - 1) % eras.length)}><ChevronLeft size={15} /></button><button aria-label="Next era" onClick={() => setActiveEra((activeEra + 1) % eras.length)}><ChevronRight size={15} /></button></div></div></div>
              <div className="era-facts">
                {[[<Zap size={16} />, 'POWER UNIT', eras[activeEra].engine], [<Trophy size={16} />, 'THE RIVALRIES', eras[activeEra].rivalry], [<ShieldCheck size={16} />, 'SAFETY', eras[activeEra].safety]].map(([icon, label, value]) => <div key={label}><span>{icon}</span><div><small>{label}</small><p>{value}</p></div></div>)}
              </div>
          </motion.article>
        </div>
      </section>

      <section id="legends" className="section section-legends">
        <div className="page-wrap">
          <SectionHeading eyebrow="02 — Hall of fame" title="Names that became legend." copy="Championships are counted. Greatness is remembered." />
          <div className="filter-bar">
            <label className="search-field"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a driver, team or moment" /></label>
            <label className="filter-select"><select value={titleFilter} onChange={(event) => setTitleFilter(event.target.value)}>{['All champions', '7 titles', '4+ titles', '3 titles'].map((option) => <option key={option}>{option}</option>)}</select><ChevronDown size={14} /></label>
            <span className="filter-count">{filteredChampions.length} CHAMPIONS</span>
          </div>
          <div className="champion-grid">
            {filteredChampions.length ? filteredChampions.map((driver, index) => <motion.article layout key={driver.name} className="champion-card" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ delay: index * 0.025 }}>
              <div className="champion-photo"><img src={portraits[driver.name]} alt={`${driver.name} portrait`} loading="lazy" /><div className="photo-shade" /><span className="driver-flag">{driver.flag}</span><span className="champion-count"><Trophy size={12} /> {driver.titles}×</span><h3>{driver.name}</h3></div>
              <div className="champion-info"><div className="champion-years">{driver.years}</div><p>{driver.highlight}</p><div className="champion-teams"><span>TEAMS</span>{driver.teams}</div></div>
            </motion.article>) : <div className="empty-state">No champions match your search. Try another name or filter.</div>}
          </div>
        </div>
      </section>

      <section id="grid" className="section section-grid">
        <div className="page-wrap">
          <SectionHeading eyebrow="03 — The 2026 season" title="Eleven teams. All in." copy="Meet the people and marques chasing the world championship." />
          <div className="grid-toolbar"><label className="search-field"><Search size={16} /><input value={teamSearch} onChange={(event) => setTeamSearch(event.target.value)} placeholder="Search a driver or constructor" /></label><span className="grid-count">11 CONSTRUCTORS <i>·</i> 22 RACE SEATS</span></div>
          <div className="constructor-grid">
            {filteredConstructors.length ? filteredConstructors.map((team, index) => <motion.article layout key={team.short} className="constructor-card" style={{ '--team-color': team.color }} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ delay: index * 0.025 }}>
              <div className="constructor-heading"><div className="team-logo">{team.short === 'Mercedes' && <svg viewBox="0 0 40 40" aria-label="Mercedes-Benz three-pointed star"><circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M20 4v16L7 28M20 20l13 8M20 20l-13 8" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>}{team.logo && <img src={team.logo} alt={`${team.short} logo`} loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none' }} />}{team.short !== 'Mercedes' && <span>{team.short.slice(0, 2).toUpperCase()}</span>}</div><div className="team-title"><small>2026 CONSTRUCTOR</small><h3>{team.name}</h3></div><span className="team-color-bar" /></div>
              <div className="constructor-drivers">{team.drivers.map((driver) => <div className="driver-row" key={driver.name}>
                <div className="driver-thumb"><img src={portraits[driver.name]} alt={`${driver.name} portrait`} loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none' }} /><span>{driver.flag}</span></div>
                <div className="driver-row-name"><span>{driver.name}{driver.reserve && <i>RESERVE</i>}</span><small>{driver.flag} <b>·</b> {team.short}</small></div>
                <strong className="driver-number">{driver.number}</strong>
                {driver.url && <a className="driver-link" href={driver.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${driver.name}'s official website`}><ExternalLink size={14} /></a>}
                <p className="driver-achievement"><Trophy size={12} /> {driverAchievements[driver.name]}</p>
              </div>)}</div>
              <div className="engine-row"><Gauge size={13} /><span>POWER UNIT</span><b>{team.engine}</b><ArrowUpRight size={13} /></div>
            </motion.article>) : <div className="empty-state">No teams or drivers match your search.</div>}
          </div>
        </div>
      </section>

      <section id="circuits" className="section section-circuits">
        <div className="page-wrap">
          <SectionHeading eyebrow="04 — The circuit archive" title="Every corner has a story." copy="Explore all 78 venues that have hosted a Formula One World Championship race. Real measured layouts are available for 22 circuits; the rest are clearly marked until verified geometry is available." />
          <div className="track-toolbar">
            <label className="search-field"><Search size={16} /><input value={trackSearch} onChange={(event) => setTrackSearch(event.target.value)} placeholder="Search a circuit, city or country" /></label>
            <label className="filter-select"><select value={trackCountry} onChange={(event) => setTrackCountry(event.target.value)}><option>All countries</option>{trackCountries.map((country) => <option key={country}>{country}</option>)}</select><ChevronDown size={14} /></label>
            <span className="track-count">{filteredTracks.length} / {tracks.length} CIRCUITS</span>
          </div>
          <div className="track-grid">
            {filteredTracks.map((track, index) => (
              <motion.article
                layout
                key={track.id}
                className={`track-card ${circuitShapes[track.id] ? '' : 'track-card-layout-missing'}`}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 24, scale: .98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: .12 }}
                transition={{ duration: prefersReducedMotion ? 0 : .55, delay: prefersReducedMotion ? 0 : (index % 4) * .045, ease: [.22, 1, .36, 1] }}
              >
                <div className="track-card-top"><span className="track-index">{String(tracks.indexOf(track) + 1).padStart(2, '0')}</span><span className="track-host"><Globe2 size={12} /> {track.country}</span></div>
                {circuitShapes[track.id] ? (
                    <svg className="track-trace" viewBox="0 0 360 140" role="img" aria-label={`Real circuit layout for ${track.name}`}>
                      <motion.path
                        className="track-outline"
                        d={circuitShapes[track.id].outline}
                        initial={prefersReducedMotion ? false : { pathLength: 0, opacity: .3 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        viewport={{ once: true, amount: .5 }}
                        transition={{ duration: prefersReducedMotion ? 0 : 1.8, ease: 'easeInOut' }}
                      />
                      <motion.path
                        className="track-centerline"
                        d={circuitShapes[track.id].centerline}
                        initial={prefersReducedMotion ? false : { pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true, amount: .5 }}
                        transition={{ duration: prefersReducedMotion ? 0 : 1.8, ease: 'easeInOut' }}
                      />
                    </svg>
                  ) : (
                    <div className="track-layout-unavailable"><MapPin size={16} /><span>Verified layout unavailable</span></div>
                  )}
                <div className="track-card-title"><h3>{track.name}</h3><p><MapPin size={13} /> {track.city}, {track.country}</p></div>
                <div className="track-card-meta">
                  <div><small>GPS LAT / LONG</small><strong>{track.latitude.toFixed(3)}°, {track.longitude.toFixed(3)}°</strong></div>
                  <div><small>FORMULA ONE</small><strong>WORLD CHAMPIONSHIP VENUE</strong></div>
                </div>
              </motion.article>
            ))}
            {!filteredTracks.length && <div className="empty-state">No circuits match your search. Try another location.</div>}
          </div>
          <p className="track-disclaimer">22 circuit outlines use measured centerline and width data from the <a href="https://github.com/TUMFTM/racetrack-database" target="_blank" rel="noopener noreferrer">TUM racetrack database (LGPL-3.0)</a>, derived from <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap data (ODbL)</a>. Other historical venues are listed with their verified location; layout data is not yet available. Circuit names and locations: Jolpica F1 API.</p>
        </div>
      </section>

      <section id="archive" className="section section-archive">
        <div className="page-wrap">
          <SectionHeading eyebrow="05 — Constructor archive" title="The greats before us." copy="The teams that changed how Formula 1 was built, driven and won." />
          <div className="archive-grid">{pastTeams.map((team, index) => <motion.article key={team.name} className="archive-card" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.05 }} style={{ '--archive-color': team.color }}>
            <div className="archive-mark">{team.mark}</div><div className="archive-year">{team.years}</div><h3>{team.name}</h3><div className="archive-title-count"><b>{team.titles}</b><span>CONSTRUCTORS’ TITLES</span></div><p>{team.note}</p>
          </motion.article>)}</div>
        </div>
      </section>

      <section id="race-center" className="section section-race">
        <div className="page-wrap">
          <SectionHeading eyebrow="06 — The race center" title="The season, in focus." copy="The calendar ahead. The results that count. The fight for the title." />
          <div className="race-layout">
            <div className="race-main">
              <div className="race-tabs">{['Upcoming', 'Previous result', 'Standings'].map((tab) => <button key={tab} onClick={() => setRaceTab(tab)} className={raceTab === tab ? 'active' : ''}>{tab}</button>)}</div>
                <motion.div key={raceTab} className="race-panel" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
                  {raceTab === 'Upcoming' && <><div className="panel-heading"><span>2026 FIA FORMULA ONE WORLD CHAMPIONSHIP</span><b>5 ROUNDS TO GO</b></div><div className="race-list">{races.map((race) => <div className={`race-row ${race.next ? 'next-race' : ''}`} key={race.round}><span className="race-round">R{race.round}</span><span className="race-flag">{race.flag}</span><div className="race-name"><b>{race.name}{race.next && <i>NEXT UP</i>}</b><small>{race.location}</small></div><span className="race-date">{race.date}</span><ChevronRight size={15} /></div>)}</div></>}
                  {raceTab === 'Previous result' && <><div className="panel-heading"><span>ROUND 19 / 24</span><b>UNITED STATES GRAND PRIX · AUSTIN</b></div><div className="result-list">{results.map((row) => <div className="result-row" key={row.place}><span className={row.place === '01' ? 'gold-text' : ''}>{row.place}</span><span>{row.flag}</span><div><b>{row.driver}</b><small>{row.team}</small></div><strong>{row.time}</strong><i>{row.points} PTS</i></div>)}</div></>}
                  {raceTab === 'Standings' && <><div className="panel-heading"><span>DRIVER CHAMPIONSHIP</span><b>AFTER ROUND 19</b></div><div className="standings-list">{standings.map((row) => <div className="standing-row" key={row.driver}><span className={row.pos === '01' ? 'gold-text' : ''}>{row.pos}</span><span>{row.flag}</span><div><b>{row.driver}</b><small>{row.team}</small></div><div className="points-track"><i style={{ width: `${(row.points / 365) * 100}%` }} /></div><strong>{row.points}<small>PTS</small></strong></div>)}</div></>}
                </motion.div>
            </div>
            <aside className="race-aside">
              <div className="aside-label"><span className="live-dot" /> THE TITLE FIGHT</div>
              <div className="aside-leader">
                <div className="leader-photo"><img src={portraits['Andrea Kimi Antonelli']} alt="Andrea Kimi Antonelli" loading="lazy" /></div>
                <div><span>CHAMPIONSHIP LEADER</span><h3>Andrea Kimi<br />Antonelli</h3><div className="leader-team">🇮🇹 &nbsp; MERCEDES</div></div>
              </div>
              <div className="leader-points"><strong>365</strong><span>POINTS<br />AFTER ROUND 19</span><Trophy size={18} /></div>
              <div className="gap-row"><span>LEAD OVER P2</span><b>+123 PTS</b></div>
              <a className="standings-link" href="#race-center" onClick={() => setRaceTab('Standings')}>FULL CHAMPIONSHIP STANDINGS <ArrowRight size={14} /></a>
            </aside>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="page-wrap footer-main">
          <div className="footer-about">
            <a className="brand" href="#hero" aria-label="FormulaVault home"><img className="brand-mark" src={logoImage} alt="Formula Vault logo" /><span className="brand-name">FORMULA<span>VAULT</span></span></a>
            <p>Every era. Every driver. Every circuit.<br />Built for the love of the race.</p>
          </div>
          <div className="footer-links"><h3>EXPLORE</h3>{navigation.map(([label, href]) => <a key={href} href={href}>{label}<ArrowUpRight size={12} /></a>)}</div>
          <div className="footer-links"><h3>THE ARCHIVE</h3><a href="#legends">World champions<ArrowUpRight size={12} /></a><a href="#grid">2026 driver grid<ArrowUpRight size={12} /></a><a href="#circuits">78 historic circuits<ArrowUpRight size={12} /></a><a href="#race-center">Race center<ArrowUpRight size={12} /></a></div>
          <div className="footer-data"><span className="mono-label">THE DETAILS MATTER</span><p>Driver achievements, season information and circuit locations in one place.</p><span className="footer-data-tag"><span /> BUILT FOR RACE DAY</span></div>
        </div>
        <div className="page-wrap footer-bottom">
          <span>© 2026 FORMULAVAULT <i>·</i> INDEPENDENT FAN PROJECT</span>
          <a href="#hero" className="back-top">BACK TO TOP <ArrowUpRight size={13} /></a>
        </div>
        <div className="page-wrap credits">Circuit outlines: TUM racetrack database (LGPL-3.0) <span>·</span> Geographic data: OpenStreetMap contributors (ODbL) <span>·</span> Circuit locations: Jolpica F1 API <span>·</span> Driver portraits: Wikimedia Commons contributors</div>
      </footer>
    </main>
  )
}

export default App
