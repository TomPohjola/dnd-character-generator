
let timerKäynnissä = false; //flagi seuraamaan onko timer käynnissä. tästä pitää tehdä globaali, ku muuten joka kerta funktion kutsussa se resetoituisi falseksi. tää boolean muuttuja on siis sitä varten, että estetään käyttäjää generoimasta useampia statseja yhtä aikaa.
let hahmonTausta = "human"; //alustetaan tää humaniksi, ku se on vakiona ruudulla sivun avatessa.
let hahmonSukupuoli = "male";
let hahmonLuokka = "artificer";

      document.getElementsByClassName("arvo-hahmo-nappi")[0].addEventListener("click", arvoHahmo); //napin event handleri
      //document.getElementsByClassName("arvo-hahmo-nappi")[0].addEventListener("click", haeNimi);

      document.querySelector("select.valitsin").addEventListener('change', function(e) {
      hahmonTausta = e.target.selectedOptions;
      hahmonTausta = hahmonTausta[0].id; //täällä hahmonTausta tehdään joko human, dwarf, elf tai orc.
      console.log(hahmonTausta);
      });
          
      document.querySelector("select.valitsin2").addEventListener('change', function(e) {
      hahmonSukupuoli = e.target.selectedOptions;
      hahmonSukupuoli = hahmonSukupuoli[0].id; //täällä tehdään hahmonSukupuolesta joko mies tai nainen.
      console.log(hahmonSukupuoli);
          });

      document.querySelector("select.valitsin3").addEventListener('change', function(e) {
      hahmonLuokka = e.target.selectedOptions;
      hahmonLuokka = hahmonLuokka[0].id; //täällä valitaan hahmon luokka, vaikuttaa hitpointseihin ja armor classiin.
      console.log(hahmonLuokka);
          });
    

function arvoHahmo()
{

    //console.log(timerKäynnissä);  //debuggailua
    //console.log(hahmonTausta + " " + hahmonSukupuoli);

    if(!timerKäynnissä) //tsekataan onko timer käynnis, jos ei oo niin sit sallitaan koodin suoritus.
    {
        timerKäynnissä = true;
        const statsId = ["str","dex","con","int","wis","cha"]; //tallennetaan tänne html elementtien ID:t joihin voidaan sit referoida jatkossa dynaamisesti
        const modsId = ["strmod","dexmod","conmod","intmod","wismod","chamod"];
        const mods = []; //tyhjä taulukko, johon aluksi tallennetaan suorat rollit, joista myöhemmin lasketaan ability modifierit.
        const modsLaskettu = []; //tänne tulee lasketut ability modifierit jatkokäyttöä varten
        let kierros = 0; //arvotaan luku 5 kertaa ennen kuin vaihdetaan ability score, tässä muuttuja pitään kierroksia yllä.
        let index = 0;  //indeksiluku eri abilityscorejen elementtien ID:ille.
        let vaihto = 0; //muuttuja, jonka perässä pyörii ability scorejen vaihto.

        for(let i = 0; i < statsId.length; i++)
        {
          document.getElementById(statsId[i]).innerHTML = "-";  //resetoidaan joka kerta ability scoret.
          document.getElementById(modsId[i]).innerHTML = "-";
        }
          document.getElementById("nimi").innerHTML = "-"; //resetoidaan nimi
          document.getElementById("hp").innerHTML = "-";
          document.getElementById("ac").innerHTML = "-";
          document.getElementById("pb").innerHTML = "-";
          document.getElementById("ssdc").innerHTML = "-";

        const intervaId = setInterval(() => //täällä suoritetaan timerin starttaaminen lambdafunktiona, arpoo 100ms intervallilla uuden luvun.
        {
            let rolli1 = Math.floor(Math.random() * (7 - 1) + 1); //arvotaan 4 rollia 1-6 väliltä math.floor funktiossa, mikä siis pyöristää floatit yms. alimpaan kokonaislukuun
            let rolli2 = Math.floor(Math.random() * (7 - 1) + 1);
            let rolli3 = Math.floor(Math.random() * (7 - 1) + 1);
            let rolli4 = Math.floor(Math.random() * (7 - 1) + 1);

            const rollTaulukko = [rolli1, rolli2, rolli3, rolli4];
            const rollattuTaulukko = bubbleSort(rollTaulukko, 4) //sortataan taulukko pienimmästä suurmipaan.

            let rollSumma = rollattuTaulukko[1] + rollattuTaulukko[2] + rollattuTaulukko[3] //summasta jätetään pienin luku pois

                document.getElementById(statsId[index]).innerHTML = rollSumma; //printataan näytölle ability score
                mods[index] = rollSumma; //asetetaan mods taulukkoon suorat rollit, muutetaan myöhemmin laskulla ability modifiereiksi kaavalla roll - 10 / 2 ja pyöristys alas.
                kierros++     
                    if(kierros >= 5)
                        {
                        index++      
                        vaihto++
                        kierros = 0;
                        }
                    if(vaihto >= 6)
                    {
                        timerKäynnissä = false; //resetoidaan flagi falseksi.
                        kierros = 0;
                        vaihto = 0;
                        index = 0;
                        asetaTaustaBonukset(mods, statsId); //annetaan bonukset hahmon taustan mukaan
                        asetaModifierit(mods, modsLaskettu); //täällä lasketaan ability modifierit ja asetetaan ne näytölle. ottaa parametrinä mods taulukon, josta modit lasketaan.
                        haeNimi(); //haetaan nimi täällä vasta ettei se ilmesty ennen statien generointia.
                        asetaHPJaAc(modsLaskettu);//annetaan constituion modifieri HP laskuun.
                        clearInterval(intervaId);   //täällä pysäytetään timeri ja resetoidaan muuttujat.
                    }

        }, 100)
    }
}


async function haeNimi()
{
    try //virheenkäsittelyä try catchilla API virheiden varalta
    {
        let tausta = null; //alustetaan tausta ja sukupuoli nulliksi
        let sukupuoli = null;
        const taustaTaulukko = ["human", "dwarf", "elf", "orc"]; //taulukoita vertailuun ja parametrien asettamiseen
        const taustaParam = ["h", "d", "e", "o"];
        const sukupuoliTaulukko = ["male", "female"];
        const sukupuoliParam = ["m", "f",];

        for(let i = 0; i < taustaTaulukko.length; i++) //asetetaan taustaparametri "let tausta" oikeaksi hahmon taustan mukaan
            {
                if(taustaTaulukko[i] == hahmonTausta)
                    {
                        //console.log(taustaParam[i]);
                        tausta = taustaParam[i];
                        break;
                    }
            }
         for(let i = 0; i < sukupuoliTaulukko.length; i++) //asetetaan sukupuoliparametri "let sukupuoli oikeaksi hahmon sukupuolen mukaan
            {
                //console.log(sukupuoliTaulukko[i]);
                if(sukupuoliTaulukko[i] == hahmonSukupuoli)
                    {
                        //console.log(sukupuoliParam[i]);
                        sukupuoli = sukupuoliParam[i];
                        break;
                    }
            }

        const response = await fetch(`https://fantasyname.lukewh.com/?gender=${sukupuoli}&family=t&ancestry=${tausta}`); //laitetaan parametrit apin urliin
        const nimiData = await response.text(); //otetaan apin tulokset vastaan ja tehdään siitä teksimuotoinen
        //console.log(nimiData);
        
        document.getElementById("nimi").innerHTML = nimiData;
        
        if(!response.ok) //tarkistus, jos response EI ole ok.
            {
                throw new Error("Dataa ei saatu haettua");
            }     

    }
    catch(error)
        {
        console.error(error);
        document.getElementById("nimi").innerHTML ="virhe";
        }

}

function bubbleSort(arr, n) { //tällä funktiolla sortataan taulukko pienimmästä suurimpaan, jotta pienin rolli voidaan erotella ja ottaa pois. 
    let swapped = false;    //tää funktio löytyi stack overflowsta.
    for(let i = 0;i < n; i++){
        swapped = false;
        for(let j = 0 ; j < n - i -1; j++){
            if( arr[j] > arr[j+1]){
                [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
                swapped = true;
            }
        }
        
        if( swapped === false) break;
    }
    return arr;
}

function asetaModifierit(mods, modsLaskettu)
{
    const modsId = ["strmod","dexmod","conmod","intmod","wismod","chamod"]; //taulukko modsien elementtien ID:itä varten.
    for(let i = 0; i < modsId.length; i++)
        {
        modsLaskettu[i] = Math.floor((mods[i] -10) / 2); //math.floorilla pyöristetään alimpaan tasalukuun
        document.getElementById(modsId[i]).innerHTML = modsLaskettu[i];
        }


}
function asetaHPJaAc(modsLaskettu)
{

    const hpPlussa = modsLaskettu[2]; //viitataan constitution modifieriin
    const acPlussa = modsLaskettu[1]; //viitataan dexterity modifieriin
    const intPlussa = modsLaskettu[3]; //viitataan dexterity modifieriin
    const proficienyBonus = 2;
    let luokkaNimi = "";
    const luokkaHP = new Map([ //tallennetaan mappiin hahmoluokkien base hp
      ["artificer", 8],
      ["barbarian", 12],
      ["Bard", 8],
      ["cleric", 8],
      ["druid", 8],
      ["fighter", 10],
      ["monk", 8],
      ["paladin", 10],
      ["ranger", 10],
      ["rogue", 8],
      ["sorcerer", 8],
      ["warlock", 8],
      ["wizard", 8],
    ]);

    for (const index of luokkaHP.keys()) 
    {
    luokkaNimi = index;
    console.log(hahmonLuokka);
    console.log(luokkaNimi);
      if(luokkaNimi === hahmonLuokka) //täällä verrataan aiemmin valittua hahmoluokkaa ja mapissa olevaa luokka-avainta, jos ne matchaa niin otetaan sen avaimen arvo
      {
        document.getElementById("hp").innerHTML = luokkaHP.get(luokkaNimi); + hpPlussa; //täällä asetetaan matchanneen luokan arvo
        document.getElementById("ac").innerHTML = 10 + acPlussa;
        document.getElementById("pb").innerHTML = proficienyBonus;
        document.getElementById("ssdc").innerHTML = proficienyBonus + 8 + intPlussa;
        break; //pysäytetään looppi
      }   
    }
}
function asetaTaustaBonukset(mods, statsId)
{
        if(hahmonTausta === "human")    //annetaan taustakohtaiset lisäpisteet modifiereihin
        {
                    for(let i = 0; i < mods.length; i++)    //human saa kaikeen plus 1
                {
                    mods[i] = mods[i]+1;
                    document.getElementById(statsId[i]).innerHTML = mods[i];
                }
        }
        if(hahmonTausta === "dwarf")
        {
                mods[2] = mods[2]+2; //kääpiö saa constitutioniin plus 2
                document.getElementById(statsId[2]).innerHTML = mods[2];
        }
        if(hahmonTausta === "elf")
        {
                mods[1] = mods[1]+2; //elf saa dexterityyn plus 2
                document.getElementById(statsId[1]).innerHTML = mods[1];
        }
        if(hahmonTausta === "orc")
        {
                mods[0] = mods[0]+2; //örkki saa str plus 2 ja con plus 1
                mods[2] = mods[2]+1;
                document.getElementById(statsId[0]).innerHTML = mods[0];
                document.getElementById(statsId[2]).innerHTML = mods[2];
        }
}
