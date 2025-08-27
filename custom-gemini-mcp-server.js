#!/usr/bin/env node

/**
 * Кастомный MCP сервер для работы с Ultimate AI Gemini провайдером
 * 
 * Этот сервер предоставляет MCP-совместимый интерфейс для работы с
 * вашим Gemini провайдером по адресу https://smart.ultimateai.org/v1
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} = require('@modelcontextprotocol/sdk/types.js');

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

class CustomGeminiMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'gpt5-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Настройки для вашего провайдера
    this.apiBaseUrl = process.env.API_BASE_URL || 'https://smart.ultimateai.org/v1';
    this.apiKey = process.env.ULTIMATE_AI_API_KEY || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
    this.defaultModel = process.env.DEFAULT_MODEL || 'Gemini 2.0 Flash';
    this.debug = process.env.DEBUG_MCP === 'true';
    
    // Отладочная информация только при включенном DEBUG_MCP
    if (this.debug) {
      this.log(`🔧 Конфигурация:`);
      this.log(`📍 API Base URL: ${this.apiBaseUrl}`);
      this.log(`🤖 Модель по умолчанию: ${this.defaultModel}`);
      this.log(`🔑 API ключ: ${this.apiKey ? '✅ Настроен' : '❌ НЕ найден'}`);
    }
    
    if (!this.apiKey) {
      this.log('❌ API ключ не найден! Установите ULTIMATE_AI_API_KEY или GEMINI_API_KEY');
      process.exit(1);
    }

    this.setupHandlers();
  }

  // Метод для безопасного логирования
  log(message) {
    if (this.debug || process.env.NODE_ENV === 'development') {
      console.error(message);
    }
  }

  setupHandlers() {
    // Список доступных инструментов
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'gpt5',
            description: 'Отправляет сообщение в модель GPT-5 через ваш провайдер Ultimate AI',
            inputSchema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  description: 'Сообщение для отправки в GPT-5',
                },
                temperature: {
                  type: 'number',
                  description: 'Температура для генерации (0.0-1.0)',
                  default: 0.7,
                },
              },
              required: ['message'],
            },
          },
          {
            name: 'gpt41',
            description: 'Отправляет сообщение в модель GPT-4.1 через ваш провайдер Ultimate AI',
            inputSchema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  description: 'Сообщение для отправки в GPT-4.1',
                },
                temperature: {
                  type: 'number',
                  description: 'Температура для генерации (0.0-1.0)',
                  default: 0.7,
                },
              },
              required: ['message'],
            },
          },
          {
            name: 'kimi',
            description: 'Отправляет сообщение в модель Kimi-K2 через ваш провайдер Ultimate AI',
            inputSchema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  description: 'Сообщение для отправки в Kimi-K2',
                },
                temperature: {
                  type: 'number',
                  description: 'Температура для генерации (0.0-1.0)',
                  default: 0.7,
                },
              },
              required: ['message'],
            },
          },
          {
            name: 'claude',
            description: 'Отправляет сообщение в модель Claude Opus через ваш провайдер Ultimate AI',
            inputSchema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  description: 'Сообщение для отправки в Claude Opus',
                },
                temperature: {
                  type: 'number',
                  description: 'Температура для генерации (0.0-1.0)',
                  default: 0.7,
                },
              },
              required: ['message'],
            },
          },
          {
            name: 'glm',
            description: 'Отправляет сообщение в модель GLM-4.5 через ваш провайдер Ultimate AI',
            inputSchema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  description: 'Сообщение для отправки в GLM-4.5',
                },
                temperature: {
                  type: 'number',
                  description: 'Температура для генерации (0.0-1.0)',
                  default: 0.7,
                },
              },
              required: ['message'],
            },
          },
          {
            name: 'read_local_file',
            description: 'Читает содержимое локального файла',
            inputSchema: {
              type: 'object',
              properties: {
                filepath: {
                  type: 'string',
                  description: 'Путь к файлу для чтения',
                },
              },
              required: ['filepath'],
            },
          },
          {
            name: 'list_directory',
            description: 'Показывает содержимое директории',
            inputSchema: {
              type: 'object',
              properties: {
                dirpath: {
                  type: 'string',
                  description: 'Путь к директории',
                  default: '.',
                },
              },
            },
          },
        ],
      };
    });

    // Обработка вызовов инструментов
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        switch (request.params.name) {
          case 'gpt5':
            return await this.handleAIModel(request.params.arguments, 'gpt-5-chat');
          case 'gpt41':
            return await this.handleAIModel(request.params.arguments, 'gpt-4.1');
          case 'kimi':
            return await this.handleAIModel(request.params.arguments, 'kimi-k2');
          case 'claude':
            return await this.handleAIModel(request.params.arguments, 'claudeopus');
          case 'glm':
            return await this.handleAIModel(request.params.arguments, 'glm-4.5');
          case 'read_local_file':
            return await this.handleReadFile(request.params.arguments);
          case 'list_directory':
            return await this.handleListDirectory(request.params.arguments);
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Неизвестный инструмент: ${request.params.name}`
            );
        }
      } catch (error) {
        this.log('Ошибка при выполнении инструмента: ' + error.message);
        throw new McpError(
          ErrorCode.InternalError,
          `Ошибка выполнения: ${error.message}`
        );
      }
    });
  }

  async handleAIModel(args, modelName) {
    const { message, temperature = 0.7 } = args;
    
    // Маппинг имен моделей для красивого отображения
    const modelDisplayNames = {
      'gpt-5-chat': 'GPT-5',
      'gpt-4.1': 'GPT-4.1',
      'kimi-k2': 'Kimi-K2',
      'claudeopus': 'Claude Opus',
      'glm-4.5': 'GLM-4.5'
    };
    
    const displayName = modelDisplayNames[modelName] || modelName;

    try {
      if (this.debug) {
        this.log(`🚀 Отправляем запрос в ${displayName} (${modelName})`);
      }
      
      const response = await axios.post(
        `${this.apiBaseUrl}/chat/completions`,
        {
          model: modelName,
          messages: [
            {
              role: 'user',
              content: message,
            },
          ],
          temperature: temperature,
          max_tokens: 4096,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );

      let content = response.data?.choices?.[0]?.message?.content || 'Нет ответа от модели';
      
      // Очищаем контент от лишних символов в начале и конце
      content = content.trim();
      
      // Отладка: проверяем, что именно приходит от API
      if (this.debug) {
        this.log(`📥 Полный ответ от ${displayName}:`);
        this.log(JSON.stringify(response.data, null, 2));
        this.log(`📄 Контент ответа от ${displayName}:`);
        this.log(content);
      }
      
      return {
        content: [
          {
            type: 'text',
            text: content,
          },
        ],
      };
    } catch (error) {
      this.log(`Ошибка API для ${displayName}: ` + (error.response?.data || error.message));
      return {
        content: [
          {
            type: 'text',
            text: `❌ Ошибка при обращении к ${displayName}: ${error.response?.data?.error?.message || error.message}`,
          },
        ],
      };
    }
  }

  async handleReadFile(args) {
    const { filepath } = args;

    try {
      const absolutePath = path.resolve(filepath);
      const content = await fs.readFile(absolutePath, 'utf-8');
      
      return {
        content: [
          {
            type: 'text',
            text: `📄 **Файл: ${filepath}**\n\`\`\`\n${content}\n\`\`\``,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ Ошибка чтения файла: ${error.message}`,
          },
        ],
      };
    }
  }

  async handleListDirectory(args) {
    const { dirpath = '.' } = args;

    try {
      const absolutePath = path.resolve(dirpath);
      const items = await fs.readdir(absolutePath, { withFileTypes: true });
      
      const filesList = items
        .map(item => `${item.isDirectory() ? '📁' : '📄'} ${item.name}`)
        .join('\n');

      return {
        content: [
          {
            type: 'text',
            text: `📂 **Содержимое: ${dirpath}**\n\n${filesList}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ Ошибка чтения директории: ${error.message}`,
          },
        ],
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    // Молчаливый запуск - отладочная информация отключена
  }
}

// Обработка сигналов завершения для корректного автозапуска/завершения
process.on('SIGTERM', () => {
  console.error('📴 MCP сервер получил SIGTERM, завершаем работу...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.error('📴 MCP сервер получил SIGINT, завершаем работу...');
  process.exit(0);
});

// Обработка неперехваченных ошибок
process.on('uncaughtException', (error) => {
  console.error('❌ Неперехваченная ошибка:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Неперехваченное отклонение промиса:', reason);
  process.exit(1);
});

// Запуск сервера
if (require.main === module) {
  const server = new CustomGeminiMCPServer();
  server.run().catch((error) => {
    console.error('❌ Критическая ошибка запуска сервера:', error);
    process.exit(1);
  });
}
