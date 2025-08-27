# 🌉 Gemini CLI MCP Bridge

**Полная копия проекта GPT-5 MCP Server для Gemini CLI**

## 📋 Описание проекта

Эта папка содержит полную копию проекта, включающего:
- **GPT-5 MCP Server** - мост между Gemini CLI и моделью GPT-5
- **Настройки Gemini CLI** - файл конфигурации для интеграции
- **Все зависимости** - Node.js модули и библиотеки

## 📁 Структура проекта

### Основные файлы:
- `custom-gemini-mcp-server.js` - Главный MCP сервер для GPT-5
- `gemini-settings.json` - Настройки Gemini CLI (копия из ~/.gemini/settings.json)
- `package.json` - Конфигурация Node.js проекта
- `test-mcp.js` - Тестовый скрипт для проверки работы
- `README.md` - Полная документация проекта

### Конфигурационные файлы:
- `claude_desktop_config.json` - Настройки для Claude Desktop
- `node_modules/` - Зависимости Node.js

## 🚀 Быстрый старт

### 1. Убедитесь, что Node.js установлен
```powershell
node --version
npm --version
```

### 2. Установите зависимости (если нужно)
```powershell
cd "C:\Users\Admin\Desktop\gemini-cli-mcp-bridge"
npm install
```

### 3. Проверьте работу MCP сервера
```powershell
node test-mcp.js
```

### 4. Используйте через Gemini CLI
```powershell
# Проверьте что сервер видим
gemini mcp list

# Отправьте сообщение в GPT-5
gemini --prompt "Используй gpt5: 'Привет!'"
```

## ⚙️ Настройки

### MCP Сервер: `gpt5-mcp`
- **Инструмент**: `gpt5` - для обращения к GPT-5
- **Модель по умолчанию**: `gpt-5-chat`
- **API провайдер**: Ultimate AI (smart.ultimateai.org)

### Переменные окружения:
- `ULTIMATE_AI_API_KEY` - Ваш API ключ
- `DEFAULT_MODEL` - Модель по умолчанию 
- `API_BASE_URL` - URL API провайдера

## 🔧 Техническая информация

### Возможности:
- ✅ **Автозапуск** - сервер запускается автоматически при обращении
- ✅ **GPT-5 интеграция** - прямой доступ к новейшей модели OpenAI
- ✅ **MCP протокол** - совместимость со всеми MCP клиентами
- ✅ **Файловые операции** - чтение файлов и просмотр директорий
- ✅ **Надежность** - обработка ошибок и graceful shutdown

### Инструменты MCP:
1. `gpt5` - Отправка сообщений в GPT-5
2. `read_local_file` - Чтение локальных файлов
3. `list_directory` - Просмотр содержимого директорий

## 📝 Использование

### Примеры команд:
```powershell
# Простой запрос к GPT-5
gemini --prompt "Используй gpt5: 'Как дела?'"

# Отправка в конкретную модель
gemini --prompt "Вызови gpt5 с моделью gpt-5-chat: 'Тест!'"

# Интерактивный режим
gemini
# В чате: "Используй gpt5 для отправки сообщения"

# Чтение файла через MCP
gemini --prompt "Используй read_local_file для чтения файла package.json"
```

## 🛠️ Разработка

### Запуск в режиме разработки:
```powershell
# Прямой запуск сервера
node custom-gemini-mcp-server.js

# Запуск тестов
node test-mcp.js
```

### Настройка API ключа:
```powershell
$env:ULTIMATE_AI_API_KEY="your-api-key-here"
```

## 📧 Поддержка

Если возникли проблемы:
1. Проверьте настройки в `gemini-settings.json`
2. Убедитесь, что API ключ установлен
3. Запустите тест: `node test-mcp.js`
4. Проверьте логи сервера в stderr

## 🏗️ История создания

Этот проект создан как мост между:
- **Gemini CLI** - инструмент для работы с AI
- **GPT-5** - новейшая модель от OpenAI
- **Ultimate AI** - провайдер API

**Дата создания копии**: 27 августа 2025
**Исходная папка**: `C:\Users\Admin\Desktop\Goose-win32-x64\dist-windows`

---

**🎉 Проект готов к использованию!** Запустите `gemini --prompt "Используй gpt5: 'Привет!'"` для быстрого теста.
