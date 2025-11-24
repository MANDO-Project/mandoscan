/**
 * API Key Management Utility for Production
 * 
 * This utility provides functions for managing API keys with DynamoDB.
 * For production use, install: npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
 * 
 * Environment Variables Required:
 * - AWS_REGION: Your AWS region
 * - AWS_ACCESS_KEY_ID: AWS access key
 * - AWS_SECRET_ACCESS_KEY: AWS secret key
 * - DYNAMODB_TABLE_NAME: Name of your DynamoDB table for API keys
 */

import crypto from "crypto";

// Uncomment when using DynamoDB in production:
// import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, DeleteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

// const client = new DynamoDBClient({ region: process.env.AWS_REGION });
// const docClient = DynamoDBDocumentClient.from(client);

interface ApiKey {
  id: string;
  userId: string;
  name: string;
  key: string;
  prefix: string;
  scopes: string[];
  createdAt: string;
  lastUsed: string | null;
  isRevoked: boolean;
}

/**
 * Generate a secure API key with prefix
 */
export function generateApiKey(): string {
  const prefix = "mds"; // Mandoscan prefix
  const random = crypto.randomBytes(32).toString("base64url");
  return `${prefix}_${random}`;
}

/**
 * Hash an API key for secure storage
 */
export function hashApiKey(apiKey: string): string {
  return crypto.createHash("sha256").update(apiKey).digest("hex");
}

/**
 * Create a new API key for a user
 */
export async function createApiKey(
  userId: string,
  name: string,
  scopes: string[]
): Promise<ApiKey> {
  const apiKey = generateApiKey();
  const keyId = crypto.randomBytes(16).toString("hex");
  const hashedKey = hashApiKey(apiKey);

  const apiKeyData: ApiKey = {
    id: keyId,
    userId,
    name,
    key: apiKey, // Return plain key only once
    prefix: apiKey.split("_")[0] + "_" + apiKey.substring(4, 16),
    scopes,
    createdAt: new Date().toISOString(),
    lastUsed: null,
    isRevoked: false,
  };

  // In production, save to DynamoDB:
  /*
  await docClient.send(
    new PutCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: {
        ...apiKeyData,
        key: hashedKey, // Store hashed key
        keyHash: hashedKey,
      },
    })
  );
  */

  return apiKeyData;
}

/**
 * Get all API keys for a user
 */
export async function getUserApiKeys(userId: string): Promise<ApiKey[]> {
  // In production, query DynamoDB:
  /*
  const result = await docClient.send(
    new QueryCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      IndexName: "UserIdIndex",
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    })
  );

  return (result.Items || []) as ApiKey[];
  */

  return [];
}

/**
 * Verify an API key and return associated data
 */
export async function verifyApiKey(apiKey: string): Promise<ApiKey | null> {
  const hashedKey = hashApiKey(apiKey);

  // In production, query DynamoDB by hash:
  /*
  const result = await docClient.send(
    new QueryCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      IndexName: "KeyHashIndex",
      KeyConditionExpression: "keyHash = :keyHash",
      ExpressionAttributeValues: {
        ":keyHash": hashedKey,
      },
    })
  );

  if (!result.Items || result.Items.length === 0) {
    return null;
  }

  const keyData = result.Items[0] as ApiKey;

  if (keyData.isRevoked) {
    return null;
  }

  // Update last used timestamp
  await docClient.send(
    new UpdateCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: { id: keyData.id },
      UpdateExpression: "SET lastUsed = :now",
      ExpressionAttributeValues: {
        ":now": new Date().toISOString(),
      },
    })
  );

  return keyData;
  */

  return null;
}

/**
 * Revoke an API key
 */
export async function revokeApiKey(keyId: string, userId: string): Promise<boolean> {
  // In production, update DynamoDB:
  /*
  await docClient.send(
    new UpdateCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: { id: keyId },
      UpdateExpression: "SET isRevoked = :true",
      ConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":true": true,
        ":userId": userId,
      },
    })
  );

  return true;
  */

  return false;
}

/**
 * Delete an API key
 */
export async function deleteApiKey(keyId: string, userId: string): Promise<boolean> {
  // In production, delete from DynamoDB:
  /*
  await docClient.send(
    new DeleteCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: { id: keyId },
      ConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    })
  );

  return true;
  */

  return false;
}

/**
 * Check if an API key has required scopes
 */
export function hasRequiredScopes(apiKey: ApiKey, requiredScopes: string[]): boolean {
  return requiredScopes.every((scope) => apiKey.scopes.includes(scope));
}

// DynamoDB Table Schema for production:
/*
{
  "TableName": "mandoscan-api-keys",
  "KeySchema": [
    {
      "AttributeName": "id",
      "KeyType": "HASH"
    }
  ],
  "AttributeDefinitions": [
    {
      "AttributeName": "id",
      "AttributeType": "S"
    },
    {
      "AttributeName": "userId",
      "AttributeType": "S"
    },
    {
      "AttributeName": "keyHash",
      "AttributeType": "S"
    }
  ],
  "GlobalSecondaryIndexes": [
    {
      "IndexName": "UserIdIndex",
      "KeySchema": [
        {
          "AttributeName": "userId",
          "KeyType": "HASH"
        }
      ],
      "Projection": {
        "ProjectionType": "ALL"
      }
    },
    {
      "IndexName": "KeyHashIndex",
      "KeySchema": [
        {
          "AttributeName": "keyHash",
          "KeyType": "HASH"
        }
      ],
      "Projection": {
        "ProjectionType": "ALL"
      }
    }
  ]
}
*/
