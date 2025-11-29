
import { Language } from '../types';

export const translations = {
  he: {
    appTitle: "סנטימנט מהיר",
    appDesc: "גלה מה העולם מדבר על כל נושא, מילה או תמונה בזמן אמת.",
    footer: "מופעל על ידי Gemini API",
    login: "התחבר",
    logout: "התנתק",
    settings: "הגדרות",
    loginPrompt: {
      title: "רוצה לשמור את ההיסטוריה שלך?",
      desc: "התחבר עכשיו כדי לשמור את החיפושים והמועדפים שלך בכל המכשירים.",
      cta: "התחבר / הירשם"
    },
    features: {
      items: [
        { title: "ניתוח טרנדים", desc: "סריקה בזמן אמת של הרשת לזיהוי הנושאים המדוברים ביותר." },
        { title: "ניתוח סנטימנט", desc: "הבנה עמוקה של רגשות הציבור: חיובי, שלילי או ניטרלי." },
        { title: "תובנות AI", desc: "סיכום חכם ומהיר של כמויות מידע גדולות לכדי מסקנות ברורות." }
      ]
    },
    input: {
      placeholder: "הזן מילה, ביטוי או נושא לבדיקה, או העלה תמונה...",
      analyzeBtn: "מצא מידע עדכני",
      processing: "מעבד...",
      listening: "מקשיב...",
      errorEmpty: "אנא ספק טקסט או תמונה לניתוח.",
      errorGeneric: "אירעה שגיאה בעיבוד הבקשה. אנא נסה שוב."
    },
    sidebar: {
      history: "היסטוריה",
      favorites: "מועדפים",
      clearAll: "נקה הכל",
      emptyHistory: "היסטוריית החיפושים שלך ריקה.",
      emptyFavorites: "אין לך חיפושים מועדפים."
    },
    result: {
      summary: "תקציר",
      sentimentTitle: "סנטימנט כללי",
      relatedTopics: "נושאים קשורים",
      sources: "מקורות מידע",
      shareSuccess: "התוצאות הועתקו ללוח!",
      shareFail: "השיתוף נכשל.",
      waiting: "התוצאות יופיעו כאן לאחר שתבצע חיפוש.",
      sentiments: {
        POSITIVE: "חיובי",
        NEGATIVE: "שלילי",
        NEUTRAL: "ניטרלי",
        unknown: "לא ידוע"
      },
      chat: {
        title: "שאל שאלת המשך",
        placeholder: "שאל על הסיכום, הסנטימנט ועוד...",
        error: "שגיאה בתקשורת עם המודל."
      }
    },
    auth: {
      loginTitle: "התחברות לחשבון",
      registerTitle: "יצירת חשבון חדש",
      loginDesc: "התחבר כדי לגשת להיסטוריה והמועדפים שלך",
      registerDesc: "הירשם ושמור את המידע שלך בענן",
      google: "עם Google",
      facebook: "עם Facebook",
      or: "או",
      name: "שם מלא",
      email: "כתובת אימייל",
      password: "סיסמה",
      submitLogin: "התחבר",
      submitRegister: "הירשם",
      noAccount: "אין לך חשבון עדיין? ",
      hasAccount: "כבר יש לך חשבון? ",
      linkRegister: "הירשם עכשיו",
      linkLogin: "התחבר",
      processing: "מעבד..."
    },
    settingsModal: {
      title: "הגדרות",
      language: "שפה",
      readingSpeed: "מהירות הקראה",
      speedSlow: "איטי",
      speedNormal: "רגיל",
      speedFast: "מהיר",
      fontSize: "גודל טקסט",
      dataManagement: "ניהול נתונים",
      exportData: "גיבוי נתונים לקובץ",
      importData: "שחזור מגיבוי",
      exportSuccess: "הנתונים יוצאו בהצלחה!",
      importSuccess: "הנתונים שוחזרו בהצלחה!",
      importError: "שגיאה בטעינת הקובץ."
    },
    loading: {
      title: "מאחזר ומנתח מידע מהרשת...",
      subtitle: "זה עשוי לקחת מספר שניות."
    }
  },
  en: {
    appTitle: "Quick Sentiment",
    appDesc: "Discover what the world is saying about any topic, word, or image in real-time.",
    footer: "Powered by Gemini API",
    login: "Login",
    logout: "Logout",
    settings: "Settings",
    loginPrompt: {
      title: "Want to save your history?",
      desc: "Login now to save your searches and favorites across all devices.",
      cta: "Login / Register"
    },
    features: {
      items: [
        { title: "Trend Analysis", desc: "Real-time web scanning to identify the most talked-about topics." },
        { title: "Sentiment Analysis", desc: "Deep understanding of public opinion: Positive, Negative, or Neutral." },
        { title: "AI Insights", desc: "Smart summarization of large amounts of data into clear conclusions." }
      ]
    },
    input: {
      placeholder: "Enter a word, phrase, or topic, or upload an image...",
      analyzeBtn: "Find Latest Info",
      processing: "Processing...",
      listening: "Listening...",
      errorEmpty: "Please provide text or an image for analysis.",
      errorGeneric: "An error occurred while processing. Please try again."
    },
    sidebar: {
      history: "History",
      favorites: "Favorites",
      clearAll: "Clear All",
      emptyHistory: "Your search history is empty.",
      emptyFavorites: "You have no favorites yet."
    },
    result: {
      summary: "Summary",
      sentimentTitle: "General Sentiment",
      relatedTopics: "Related Topics",
      sources: "Sources",
      shareSuccess: "Results copied to clipboard!",
      shareFail: "Share failed.",
      waiting: "Results will appear here after you search.",
      sentiments: {
        POSITIVE: "Positive",
        NEGATIVE: "Negative",
        NEUTRAL: "Neutral",
        unknown: "Unknown"
      },
      chat: {
        title: "Ask a Follow-up",
        placeholder: "Ask about the summary, sentiment, etc...",
        error: "Error communicating with the model."
      }
    },
    auth: {
      loginTitle: "Login",
      registerTitle: "Create New Account",
      loginDesc: "Login to access your history and favorites",
      registerDesc: "Register to save your data in the cloud",
      google: "Continue with Google",
      facebook: "Continue with Facebook",
      or: "OR",
      name: "Full Name",
      email: "Email Address",
      password: "Password",
      submitLogin: "Login",
      submitRegister: "Register",
      noAccount: "Don't have an account? ",
      hasAccount: "Already have an account? ",
      linkRegister: "Register Now",
      linkLogin: "Login",
      processing: "Processing..."
    },
    settingsModal: {
      title: "Preferences",
      language: "Language",
      readingSpeed: "Reading Speed",
      speedSlow: "Slow",
      speedNormal: "Normal",
      speedFast: "Fast",
      fontSize: "Text Size",
      dataManagement: "Data Management",
      exportData: "Backup Data to File",
      importData: "Restore from Backup",
      exportSuccess: "Data exported successfully!",
      importSuccess: "Data restored successfully!",
      importError: "Error loading file."
    },
    loading: {
      title: "Retrieving and analyzing web data...",
      subtitle: "This may take a few seconds."
    }
  },
  ru: {
    appTitle: "Быстрый Анализ",
    appDesc: "Узнайте, что мир говорит о любой теме, слове или изображении в реальном времени.",
    footer: "Работает на Gemini API",
    login: "Войти",
    logout: "Выйти",
    settings: "Настройки",
    loginPrompt: {
      title: "Хотите сохранить историю?",
      desc: "Войдите, чтобы сохранить поисковые запросы и избранное на всех устройствах.",
      cta: "Войти / Регистрация"
    },
    features: {
      items: [
        { title: "Анализ трендов", desc: "Сканирование сети в реальном времени для выявления популярных тем." },
        { title: "Анализ настроений", desc: "Глубокое понимание общественного мнения: позитивное, негативное или нейтральное." },
        { title: "Инсайты ИИ", desc: "Умное обобщение больших объемов данных в четкие выводы." }
      ]
    },
    input: {
      placeholder: "Введите слово, фразу или тему, или загрузите изображение...",
      analyzeBtn: "Найти информацию",
      processing: "Обработка...",
      listening: "Слушаю...",
      errorEmpty: "Пожалуйста, предоставьте текст или изображение.",
      errorGeneric: "Произошла ошибка при обработке. Попробуйте снова."
    },
    sidebar: {
      history: "История",
      favorites: "Избранное",
      clearAll: "Очистить",
      emptyHistory: "История поиска пуста.",
      emptyFavorites: "В избранном пока пусто."
    },
    result: {
      summary: "Краткое содержание",
      sentimentTitle: "Общее настроение",
      relatedTopics: "Связанные темы",
      sources: "Источники",
      shareSuccess: "Результаты скопированы в буфер обмена!",
      shareFail: "Не удалось поделиться.",
      waiting: "Результаты появятся здесь после поиска.",
      sentiments: {
        POSITIVE: "Позитивное",
        NEGATIVE: "Негативное",
        NEUTRAL: "Нейтральное",
        unknown: "Неизвестно"
      },
      chat: {
        title: "Задать вопрос",
        placeholder: "Спросите о выводах, настроении и т.д...",
        error: "Ошибка связи с моделью."
      }
    },
    auth: {
      loginTitle: "Вход в аккаунт",
      registerTitle: "Создать новый аккаунт",
      loginDesc: "Войдите для доступа к истории и избранному",
      registerDesc: "Зарегистрируйтесь для сохранения данных",
      google: "Войти через Google",
      facebook: "Войти через Facebook",
      or: "ИЛИ",
      name: "Полное имя",
      email: "Электронная почта",
      password: "Пароль",
      submitLogin: "Войти",
      submitRegister: "Регистрация",
      noAccount: "Нет аккаунта? ",
      hasAccount: "Уже есть аккаунт? ",
      linkRegister: "Зарегистрироваться",
      linkLogin: "Войти",
      processing: "Обработка..."
    },
    settingsModal: {
      title: "Настройки",
      language: "Язык",
      readingSpeed: "Скорость чтения",
      speedSlow: "Медленная",
      speedNormal: "Нормальная",
      speedFast: "Быстрая",
      fontSize: "Размер текста",
      dataManagement: "Управление данными",
      exportData: "Экспорт данных",
      importData: "Импорт данных",
      exportSuccess: "Данные успешно экспортированы!",
      importSuccess: "Данные успешно импортированы!",
      importError: "Ошибка при импорте."
    },
    loading: {
      title: "Получение и анализ данных из сети...",
      subtitle: "Это может занять несколько секунд."
    }
  }
};

export type Translation = typeof translations.he;
