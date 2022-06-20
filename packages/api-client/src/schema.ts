export const schema = {
  "openapi": "3.0.0",
  "paths": {
    "/users": {
      "get": {
        "operationId": "listUsers",
        "parameters": [],
        "responses": { "200": { "description": "" } }
      }
    },
    "/auth/signup": {
      "post": {
        "operationId": "signup",
        "parameters": [],
        "responses": { "201": { "description": "" } }
      }
    },
    "/auth/signin": {
      "post": {
        "operationId": "signin",
        "parameters": [],
        "responses": { "201": { "description": "" } }
      }
    }
  },
  "info": {
    "title": "Moment API",
    "description": "",
    "version": "1.0.0",
    "contact": {}
  },
  "tags": [],
  "servers": [],
  "components": { "schemas": {} }
} as const;
