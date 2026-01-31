import json
import os

def merge_dicts(dict1, dict2):
    for key, value in dict2.items():
        if key in dict1 and isinstance(dict1[key], dict) and isinstance(value, dict):
            merge_dicts(dict1[key], value)
        else:
            dict1[key] = value
    return dict1

def patch_file(file_path, patch_data):
    if not os.path.exists(file_path): return
    with open(file_path, "r", encoding="utf-8") as f:
        # custom merge pairs to handle duplicates if any
        def merge_pairs(pairs):
            d = {}
            for k, v in pairs:
                if k in d:
                    if isinstance(d[k], dict) and isinstance(v, dict):
                        merge_dicts(d[k], v)
                    else:
                        d[k] = v
                else:
                    d[k] = v
            return d
        data = json.load(f, object_pairs_hook=merge_pairs)
    
    merge_dicts(data, patch_data)
    
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    print(f"✅ Patched: {file_path}")

# Translations
TRANSLATIONS = {
    "en": {
        "about_page": { "values": { "title": "Our Values" } },
        "contact_page": {
            "info": {
                "address": { "title": "Our Headquarters", "lines": ["51, Boulevard Grande-Duchesse Charlotte", "L-1331 Luxembourg"] },
                "contact": { "title": "Direct Contact", "lines": ["+33 6 46 72 32 86", "contact-inviksa@monsupport-app.com"] }
            }
        },
        "services_page": {
            "hero": { "title": "OUR BANKING SERVICES", "subtitle": "YOUR FINANCIAL PARTNER" },
            "features_title": "Main Features", "use_cases_title": "Use Cases",
            "buttons": { "open_account": "Open an account", "simulate": "Simulate a credit" }
        },
        "cards": { "physical_order": { "status": { "default_reject_reason": "Incomplete or non-compliant identity documents." } } },
        "settings": { "profile": { "not_defined": "Not defined" } },
        "transfers": { "inputs": { "bic_placeholder": "BIC/SWIFT Code", "email_placeholder": "beneficiary@email.com", "iban_placeholder": "IBAN Number", "name_placeholder": "Full Name" } }
    },
    "es": {
        "about_page": { "values": { "title": "Nuestros Valores" } },
        "contact_page": {
            "info": {
                "address": { "title": "Nuestra Sede", "lines": ["51, Boulevard Grande-Duchesse Charlotte", "L-1331 Luxemburgo"] },
                "contact": { "title": "Contacto Directo", "lines": ["+33 6 46 72 32 86", "contact-inviksa@monsupport-app.com"] }
            }
        },
        "services_page": {
            "hero": { "title": "NUESTROS SERVICIOS BANCARIOS", "subtitle": "SU SOCIO FINANCIERO" },
            "features_title": "Características principales", "use_cases_title": "Casos de uso",
            "buttons": { "open_account": "Abrir una cuenta", "simulate": "Simular un crédito" }
        },
        "cards": { "physical_order": { "status": { "default_reject_reason": "Documentos de identidad incompletos o no conformes." } } },
        "settings": { "profile": { "not_defined": "No definido" } },
        "history": { "details": { "uncategorized": "Sin categoría" }, "types": { "unknown": "Desconocido" } }
    },
    "pt": {
        "about_page": { "values": { "title": "Nossos Valores" } },
        "contact_page": {
            "info": {
                "address": { "title": "Nossa Sede", "lines": ["51, Boulevard Grande-Duchesse Charlotte", "L-1331 Luxemburgo"] },
                "contact": { "title": "Contacto Direto", "lines": ["+33 6 46 72 32 86", "contact-inviksa@monsupport-app.com"] }
            }
        },
        "services_page": {
            "hero": { "title": "NOSSOS SERVIÇOS BANCÁRIOS", "subtitle": "O SEU PARCEIRO FINANCEIRO" },
            "features_title": "Principais características", "use_cases_title": "Casos de uso",
            "buttons": { "open_account": "Abrir uma conta", "simulate": "Simular um crédito" }
        },
        "cards": { "physical_order": { "status": { "default_reject_reason": "Documentos de identidade incompletos ou não conformes." } } },
        "settings": { "profile": { "not_defined": "Não definido" } },
        "history": { "details": { "uncategorized": "Sem categoria" }, "types": { "unknown": "Desconhecido" } }
    },
    "de": {
        "about_page": { "values": { "title": "Unsere Werte" } },
        "contact_page": {
            "info": {
                "address": { "title": "Unser Hauptsitz", "lines": ["51, Boulevard Grande-Duchesse Charlotte", "L-1331 Luxemburg"] },
                "contact": { "title": "Direkter Kontakt", "lines": ["+33 6 46 72 32 86", "contact-inviksa@monsupport-app.com"] }
            }
        },
        "services_page": {
            "hero": { "title": "UNSERE BANKDIENSTLEISTUNGEN", "subtitle": "IHR FINANZPARTNER" },
            "features_title": "Hauptfunktionen", "use_cases_title": "Anwendungsfälle",
            "buttons": { "open_account": "Konto eröffnen", "simulate": "Kredit simulieren" }
        },
        "cards": { "physical_order": { "status": { "default_reject_reason": "Unvollständige oder nicht konforme Ausweisdokumente." } } },
        "settings": { "profile": { "not_defined": "Nicht definiert" }, "messages": { "success": "Erfolgreich aktualisiert", "error": "Ein Fehler ist aufgetreten", "pwd_success": "Passwort aktualisiert", "pwd_error": "Fehler beim Aktualisieren" } },
        "history": { "details": { "uncategorized": "Nicht kategorisiert" }, "types": { "unknown": "Unbekannt" } }
    },
    "it": {
        "about_page": { "values": { "title": "I Nostri Valori" } },
        "contact_page": {
            "info": {
                "address": { "title": "La Nostra Sede", "lines": ["51, Boulevard Grande-Duchesse Charlotte", "L-1331 Lussemburgo"] },
                "contact": { "title": "Contatto Diretto", "lines": ["+33 6 46 72 32 86", "contact-inviksa@monsupport-app.com"] }
            }
        },
        "services_page": {
            "hero": { "title": "I NOSTRI SERVIZI BANCARI", "subtitle": "IL VOSTRO PARTNER FINANZIARIO" },
            "features_title": "Caratteristiche principali", "use_cases_title": "Casi d'uso",
            "buttons": { "open_account": "Apri un conto", "simulate": "Simula un credito" }
        },
        "cards": { "physical_order": { "status": { "default_reject_reason": "Documenti d'identità incompleti o non conformi." } } },
        "settings": { "profile": { "not_defined": "Non definito" } },
        "history": { "details": { "uncategorized": "Non categorizzato" }, "types": { "unknown": "Sconosciuto" } }
    },
    "fr": {
        "cards": { "physical_order": { "status": { "default_reject_reason": "Documents d'identité incomplets ou non conformes." } } },
        "settings": { "profile": { "not_defined": "Non défini" } },
        "transfers": { "inputs": { "bic_placeholder": "Code BIC/SWIFT", "email_placeholder": "beneficiaire@email.com", "iban_placeholder": "Numéro IBAN", "name_placeholder": "Nom Complet" } }
    }
}

if __name__ == "__main__":
    locales_dir = "client/public/locales"
    for lang, patch in TRANSLATIONS.items():
        path = os.path.join(locales_dir, lang, "translation.json")
        patch_file(path, patch)
