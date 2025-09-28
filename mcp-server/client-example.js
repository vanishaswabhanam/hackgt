#!/usr/bin/env node

/**
 * Example client demonstrating how to integrate Apollo AI MCP Server
 * with your existing Apollo AI medical platform
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { spawn } from "child_process";

class ApolloMCPClient {
  constructor() {
    this.client = null;
    this.transport = null;
  }

  async connect() {
    // Start the MCP server process
    const serverProcess = spawn("node", ["server.js"], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "inherit"]
    });

    // Create transport and client
    this.transport = new StdioClientTransport({
      reader: serverProcess.stdout,
      writer: serverProcess.stdin
    });

    this.client = new Client(
      {
        name: "apollo-ai-client",
        version: "1.0.0"
      },
      {
        capabilities: {}
      }
    );

    await this.client.connect(this.transport);
    console.log("✓ Connected to Apollo MCP Server");
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
    }
  }

  // Example: Save patient session after medical analysis
  async savePatientSession(patientData, sessionId = null) {
    try {
      const result = await this.client.request(
        {
          method: "tools/call",
          params: {
            name: "save_patient_session",
            arguments: {
              sessionId,
              patientData,
              expirationHours: 24
            }
          }
        }
      );

      const response = JSON.parse(result.content[0].text);
      return response;
    } catch (error) {
      console.error("Failed to save patient session:", error);
      throw error;
    }
  }

  // Example: Retrieve patient session
  async getPatientSession(sessionId) {
    try {
      const result = await this.client.request(
        {
          method: "tools/call",
          params: {
            name: "get_patient_session",
            arguments: { sessionId }
          }
        }
      );

      const response = JSON.parse(result.content[0].text);
      return response;
    } catch (error) {
      console.error("Failed to get patient session:", error);
      throw error;
    }
  }

  // Example: Cache PubMed results
  async cachePubMedResults(queryHash, results) {
    try {
      const result = await this.client.request(
        {
          method: "tools/call",
          params: {
            name: "cache_medical_data",
            arguments: {
              cacheKey: queryHash,
              data: results,
              source: "pubmed",
              ttlMinutes: 120
            }
          }
        }
      );

      const response = JSON.parse(result.content[0].text);
      return response;
    } catch (error) {
      console.error("Failed to cache PubMed results:", error);
      throw error;
    }
  }

  // Example: Get cached PubMed results
  async getCachedPubMedResults(queryHash) {
    try {
      const result = await this.client.request(
        {
          method: "tools/call",
          params: {
            name: "get_cached_data",
            arguments: {
              cacheKey: queryHash,
              source: "pubmed"
            }
          }
        }
      );

      const response = JSON.parse(result.content[0].text);
      return response;
    } catch (error) {
      console.error("Failed to get cached PubMed results:", error);
      return { success: false };
    }
  }

  // Example: List active patient sessions
  async listActiveSessions(limit = 20) {
    try {
      const result = await this.client.request(
        {
          method: "tools/call",
          params: {
            name: "list_active_sessions",
            arguments: { limit }
          }
        }
      );

      const response = JSON.parse(result.content[0].text);
      return response;
    } catch (error) {
      console.error("Failed to list active sessions:", error);
      throw error;
    }
  }
}

// Example usage demonstrating integration with Apollo AI workflow
async function demonstrateApolloIntegration() {
  const mcpClient = new ApolloMCPClient();
  
  try {
    await mcpClient.connect();

    // Simulate Apollo AI medical analysis workflow
    console.log("\n🏥 Apollo AI Medical Analysis Workflow with MCP");
    console.log("=" .repeat(50));

    // 1. Simulate patient data from medical analysis
    const patientData = {
      structuredData: {
        "visit motivation": "Severe headaches and visual disturbances",
        "patient information": {
          "age": "45",
          "sex": "Female"
        },
        "symptoms": [{
          "name of symptom": "Headache",
          "intensity of symptom": "Severe",
          "location": "Frontal lobe"
        }],
        "diagnosis tests": [{
          "test": "MRI Brain",
          "result": "2.5cm mass detected",
          "condition": "Brain tumor"
        }]
      },
      originalText: "Patient presents with severe headaches and visual disturbances. MRI shows 2.5cm mass in left frontal lobe.",
      imageData: {
        "predicted_class": "brain_glioma",
        "confidence": 0.94,
        "filename": "patient_mri_scan.jpg"
      },
      timestamp: new Date().toISOString()
    };

    // 2. Save patient session
    console.log("\n📝 Saving patient session...");
    const saveResult = await mcpClient.savePatientSession(patientData);
    console.log(`✓ Session saved: ${saveResult.sessionId}`);

    // 3. Simulate caching PubMed results
    console.log("\n🔬 Caching PubMed research results...");
    const pubmedResults = {
      articles: [
        {
          pmid: "12345678",
          title: "Glioma Treatment Advances in 2024",
          abstract: "Recent advances in glioma treatment...",
          journal: "Nature Medicine"
        }
      ],
      total: 15,
      query: "brain glioma treatment"
    };
    
    const queryHash = "brain_glioma_treatment_hash123";
    await mcpClient.cachePubMedResults(queryHash, pubmedResults);
    console.log("✓ PubMed results cached");

    // 4. Retrieve cached data (simulating faster subsequent requests)
    console.log("\n⚡ Retrieving cached PubMed data...");
    const cachedData = await mcpClient.getCachedPubMedResults(queryHash);
    if (cachedData.success) {
      console.log(`✓ Cache hit! Retrieved ${cachedData.cacheData.data.articles.length} articles`);
    }

    // 5. Retrieve patient session (simulating multi-device access)
    console.log("\n📱 Retrieving patient session (multi-device access)...");
    const sessionData = await mcpClient.getPatientSession(saveResult.sessionId);
    if (sessionData.success) {
      console.log(`✓ Session retrieved: ${sessionData.sessionData.structuredData["visit motivation"]}`);
    }

    // 6. List active sessions (for monitoring)
    console.log("\n📊 Listing active sessions...");
    const activeSessions = await mcpClient.listActiveSessions(5);
    if (activeSessions.success) {
      console.log(`✓ Found ${activeSessions.sessions.length} active sessions`);
      activeSessions.sessions.forEach(session => {
        console.log(`  - Session ${session.sessionId.substring(0, 8)}... (created: ${session.createdAt})`);
      });
    }

    console.log("\n🎉 Apollo AI MCP Integration Demo Complete!");
    console.log("\nBenefits demonstrated:");
    console.log("• Server-side patient session storage");
    console.log("• Multi-device session access");
    console.log("• Fast medical data caching");
    console.log("• Session monitoring and management");
    console.log("• Automatic Redis fallback to memory store");

  } catch (error) {
    console.error("Demo failed:", error);
  } finally {
    await mcpClient.disconnect();
  }
}

// Integration helpers for existing Apollo AI backend
export class ApolloBackendIntegration {
  constructor() {
    this.mcpClient = new ApolloMCPClient();
  }

  async initialize() {
    await this.mcpClient.connect();
  }

  // Replace localStorage.setItem('lastAnalysis', data) with this
  async saveAnalysisSession(structuredData, originalText, imageData) {
    return await this.mcpClient.savePatientSession({
      structuredData,
      originalText,
      imageData,
      timestamp: new Date().toISOString()
    });
  }

  // Replace localStorage.getItem('lastAnalysis') with this
  async getAnalysisSession(sessionId) {
    const result = await this.mcpClient.getPatientSession(sessionId);
    return result.success ? result.sessionData : null;
  }

  // Cache PubMed API responses
  async cachePubMedResponse(queryHash, results) {
    return await this.mcpClient.cachePubMedResults(queryHash, results);
  }

  // Get cached PubMed responses
  async getCachedPubMedResponse(queryHash) {
    const result = await this.mcpClient.getCachedPubMedResults(queryHash);
    return result.success ? result.cacheData.data : null;
  }
}

// Run the demonstration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  demonstrateApolloIntegration().catch(console.error);
}
