import json
import os

locales_dir = r"c:\Users\tesla\Music\MES AFFAIRES\BanKK\client\public\locales"
languages = ["fr", "en", "es", "it", "pt", "de"]

translations = {
    "fr": {
        "common": {"learn_more": "En savoir plus"},
        "home": {
            "services": {"label": "EXPERTISES"},
            "simulator": {"label": "SIMULATEUR"}
        }
    },
    "en": {
        "common": {"learn_more": "Learn more"},
        "home": {
            "services": {"label": "EXPERTISE"},
            "simulator": {"label": "SIMULATOR"}
        }
    },
    "es": {
        "common": {"learn_more": "Saber más"},
        "home": {
            "services": {"label": "EXPERIENCIA"},
            "simulator": {"label": "SIMULADOR"}
        }
    },
    "it": {
        "common": {"learn_more": "Saperne di più"},
        "home": {
            "services": {"label": "COMPETENZE"},
            "simulator": {"label": "SIMULATORE"}
        }
    },
    "pt": {
        "common": {"learn_more": "Saber mais"},
        "home": {
            "services": {"label": "COMPETÊNCIAS"},
            "simulator": {"label": "SIMULADOR"}
        }
    },
    "de": {
        "common": {"learn_more": "Mehr erfahren"},
        "home": {
            "services": {"label": "KOMPETENZEN"},
            "simulator": {"label": "SIMULATOR"}
        }
    }
}

def update_json(data, update):
    for key, value in update.items():
        if isinstance(value, dict) and key in data and isinstance(data[key], dict):
            update_json(data[key], value)
        else:
            data[key] = value

for lang in languages:
    file_path = os.path.join(locales_dir, lang, "translation.json")
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        
        update_json(data, translations[lang])
        
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Updated {lang}/translation.json")
    else:
        print(f"File not found: {file_path}")
