import json
import os

locales_dir = r"c:\Users\tesla\Music\MES AFFAIRES\BanKK\client\public\locales"
languages = ["fr", "en", "es", "it", "pt", "de"]

# Force specific structure
def force_keys(data, lang):
    if "common" not in data: data["common"] = {}
    
    learn_more_map = {
        "fr": "En savoir plus",
        "en": "Learn more",
        "es": "Saber más",
        "it": "Saperne di più",
        "pt": "Saber mais",
        "de": "Mehr erfahren"
    }
    data["common"]["learn_more"] = learn_more_map.get(lang, "Learn more")

    if "home" not in data: data["home"] = {}
    
    if "services" not in data["home"]: data["home"]["services"] = {}
    services_label_map = {
        "fr": "EXPERTISES",
        "en": "EXPERTISE",
        "es": "EXPERIENCIA",
        "it": "COMPETENZE",
        "pt": "COMPETÊNCIAS",
        "de": "KOMPETENZEN"
    }
    # Ensure it's a dict if it was somehow something else
    if not isinstance(data["home"]["services"], dict):
        # Backup if it was a string? Unlikely but let's be safe
        data["home"]["services"] = {"title": data["home"]["services"]}
    
    data["home"]["services"]["label"] = services_label_map.get(lang, "EXPERTISE")

    if "simulator" not in data["home"]: data["home"]["simulator"] = {}
    simulator_label_map = {
        "fr": "SIMULATEUR",
        "en": "SIMULATOR",
        "es": "SIMULADOR",
        "it": "SIMULATORE",
        "pt": "SIMULADOR",
        "de": "SIMULATOR"
    }
    if not isinstance(data["home"]["simulator"], dict):
        data["home"]["simulator"] = {"title": data["home"]["simulator"]}

    data["home"]["simulator"]["label"] = simulator_label_map.get(lang, "SIMULATOR")
    
    return data

for lang in languages:
    file_path = os.path.join(locales_dir, lang, "translation.json")
    if os.path.exists(file_path):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
                if not content.strip():
                    data = {}
                else:
                    data = json.loads(content)
            
            data = force_keys(data, lang)
            
            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"Successfully forced keys in {lang}/translation.json")
        except Exception as e:
            print(f"Error processing {lang}: {e}")
    else:
        print(f"File not found: {file_path}")
