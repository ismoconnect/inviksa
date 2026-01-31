import json
import os

locales_dir = r"c:\Users\tesla\Music\MES AFFAIRES\BanKK\client\public\locales"
languages = ["fr", "en", "es", "it", "pt", "de"]

for lang in languages:
    file_path = os.path.join(locales_dir, lang, "translation.json")
    if os.path.exists(file_path):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                # json.load will take the last value for duplicate keys
                data = json.load(f)
            
            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"Cleaned up and deduplicated {lang}/translation.json")
        except Exception as e:
            print(f"Error cleaning {lang}: {e}")
