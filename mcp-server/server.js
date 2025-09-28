#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { createClient } from "redis";
import { v4 as uuidv4 } from "uuid";

/**
 * Apollo AI Medical Platform MCP Server
 * 
 * Provides Redis-based session management and medical data caching
 * for the Apollo AI diagnostic and treatment platform.
 * 
 * Tools provided:
 * - save_patient_session: Store patient analysis data with session management
 * - get_patient_session: Retrieve patient session data
 * - delete_patient_session: Remove patient session
 * - cache_medical_data: Cache medical API responses (PubMed, ClinicalTrials)
 * - get_cached_data: Retrieve cached medical data
 * - list_active_sessions: Get all active patient sessions
 */

class ApolloMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: "apollo-mcp-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.redisClient = null;
    this.memoryStore = new Map(); // Fallback storage
    this.useRedis = false;
    
    this.setupToolHandlers();
    this.initializeRedis();
  }

  async initializeRedis() {
    try {
      this.redisClient = createClient({
        socket: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT) || 6379,
        },
        password: process.env.REDIS_PASSWORD || undefined,
      });

      this.redisClient.on('error', (err) => {
        console.error('Redis Client Error - using memory fallback:', err.message);
        this.useRedis = false;
      });

      this.redisClient.on('connect', () => {
        console.log('✓ Apollo MCP Server: Redis connected');
        this.useRedis = true;
      });

      await this.redisClient.connect();
    } catch (error) {
      console.log('Apollo MCP Server: Redis unavailable, using memory store');
      this.useRedis = false;
    }
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "save_patient_session",
          description: "Save patient analysis data with session management for Apollo AI platform",
          inputSchema: {
            type: "object",
            properties: {
              sessionId: {
                type: "string",
                description: "Optional session ID. If not provided, a new one will be generated"
              },
              patientData: {
                type: "object",
                description: "Structured patient data from medical analysis",
                properties: {
                  structuredData: { type: "object" },
                  originalText: { type: "string" },
                  imageData: { type: "object" },
                  timestamp: { type: "string" }
                }
              },
              expirationHours: {
                type: "number",
                description: "Session expiration in hours (default: 24)",
                default: 24
              }
            },
            required: ["patientData"]
          }
        },
        {
          name: "get_patient_session",
          description: "Retrieve patient session data by session ID",
          inputSchema: {
            type: "object",
            properties: {
              sessionId: {
                type: "string",
                description: "Session ID to retrieve"
              }
            },
            required: ["sessionId"]
          }
        },
        {
          name: "delete_patient_session",
          description: "Delete patient session data",
          inputSchema: {
            type: "object",
            properties: {
              sessionId: {
                type: "string",
                description: "Session ID to delete"
              }
            },
            required: ["sessionId"]
          }
        },
        {
          name: "cache_medical_data",
          description: "Cache medical API responses (PubMed, ClinicalTrials, etc.)",
          inputSchema: {
            type: "object",
            properties: {
              cacheKey: {
                type: "string",
                description: "Unique cache key (e.g., query hash)"
              },
              data: {
                type: "object",
                description: "Medical data to cache"
              },
              source: {
                type: "string",
                description: "Data source (pubmed, clinicaltrials, treatment_recommendations)"
              },
              ttlMinutes: {
                type: "number",
                description: "Cache TTL in minutes (default: 60)",
                default: 60
              }
            },
            required: ["cacheKey", "data", "source"]
          }
        },
        {
          name: "get_cached_data",
          description: "Retrieve cached medical data",
          inputSchema: {
            type: "object",
            properties: {
              cacheKey: {
                type: "string",
                description: "Cache key to retrieve"
              },
              source: {
                type: "string",
                description: "Data source filter"
              }
            },
            required: ["cacheKey"]
          }
        },
        {
          name: "list_active_sessions",
          description: "List all active patient sessions",
          inputSchema: {
            type: "object",
            properties: {
              limit: {
                type: "number",
                description: "Maximum number of sessions to return (default: 50)",
                default: 50
              }
            }
          }
        }
      ]
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "save_patient_session":
            return await this.savePatientSession(args);
          case "get_patient_session":
            return await this.getPatientSession(args);
          case "delete_patient_session":
            return await this.deletePatientSession(args);
          case "cache_medical_data":
            return await this.cacheMedicalData(args);
          case "get_cached_data":
            return await this.getCachedData(args);
          case "list_active_sessions":
            return await this.listActiveSessions(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error executing ${name}: ${error.message}`
            }
          ]
        };
      }
    });
  }

  async savePatientSession(args) {
    const { sessionId, patientData, expirationHours = 24 } = args;
    const finalSessionId = sessionId || uuidv4();
    
    const sessionData = {
      sessionId: finalSessionId,
      ...patientData,
      createdAt: new Date().toISOString(),
      lastAccessed: new Date().toISOString(),
      expiresAt: new Date(Date.now() + (expirationHours * 60 * 60 * 1000)).toISOString()
    };

    try {
      if (this.useRedis && this.redisClient) {
        const ttlSeconds = expirationHours * 3600;
        await this.redisClient.setEx(
          `apollo:session:${finalSessionId}`, 
          ttlSeconds, 
          JSON.stringify(sessionData)
        );
      } else {
        this.memoryStore.set(`session:${finalSessionId}`, sessionData);
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              sessionId: finalSessionId,
              message: "Patient session saved successfully",
              expiresAt: sessionData.expiresAt,
              storage: this.useRedis ? "redis" : "memory"
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to save patient session: ${error.message}`);
    }
  }

  async getPatientSession(args) {
    const { sessionId } = args;

    try {
      let sessionData = null;

      if (this.useRedis && this.redisClient) {
        const data = await this.redisClient.get(`apollo:session:${sessionId}`);
        if (data) {
          sessionData = JSON.parse(data);
          // Update last accessed time
          sessionData.lastAccessed = new Date().toISOString();
          await this.redisClient.setEx(
            `apollo:session:${sessionId}`,
            await this.redisClient.ttl(`apollo:session:${sessionId}`),
            JSON.stringify(sessionData)
          );
        }
      } else {
        sessionData = this.memoryStore.get(`session:${sessionId}`);
        if (sessionData) {
          sessionData.lastAccessed = new Date().toISOString();
          this.memoryStore.set(`session:${sessionId}`, sessionData);
        }
      }

      if (!sessionData) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                error: "Session not found or expired"
              }, null, 2)
            }
          ]
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              sessionData,
              storage: this.useRedis ? "redis" : "memory"
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to retrieve patient session: ${error.message}`);
    }
  }

  async deletePatientSession(args) {
    const { sessionId } = args;

    try {
      if (this.useRedis && this.redisClient) {
        await this.redisClient.del(`apollo:session:${sessionId}`);
      } else {
        this.memoryStore.delete(`session:${sessionId}`);
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              message: "Patient session deleted successfully",
              storage: this.useRedis ? "redis" : "memory"
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to delete patient session: ${error.message}`);
    }
  }

  async cacheMedicalData(args) {
    const { cacheKey, data, source, ttlMinutes = 60 } = args;
    
    const cacheData = {
      data,
      source,
      cachedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + (ttlMinutes * 60 * 1000)).toISOString()
    };

    try {
      if (this.useRedis && this.redisClient) {
        const ttlSeconds = ttlMinutes * 60;
        await this.redisClient.setEx(
          `apollo:cache:${source}:${cacheKey}`, 
          ttlSeconds, 
          JSON.stringify(cacheData)
        );
      } else {
        this.memoryStore.set(`cache:${source}:${cacheKey}`, cacheData);
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              message: "Medical data cached successfully",
              cacheKey,
              source,
              expiresAt: cacheData.expiresAt,
              storage: this.useRedis ? "redis" : "memory"
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to cache medical data: ${error.message}`);
    }
  }

  async getCachedData(args) {
    const { cacheKey, source } = args;

    try {
      let cacheData = null;
      const fullKey = source ? `apollo:cache:${source}:${cacheKey}` : `apollo:cache:*:${cacheKey}`;

      if (this.useRedis && this.redisClient) {
        if (source) {
          const data = await this.redisClient.get(`apollo:cache:${source}:${cacheKey}`);
          if (data) cacheData = JSON.parse(data);
        } else {
          // Search across all sources if no source specified
          const keys = await this.redisClient.keys(`apollo:cache:*:${cacheKey}`);
          if (keys.length > 0) {
            const data = await this.redisClient.get(keys[0]);
            if (data) cacheData = JSON.parse(data);
          }
        }
      } else {
        const searchKey = source ? `cache:${source}:${cacheKey}` : null;
        if (searchKey) {
          cacheData = this.memoryStore.get(searchKey);
        } else {
          // Search across all cache entries
          for (const [key, value] of this.memoryStore.entries()) {
            if (key.includes(`cache:`) && key.endsWith(`:${cacheKey}`)) {
              cacheData = value;
              break;
            }
          }
        }
      }

      if (!cacheData) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                error: "Cached data not found or expired"
              }, null, 2)
            }
          ]
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              cacheData,
              storage: this.useRedis ? "redis" : "memory"
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to retrieve cached data: ${error.message}`);
    }
  }

  async listActiveSessions(args) {
    const { limit = 50 } = args;

    try {
      const sessions = [];

      if (this.useRedis && this.redisClient) {
        const keys = await this.redisClient.keys('apollo:session:*');
        const sessionKeys = keys.slice(0, limit);
        
        for (const key of sessionKeys) {
          const data = await this.redisClient.get(key);
          if (data) {
            const sessionData = JSON.parse(data);
            sessions.push({
              sessionId: sessionData.sessionId,
              createdAt: sessionData.createdAt,
              lastAccessed: sessionData.lastAccessed,
              expiresAt: sessionData.expiresAt
            });
          }
        }
      } else {
        let count = 0;
        for (const [key, sessionData] of this.memoryStore.entries()) {
          if (key.startsWith('session:') && count < limit) {
            sessions.push({
              sessionId: sessionData.sessionId,
              createdAt: sessionData.createdAt,
              lastAccessed: sessionData.lastAccessed,
              expiresAt: sessionData.expiresAt
            });
            count++;
          }
        }
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              sessions,
              totalCount: sessions.length,
              storage: this.useRedis ? "redis" : "memory"
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to list active sessions: ${error.message}`);
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Apollo AI MCP Server running on stdio");
  }
}

// Start the server
const server = new ApolloMCPServer();
server.run().catch(console.error);
