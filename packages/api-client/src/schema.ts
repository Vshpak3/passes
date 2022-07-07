export const schema = {
  "openapi": "3.0.0",
  "paths": {
    "/api/auth/user": {
      "get": {
        "operationId": "Auth_getCurrentUser",
        "summary": "Gets the current authenticated user",
        "parameters": [],
        "responses": {
          "200": {
            "description": "Gets the current authenticated user",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/GetCurrentUserDto"
                }
              }
            }
          }
        },
        "tags": [
          "auth"
        ]
      }
    },
    "/api/user": {
      "post": {
        "operationId": "User_create",
        "summary": "Creates a user",
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateUserDto"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "A user was created",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateUserDto"
                }
              }
            }
          }
        },
        "tags": [
          "user"
        ]
      },
      "patch": {
        "operationId": "User_update",
        "summary": "Updates a user",
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateUserDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "A user was updated"
          }
        },
        "tags": [
          "user"
        ]
      },
      "delete": {
        "operationId": "User_delete",
        "summary": "Disables a user account",
        "parameters": [],
        "responses": {
          "200": {
            "description": "A user account was disabled"
          }
        },
        "tags": [
          "user"
        ]
      }
    },
    "/api/user/{id}": {
      "get": {
        "operationId": "User_findOne",
        "summary": "Gets a user",
        "parameters": [
          {
            "name": "id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "A user was retrieved",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateUserDto"
                }
              }
            }
          }
        },
        "tags": [
          "user"
        ]
      }
    },
    "/api/auth/google": {
      "get": {
        "operationId": "GoogleOauth_googleAuth",
        "summary": "Start the google oauth flow",
        "parameters": [],
        "responses": {
          "200": {
            "description": "Start the google oauth flow"
          }
        },
        "tags": [
          "auth/google"
        ]
      }
    },
    "/api/auth/google/redirect": {
      "get": {
        "operationId": "GoogleOauth_googleAuthRedirect",
        "summary": "Redirect from google oauth flow",
        "parameters": [],
        "responses": {
          "200": {
            "description": "Redirect from google oauth flow"
          }
        },
        "tags": [
          "auth/google"
        ]
      }
    },
    "/api/comment": {
      "post": {
        "operationId": "Comment_create",
        "summary": "Creates a comment",
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateCommentDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "A comment was created",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateCommentDto"
                }
              }
            }
          }
        },
        "tags": [
          "comment"
        ]
      }
    },
    "/api/comment/{id}": {
      "get": {
        "operationId": "Comment_findOne",
        "summary": "Gets a comment",
        "parameters": [
          {
            "name": "id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "A comment was retrieved",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateCommentDto"
                }
              }
            }
          }
        },
        "tags": [
          "comment"
        ]
      },
      "patch": {
        "operationId": "Comment_update",
        "summary": "Updates a comment",
        "parameters": [
          {
            "name": "id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateCommentDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "A comment was updated"
          }
        },
        "tags": [
          "comment"
        ]
      },
      "delete": {
        "operationId": "Comment_remove",
        "summary": "Deletes a comment",
        "parameters": [
          {
            "name": "id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "A comment was deleted"
          }
        },
        "tags": [
          "comment"
        ]
      }
    },
    "/api/health": {
      "get": {
        "operationId": "Health_health",
        "summary": "Health check endpoint",
        "parameters": [],
        "responses": {
          "200": {
            "description": "App is running"
          }
        },
        "tags": [
          "health"
        ]
      }
    },
    "/api/pass": {
      "post": {
        "operationId": "Pass_create",
        "summary": "Creates a pass",
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreatePassDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "A pass was created",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreatePassDto"
                }
              }
            }
          }
        },
        "tags": [
          "pass"
        ]
      }
    },
    "/api/pass/{id}": {
      "get": {
        "operationId": "Pass_findOne",
        "summary": "Gets a pass",
        "parameters": [
          {
            "name": "id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "A pass was retrieved",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreatePassDto"
                }
              }
            }
          }
        },
        "tags": [
          "pass"
        ]
      },
      "patch": {
        "operationId": "Pass_update",
        "summary": "Updates a pass",
        "parameters": [
          {
            "name": "id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdatePassDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "A pass was updated"
          }
        },
        "tags": [
          "pass"
        ]
      },
      "delete": {
        "operationId": "Pass_remove",
        "summary": "Deletes a pass",
        "parameters": [
          {
            "name": "id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "A pass was deleted"
          }
        },
        "tags": [
          "pass"
        ]
      }
    },
    "/api/post": {
      "post": {
        "operationId": "Post_create",
        "summary": "Creates a post",
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreatePostDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "A post was created",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreatePostDto"
                }
              }
            }
          }
        },
        "tags": [
          "post"
        ]
      }
    },
    "/api/post/{id}": {
      "get": {
        "operationId": "Post_findOne",
        "summary": "Gets a post",
        "parameters": [
          {
            "name": "id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "A post was retrieved",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreatePostDto"
                }
              }
            }
          }
        },
        "tags": [
          "post"
        ]
      },
      "patch": {
        "operationId": "Post_update",
        "summary": "Updates a post",
        "parameters": [
          {
            "name": "id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdatePostDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "A post was updated"
          }
        },
        "tags": [
          "post"
        ]
      },
      "delete": {
        "operationId": "Post_remove",
        "summary": "Deletes a post",
        "parameters": [
          {
            "name": "id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "A post was deleted"
          }
        },
        "tags": [
          "post"
        ]
      }
    },
    "/api/profile": {
      "post": {
        "operationId": "Profile_create",
        "summary": "Creates a profile",
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateProfileDto"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "A profile was created",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/GetProfileDto"
                }
              }
            }
          }
        },
        "tags": [
          "profile"
        ]
      }
    },
    "/api/profile/usernames": {
      "get": {
        "operationId": "Profile_getAllUsernames",
        "summary": "Gets all usernames",
        "parameters": [],
        "responses": {
          "200": {
            "description": "Gets all usernames",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateProfileDto"
                }
              }
            }
          }
        },
        "tags": [
          "profile"
        ]
      }
    },
    "/api/profile/usernames/{username}": {
      "get": {
        "operationId": "Profile_findOneByUsername",
        "summary": "Gets a profile by username",
        "parameters": [
          {
            "name": "username",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "A profile was retrieved",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/GetProfileDto"
                }
              }
            }
          }
        },
        "tags": [
          "profile"
        ]
      }
    },
    "/api/profile/{id}": {
      "get": {
        "operationId": "Profile_findOne",
        "summary": "Gets a profile",
        "parameters": [
          {
            "name": "id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "A profile was retrieved",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/GetProfileDto"
                }
              }
            }
          }
        },
        "tags": [
          "profile"
        ]
      },
      "patch": {
        "operationId": "Profile_update",
        "summary": "Updates a profile",
        "parameters": [
          {
            "name": "id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateProfileDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "A profile was updated",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/GetProfileDto"
                }
              }
            }
          }
        },
        "tags": [
          "profile"
        ]
      },
      "delete": {
        "operationId": "Profile_remove",
        "summary": "Deletes a profile",
        "parameters": [
          {
            "name": "id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "A profile was deleted",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/GetProfileDto"
                }
              }
            }
          }
        },
        "tags": [
          "profile"
        ]
      }
    },
    "/api/settings/{id}": {
      "get": {
        "operationId": "Settings_findOne",
        "summary": "Gets settings",
        "parameters": [
          {
            "name": "id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Settings were retrieved",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateSettingsDto"
                }
              }
            }
          }
        },
        "tags": [
          "settings"
        ]
      },
      "patch": {
        "operationId": "Settings_update",
        "summary": "Updates settings",
        "parameters": [
          {
            "name": "id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateSettingsDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Settings were updated"
          }
        },
        "tags": [
          "settings"
        ]
      }
    },
    "/api/subscription": {
      "post": {
        "operationId": "Subscription_create",
        "summary": "Creates a subscription",
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateSubscriptionDto"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "A subscription was created",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateSubscriptionDto"
                }
              }
            }
          }
        },
        "tags": [
          "subscription"
        ]
      }
    },
    "/api/subscription/{id}": {
      "get": {
        "operationId": "Subscription_findOne",
        "summary": "Gets a subscription",
        "parameters": [
          {
            "name": "id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "A subscription was retrieved",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateSubscriptionDto"
                }
              }
            }
          }
        },
        "tags": [
          "subscription"
        ]
      },
      "delete": {
        "operationId": "Subscription_remove",
        "summary": "Deletes a subscription",
        "parameters": [
          {
            "name": "id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "A subscription was deleted"
          }
        },
        "tags": [
          "subscription"
        ]
      }
    }
  },
  "info": {
    "title": "Moment Backend",
    "description": "Be in the moment",
    "version": "1.0",
    "contact": {}
  },
  "tags": [],
  "servers": [],
  "components": {
    "schemas": {
      "GetCurrentUserDto": {
        "type": "object",
        "properties": {}
      },
      "CreateUserDto": {
        "type": "object",
        "properties": {}
      },
      "UpdateUserDto": {
        "type": "object",
        "properties": {}
      },
      "CreateCommentDto": {
        "type": "object",
        "properties": {}
      },
      "UpdateCommentDto": {
        "type": "object",
        "properties": {}
      },
      "CreatePassDto": {
        "type": "object",
        "properties": {}
      },
      "UpdatePassDto": {
        "type": "object",
        "properties": {}
      },
      "CreatePostDto": {
        "type": "object",
        "properties": {}
      },
      "UpdatePostDto": {
        "type": "object",
        "properties": {}
      },
      "CreateProfileDto": {
        "type": "object",
        "properties": {}
      },
      "GetProfileDto": {
        "type": "object",
        "properties": {}
      },
      "UpdateProfileDto": {
        "type": "object",
        "properties": {}
      },
      "CreateSettingsDto": {
        "type": "object",
        "properties": {}
      },
      "UpdateSettingsDto": {
        "type": "object",
        "properties": {}
      },
      "CreateSubscriptionDto": {
        "type": "object",
        "properties": {}
      }
    }
  }
} as const;
