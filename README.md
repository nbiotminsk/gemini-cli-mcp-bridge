# 🚀 Multi-AI MCP Server

Мощный MCP сервер для работы с множественными AI моделями через Ultimate AI провайдер и протокол Model Context Protocol.

## 🔧 Возможности

- **MCP Protocol**: Полная совместимость с MCP для интеграции с Gemini CLI, Claude Desktop и другими клиентами
- **5 AI Моделей**: Поддержка GPT-5, GPT-4.1, Kimi-K2, Claude Opus и GLM-4.5
- **Локальные файловые операции**: Чтение файлов и просмотр директорий
- **Автозапуск**: Сервер автоматически запускается при обращении от Gemini CLI
- **Гибкие настройки**: Настройка через переменные окружения

## 🛠️ Доступные инструменты

### AI Модели:
1. **`gpt5`** - Отправка сообщений в модель GPT-5 🔥
2. **`gpt41`** - Отправка сообщений в модель GPT-4.1 ⚡
3. **`kimi`** - Отправка сообщений в модель Kimi-K2 🚀
4. **`claude`** - Отправка сообщений в модель Claude Opus 🎭
5. **`glm`** - Отправка сообщений в модель GLM-4.5 🤖

### Файловые операции:
6. **`read_local_file`** - Чтение содержимого локальных файлов  
7. **`list_directory`** - Просмотр содержимого директорий

## ⚙️ Конфигурация через переменные окружения

```bash
# API настройки
ULTIMATE_AI_API_KEY=sk-ваш-ключ-здесь          # Ваш API ключ
API_BASE_URL=https://smart.ultimateai.org/v1   # Базовый URL API
DEFAULT_MODEL="Gemini 2.0 Flash"               # Модель по умолчанию

# Альтернативные ключи (в порядке приоритета)
GEMINI_API_KEY=ваш-ключ
OPENAI_API_KEY=ваш-ключ
```

## 🤖 Доступные модели

Ваш провайдер Ultimate AI поддерживает следующие модели:
- **Gemini 2.0 Flash** - Новейшая модель Gemini (по умолчанию)
- **GPT-4o** - OpenAI GPT-4o
- **GPT-4o mini** - Облегченная версия GPT-4o
- **GPT-4o mini (On-Line)** - GPT-4o mini с онлайн доступом
- **Deepseek-Chat** - Модель Deepseek
- **gpt-5-chat** - 🔥 **НОВАЯ МОДЕЛЬ GPT-5** от OpenAI!

## 🏃‍♂️ Запуск

### Прямой запуск
```bash
node custom-gemini-mcp-server.js
```

### С переменными окружения
```bash
# Windows PowerShell
$env:ULTIMATE_AI_API_KEY="sk-ваш-ключ"; node custom-gemini-mcp-server.js

# Windows CMD  
set ULTIMATE_AI_API_KEY=sk-ваш-ключ && node custom-gemini-mcp-server.js

# Unix/Linux/macOS
ULTIMATE_AI_API_KEY="sk-ваш-ключ" node custom-gemini-mcp-server.js
```

### С кастомными настройками
```bash
# Изменение провайдера и модели
$env:API_BASE_URL="https://другой-провайдер.com/v1"
$env:DEFAULT_MODEL="gemini-pro"
$env:ULTIMATE_AI_API_KEY="ваш-ключ"
node custom-gemini-mcp-server.js
```

## 📡 Подключение к Gemini CLI (Рекомендуемое)

MCP сервер автоматически настроен для Gemini CLI!

### Быстрый старт:
```powershell
# Проверьте, что сервер виден
gemini mcp list

# Обратитесь к GPT-5
gemini --prompt "Используй gpt5 для отправки сообщения 'Привет, GPT-5!'"
```

### Примеры запросов:
```powershell
# Обращение к разным моделям:
gemini --prompt "Используй gpt5: 'Объясни квантовую физику'"
gemini --prompt "Используй claude: 'Проанализируй этот код'"
gemini --prompt "Используй kimi: 'Переведи на английский: Привет, мир!'"
gemini --prompt "Используй glm: '你好！请用中文回复'"
gemini --prompt "Используй gpt41: 'Реши уравнение: 2x + 5 = 15'"

# Интерактивный чат с разными моделями:
gemini
# В чате:
# "Используй gpt5: 'Напиши стих'"
# "Используй claude: 'Проанализируй код'"
# "Используй glm: '翻译成中文'"
```

## 🔗 Подключение к Claude Desktop

1. Найдите конфигурационный файл Claude Desktop:
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`

2. Добавьте конфигурацию MCP сервера:
```json
{
  "mcpServers": {
    "gpt5-mcp": {
      "command": "node",
      "args": ["C:\\\путь\\\к\\\вашему\\\custom-gemini-mcp-server.js"],
      "env": {
        "ULTIMATE_AI_API_KEY": "ваш-api-ключ-здесь",
        "DEFAULT_MODEL": "gpt-5-chat"
      }
    }
  }
}
```

3. Перезапустите Claude Desktop

## 🧪 Тестирование

Используйте тестовый скрипт для проверки работоспособности:
```bash
node test-mcp.js
```

## 📝 Примеры использования

### В Claude Desktop
После подключения MCP сервера, вы сможете использовать инструменты:

- "Пожалуйста, отправь сообщение 'Привет!' в Gemini"
- "Прочитай файл package.json" 
- "Покажи содержимое текущей директории"

### Через MCP клиенты
Вы можете подключить сервер к любому MCP-совместимому клиенту, используя stdio транспорт.

## 🐛 Troubleshooting

### Ошибка "API ключ не найден"
- Убедитесь, что установили переменную `ULTIMATE_AI_API_KEY`
- Проверьте правильность написания ключа

### Ошибка "Model not found"
- Попробуйте другие названия моделей: `gemini-pro`, `gemini-1.5-pro`, `gemini-1.0-pro`
- Проверьте, что ваш провайдер поддерживает указанную модель

### Ошибка подключения к API
- Убедитесь, что `API_BASE_URL` указан правильно
- Проверьте доступность провайдера
- Попробуйте изменить эндпоинт в коде (например, `/completions` вместо `/chat/completions`)

### Claude Desktop не видит сервер
- Проверьте правильность пути к серверу в конфигурации
- Убедитесь, что используется абсолютный путь к файлу
- Перезапустите Claude Desktop после изменения конфигурации

## 🔒 Безопасность

- Никогда не коммитьте API ключи в код
- Используйте переменные окружения для чувствительных данных
- Ограничивайте доступ к файловым операциям при необходимости

## 📧 Поддержка

Если возникли проблемы:
1. Проверьте логи сервера (выводятся в stderr)
2. Убедитесь, что все зависимости установлены (`npm install`)
3. Проверьте совместимость вашего провайдера с OpenAI API форматом
