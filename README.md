# Widget Add Secure Layer
Widget umožňuje přihlásit uživatele k aplikaci ArcGIS Experience Builder. Po přihlášení uživatele dojde k dodatečnému načtení nakonfigurovaných vrstev do mapy. Vrstvy jsou načteny pouze za předpokladu, že uživatel disponuje příslušnými oprávněními.<br>

Jako vrstvy lze konfigurovat mapové služby (MAP_SERVICE), Feature služby (FEATURE_LAYER) a samostatné vrstvy mapových služeb (FEATURE_LAYER). Více v části **Nastavení widgetu**.

![preview](https://user-images.githubusercontent.com/57621708/183145127-96fde795-3e0a-4592-add8-53413be928dc.png)

# Nastavení widgetu
## Mapa
Mapa, do které se budou dodatečné vrstvy přidávat.

## AppID
ID aplikace zaregistrované na AOL / Portalu. Více o registraci [ZDE](https://doc.arcgis.com/en/arcgis-online/manage-data/add-items.htm#REG_APP).

## Portal URL
URL organizace AOL nebo Portal for ArcGIS.

## Vrstvy
Konfigurace se uzavírá do pole (array) jednotlivých vrstev. Konfigurace vrstvy se provádí pomocí objektu, který má tři atributy: <br>
- `"type": "MAP_SERVICE"` nebo `"FEATURE_LAYER"` **(povinný)**
- `"position"`: Pořadí vrstvy v rámci mapy (číslo 1 - počet vrstev v mapě) **(nepovinný)**
- `"settings":` Properties konstruktoru třídy [FeatureLayer](https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html) nebo [MapImageLayer](https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-MapImageLayer.html) dle dokumentace [ArcGIS API for JavaScript 4.x](https://developers.arcgis.com/javascript/latest/api-reference/) **(povinný)**

Podrobnosti o nastavení vrstev jsou uvedeny níže.

### Atribut `"position"`
Pokud není atribut nakonfigurován, vrstva je vložena na nejvyšší pozici v mapě. Pokud není atribut nakonfigurován u žádné vrstvy v konfiguraci, vrstvy jsou vloženy do mapy v pořadí, ve kterém jsou uvedeny v konfiguraci - opět na nejvyšší pozici.<br>
Číslo 1 znamená, že vrstva bude vložena na nejvyšší pozici v mapě, číslo 2 na druhou nejvyšší pozici atd. Pokud tedy máme ve **zdrojové mapě 3 vrstvy** a nově vkládané vrstvě přiřadíme `"position": 2`, vloží se tato vrstva za první vrstvu zdorojové mapy na druhou nejvyšší pocici. Zbývající 2 vrstvy zdrojové mapy budou odsunuty na 3 a 4 pozici.<br> Pokud vkládáme dvě nové vrstvy, jedné přiřadíme `"position": 2` a druhé `"position": 4`, bude výsledná struktura vrstev následující:
1. Původní zdrojová vrstva 1
2. Nově vložená vrstva 1
3. Původní zdrojová vrstva 2
4. Nově vložená vrstva 2
3. Původní zdrojová vrstva 3

**Pozor:** Pořadí vrstev v konfiguraci není možné obracet pomocí atributu `"position"`, tj. později konfigurované vrstvy nesmí mít nižší pozici než vrstvy dříve konfigurované:<br>
**Správně**
```
[
    {
      "settings": {
        "title": "Vrstva 1"
      },
      "position": 3 
    },
    {
      "settings": {
        "title": "Vrstva 2"
      },
      "position": 4
    },
    {
      "settings": {
        "title": "Vrstva 3"
      },
      "position": 6
    }
]
```

**Špatně** - Vrstva 3 má nižší pozici než dříve konfigurované vrstvy. Abychom vrstvu dostali na 2 pozici v mapě, je potřeba objekt její konfigurace přesutnout nad vrstvu 1 a 2.
```
[
    {
      "settings": {
        "title": "Vrstva 1"
      },
      "position": 3 
    },
    {
      "settings": {
        "title": "Vrstva 2"
      },
      "position": 4
    },
    {
      "settings": {
        "title": "Vrstva 3"
      },
      "position": 2
    }
]
```
**Pozn:** Vrstvou se v tomto případě rozumí služba, nikoliv jednotlivé podvrstvy.

### Atribut `"settings"`
V rámci `"settings"` lze nastavit jakoukoliv vlastnost (properties) dle dokumentace [ArcGIS API for JavaScript 4.x](https://developers.arcgis.com/javascript/latest/api-reference/), která podporuje `autocast` (popupTemplate, opacity, visible, ...).<br>
Tímto způsobem lze provést např. kompletní nastavení pop-up oken apod. Využít lze i možnosti načíst vrstvu pomocí vlastnosti `portalItem.id`. V tomto případě se nastavení symbologie, filtrů, pop-up oken atd. převezmou z nastavení položky AOL / Portalu.<br>

Properties dokumentace je nutné přepsat do JSON syntaxe. V zásadě se jedná pouze o uzavírání jednotlivých properties do uvozovek.<br>
Místo dokumentace ArcGIS JS API lze využít i příslušné části předpisu webové mapy na [ArcGIS Online Assistant](https://ago-assistant.esri.com/). Postup by pak zahrnoval sestavit pomocnou webovou mapu z vrtev, které chceme po přihlášení přidat do do cílové webové mapy, resp. aplikace. Přejít na JSON předpis pomocné webové mapy na ArcGIS Online Assistant a odtud zkopírovat příslušné části týkající se vrstev do konfigurace widgetu. Zde je již syntaxe finální a není potřeba nic měnit. Pomocnou webovou mapu pak lze smazat. 

#

**Příklad kompletního nastavení:**<br>
```
[
    {
      "type": "FEATURE_LAYER",
      "position": 3,
      "settings": {
        "portalItem": {
          "id": "fe0758d61676440aa6d1446e4090d9bb"
        },
        "title": "Feature služba",
        "layerId": 0
      }
    },
    {
      "type": "MAP_SERVICE",
      "position": 4,
      "settings": {
        "url": "https://mapy.mesto-most.cz/server/rest/services/ServiceFolder/ServiceName/MapServer",
        "title": "Mapová služba"
      }
    },
    {
        "type": "FEATURE_LAYER",
        "position": 6,
        "settings": {
          "url": "https://mapy.mesto-most.cz/server/rest/services/ServiceFolder/ServiceName/MapServer/1",
          "title": "Vrstva mapové služby"
        }
    }
]
```

## Formátování textu
V rámci nastavení lze ovlivňovat barvu, zarovnání a velikost textu. Velikost loga přihlášeného uživatele se automaticky přizpůsobí velikosti textu - ke změně velikosti dojde až po restartu aplikace.
