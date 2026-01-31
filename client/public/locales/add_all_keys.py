import json
import os

locales_dir = r"c:\Users\tesla\Music\MES AFFAIRES\BanKK\client\public\locales"

# Define all translations
translations = {
    "fr": {
        "simulator_label": "SIMULATEUR",
        "services_label": "EXPERTISES",
        "learn_more": "En savoir plus"
    },
    "en": {
        "simulator_label": "SIMULATOR",
        "services_label": "EXPERTISE",
        "learn_more": "Learn more"
    },
    "es": {
        "simulator_label": "SIMULADOR",
        "services_label": "EXPERIENCIA",
        "learn_more": "Saber más"
    },
    "it": {
        "simulator_label": "SIMULATORE",
        "services_label": "COMPETENZE",
        "learn_more": "Saperne di più"
    },
    "pt": {
        "simulator_label": "SIMULADOR",
        "services_label": "COMPETÊNCIAS",
        "learn_more": "Saber mais"
    },
    "de": {
        "simulator_label": "SIMULATOR",
        "services_label": "KOMPETENZEN",
        "learn_more": "Mehr erfahren"
    }
}

for lang, trans in translations.items():
    file_path = os.path.join(locales_dir, lang, "translation.json")
    
    if os.path.exists(file_path):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            
            # Ensure structure exists
            if "home" not in data:
                data["home"] = {}
            
            if "simulator" not in data["home"]:
                data["home"]["simulator"] = {}
            
            if "services" not in data["home"]:
                data["home"]["services"] = {}
            
            if "common" not in data:
                data["common"] = {}
            
            # Add the keys
            data["home"]["simulator"]["label"] = trans["simulator_label"]
            data["home"]["services"]["label"] = trans["services_label"]
            data["common"]["learn_more"] = trans["learn_more"]
            
            # Write back
            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            
            print(f"✓ Updated {lang}/translation.json with all required keys")
            
        except Exception as e:
            print(f"✗ Error processing {lang}: {e}")
    else:
        print(f"✗ File not found: {file_path}")

print("\n✓ All translation files updated successfully!")
