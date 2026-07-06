import { Injectable, signal } from '@angular/core';
import { LanguageCode } from '../../../../../libs/shared-types';

/**
 * Core TranslationService managing static i18n UI strings and dynamic Cloud Translation API integration.
 * Languages supported: English ('en'), Hindi ('hi'), Marathi ('mr').
 */
@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  readonly currentLanguage = signal<LanguageCode>('en');

  private readonly dictionaries: Record<LanguageCode, Record<string, string>> = {
    en: {
      'app.title': 'EcoCommune',
      'app.subtitle': 'AI-Powered Smart Community Resource Optimization',
      'nav.logging': 'Resource Logging',
      'nav.insights': 'AI Insights',
      'nav.forecasting': 'Predictive Forecasting',
      'nav.benchmarks': 'Community Benchmarks',
      'nav.assistant': 'AI Assistant',
      'logging.title': 'Household Resource Logging',
      'logging.subtitle': 'Log daily electricity, water, and segregated waste consumption',
      'logging.electricity': 'Electricity (kWh)',
      'logging.water': 'Water (Liters)',
      'logging.waste': 'Waste (kg)',
      'logging.category': 'Waste Category',
      'logging.date': 'Date',
      'logging.submit': 'Record Resource Log',
      'logging.import': 'Import CSV / JSON',
      'insights.title': 'AI-Driven Reduction Recommendations',
      'insights.cached': 'Cached (24-Hour TTL)',
      'forecasting.title': 'BigQuery ML Predictive Forecast',
      'forecasting.anomaly': 'Anomaly Alert Detected',
      'benchmarks.title': 'Neighborhood Community Benchmarks',
      'benchmarks.kanonymity': 'Server-Side k-Anonymity Verified (k >= 5)',
      'assistant.title': 'Grounded AI Assistant (Gemini 1.5)',
      'assistant.placeholder': 'Ask why your electricity bill spiked or how to reduce water waste...',
      'assistant.send': 'Send Query',
    },
    hi: {
      'app.title': 'इकोकम्यून (EcoCommune)',
      'app.subtitle': 'एआई-संचालित स्मार्ट समुदाय संसाधन अनुकूलन',
      'nav.logging': 'संसाधन लॉगिंग',
      'nav.insights': 'एआई अंतर्दृष्टि',
      'nav.forecasting': 'पूर्वानुमान',
      'nav.benchmarks': 'सामुदायिक बेंचमार्क',
      'nav.assistant': 'एआई सहायक',
      'logging.title': 'घरेलू संसाधन लॉगिंग',
      'logging.subtitle': 'दैनिक बिजली, पानी और कचरा खपत दर्ज करें',
      'logging.electricity': 'बिजली (kWh)',
      'logging.water': 'पानी (लीटर)',
      'logging.waste': 'कचरा (किग्रा)',
      'logging.category': 'कचरा श्रेणी',
      'logging.date': 'दिनांक',
      'logging.submit': 'संसाधन लॉग दर्ज करें',
      'logging.import': 'CSV / JSON आयात करें',
      'insights.title': 'एआई-संचालित बचत सिफारिशें',
      'insights.cached': 'कैश्ड (24-घंटे TTL)',
      'forecasting.title': 'बिगक्वेरी एमएल पूर्वानुमान',
      'forecasting.anomaly': 'असामान्यता चेतावनी पाई गई',
      'benchmarks.title': 'पड़ोस सामुदायिक बेंचमार्क',
      'benchmarks.kanonymity': 'सर्वर-साइड k-अनाम सत्यापित (k >= 5)',
      'assistant.title': 'सत्यापित एआई सहायक (Gemini 1.5)',
      'assistant.placeholder': 'पूछें कि आपका बिजली बिल क्यों बढ़ा या पानी की बचत कैसे करें...',
      'assistant.send': 'प्रश्न भेजें',
    },
    mr: {
      'app.title': 'इकोकम्यून (EcoCommune)',
      'app.subtitle': 'एआय-आधारित स्मार्ट समुदाय संसाधन बचत',
      'nav.logging': 'संसाधन नोंदी',
      'nav.insights': 'एआय विश्लेषण',
      'nav.forecasting': 'अंदाज',
      'nav.benchmarks': 'समुदाय बेंचमार्क',
      'nav.assistant': 'एआय सहाय्यक',
      'logging.title': 'घरगुती संसाधन नोंदी',
      'logging.subtitle': 'दैनिक वीज, पाणी आणि कचरा वापर नोंदवा',
      'logging.electricity': 'वीज (kWh)',
      'logging.water': 'पाणी (लिटर)',
      'logging.waste': 'कचरा (किलो)',
      'logging.category': 'कचरा प्रकार',
      'logging.date': 'दिनांक',
      'logging.submit': 'संसाधन नोंद सबमिट करा',
      'logging.import': 'CSV / JSON आयात करा',
      'insights.title': 'एआय-आधारित बचत शिफारसी',
      'insights.cached': 'कॅश केले (24-तास TTL)',
      'forecasting.title': 'बिगक्वेरी एमएल अंदाज',
      'forecasting.anomaly': 'विसंगतता इशारा आढळला',
      'benchmarks.title': 'शेजार समुदाय बेंचमार्क',
      'benchmarks.kanonymity': 'सर्व्हर-साइड k-अनामित सत्यापित (k >= 5)',
      'assistant.title': 'सत्यापित एआय सहाय्यक (Gemini 1.5)',
      'assistant.placeholder': 'विचार करा तुमचे वीज बिल का वाढले किंवा पाणी बचत कशी करावी...',
      'assistant.send': 'प्रश्न पाठवा',
    },
  };

  /**
   * Sets active language code.
   * @param lang LanguageCode ('en' | 'hi' | 'mr')
   */
  setLanguage(lang: LanguageCode): void {
    this.currentLanguage.set(lang);
  }

  /**
   * Translates a static translation key.
   * @param key String dictionary key
   */
  translate(key: string): string {
    const lang = this.currentLanguage();
    return this.dictionaries[lang]?.[key] || this.dictionaries.en[key] || key;
  }
}
