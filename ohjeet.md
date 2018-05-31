## Ohjeita

Pyrkimys on ollut tehdä käyttöliittymästä niin riisuttu, että sovelluksen käyttö
olisi itsestään selvää. Alla siis täsmällisten käyttöohjeiden sijaan selitystä
mihin tätä on tarkoitus käyttää, ja kuka saa tehdä mitäkin.

Roolit:
- Käyttäjät ovat joko **työnjohtajia** tai **työntekijöitä**
- Oikeudet vastaavasti ovat **admin** vs. **peruskäyttäjä**
- Siis työnjohtajat (=admin) näkevät kaiken ja saavat pääsääntöisesti tehdä
  kaikkea ...
- ... kun taas työntekijöillä (=peruskäyttäjä) on lukuoikeus lähinnä vain
  tietokohteisiin joihin työnjohtajat heitä osoittavat, ja sitäkin rajallisemmat
  muokkausoikeudet

Tietokohteet:
- **Henkilöstö** käytännössä on sama kuin käyttäjä. Jaetaan kahteen rooliin yllä
  kuvatulla tavalla. Henkilöt ovat myös "resursseja" sillä heille osoitetaan
  töitä ja he kirjaavat mitä töissä saavat aikaan.
- **Työmaa** on sovelluksen keskeisin käsite: projektinhallinnallinen
  kustannuskeskus jonka alle työt jäsennellään ja resursoidaan. Työmaalla on
  paljon kytköksiä suoraan tai välillisesti muihin tietokohteisiin.
- **Asiakas** on melko triviaali käsite, jolla lähinnä ryhmitellään työmaita
  (eli asiakas on työmaan omistaja).
- **Materiaalit** ovat kaikkea työmailla tarvittavaa krääsää. Materiaalit
  määritellään keskitetysti "katalogiksi" josta on helppo ja nopea poimia
  vakiovaihtoehtoja töitä suunnitellessa ja raportoidessa.
- **Tehtävä** kuvaa jonkin konkreettisen asian, joka työmaalla pitää saada
  aikaan -- eli mitä pitää tehdä, milloin, ja kuinka paljon aikaa sekä
  materiaaleja siihen arviolta tarvitaan. Yhdellä työmaalla voi olla useita
  tehtäviä.
- **Suorite** puolestaan kuvaa tehtyä työtä -- mitä tehtiin, kenen toimesta,
  milloin, ja kuinka paljon työtunteja ja materiaaleja kului. Työntekijät
  kirjaavat suoritteita tehtäviin. Yhdellä tehtävällä voi olla useita
  suoritteita.
- Siis työmaan tavoitteet jäsennellään tehtävinä, joihin liittyy aika- ja
  materiaalibudjetti, ja toteutuneet työt kirjataan tehtäviin suoritteina.
  Tällöin nähdään mm. alkuperäisen arvion ja lopullisen toteuman välinen
  epäsuhta niin ajassa kuin materiaaleissa. Näitä voidaan sitten tarkastella
  summatasolla esim. työmaittain, asiakkaittain, henkilöittäin ... (ei tosin
  vielä mahdollista itse sovelluksessa)
- Pois lukien suoritteet, jokaisella näistä tietokohteista on sovelluksessa oma
  osionsa, joiden rakenne on aina sama (ylätasolla listanäkymä ja sitten
  yksityiskohtaisempi näkymä yksittäiselle tietokohteelle). Osiot löytää oikean
  yläkulman hampurilaispalkista.
- Lisäksi suurimpaan osaan tietokohteista voi lisätä **liitteitä** ja
  **huomioita**, ja nämä toiminevat ihan kuten nimensä antaa ymmärtää.

Esimerkki miten käyttö lähtisi puhtaalta pöydältä, olettaen että järjestelmässä
on työnjohtaja (eli admin) X:
- Työnjohtaja X luo uuden asiakkaan
- Työnjohtaja X luo asiakkaalle yhden tai useampia työmaita
  - Työmaille on myös nimettävä manageri, joten X joko asettaa itsensä tähän
    rooliin, tai luo lisää työnjohtajia ja nimeää jonkun heistä (tämä on vain
    muodollisuus)
- Työnjohtaja X luo materiaaleja joita työmailla yleensä tarvitaan
  - Nämä muodostavat määrämuotoisen pudotusvalikon jota käytetään aina töitä
    määriteltäessä
- Työnjohtaja X luo muutama peruskäyttäjää, jotta työmaat saadaan miehitettyä
  - Uudet käyttäjät saavat kutsun spostitse, jolla pääsevät kirjautumaan
    sovellukseen
- Työnjohtaja X valitsee jonkun työmaan ja osoittaa siihen työntekijöitä
  - Nyt osoitetuilla työntekijöillä on täydet lukuoikeudet kyseiseen työmaahan
  - Lisäksi heillä on oikeus kirjata suoritteita mihin hyvänsä työmaan avoimista
    tehtävistä
- Työnjohtaja X kirjaa työmaalle yhden tai useampia tehtäviä
  - Jokaiseen tehtävään määritellään muiden tietojen ohella myös materiaaliarvio
- Sitten työntekijöiden vuoro: työntekijät kirjaavat näihin tehtäviin
  suoritteita töiden edetessä, joista näkyy käytetty aika ja materiaalit
  - Ainoastaan suoritteen kirjaajalla on oikeus muokata suoritetta (eli edes
    admin ei pääse peukaloimaan työntekijöiden raportointia)
  - Näin ollen jos työnjohtajat haluavat kirjata suoritteita, heidän on ensin
    osoitettava itsensä työmaan työntekijöiksi ... ;-)
  - Suoritteelle tarvitaan työnjohtajan hyväksyntä; ja kun suorite on kuitattu,
    sitä ei enää voi muokata
- Työnjohtaja X voi halutessaan merkata tehtävän suoritetuksi
  - Tällöin siihen ei enää voi kohdistaa uusia suoritteita
  - Suljetun tehtävän voi myös avata uudelleen
- Tämän ohella käyttäjät voivat liittää esim. sopimusasiakirjoja asiakkaisiin,
  materiaalispeksejä materiaaleihin, valokuvia tehtäviin ja suoritteisiin ... ja
  huomioita (a.k.a. kommentteja) milloin minnekin

Demoversiossa on pohjalla vähän läppäsisältöä havainnollistamistarkoituksessa,
eli ihan puhtaalta pöydältä ei pääse kokeilemaan.

Tässä vielä [linkki](https://sauma-demo.herokuapp.com) demoon.
