"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const reflection_1 = require("@mikro-orm/reflection");
const sql_highlighter_1 = require("@mikro-orm/sql-highlighter");
const path_1 = __importDefault(require("path"));
function ormPath(name) {
    return path_1.default.join(__dirname, name);
}
const options = {
    metadataProvider: reflection_1.TsMorphMetadataProvider,
    highlighter: new sql_highlighter_1.SqlHighlighter(),
    type: 'postgresql',
    entities: ['./dist/**/entities/*.js'],
    entitiesTs: ['./src/**/entities/*.ts'],
    dbName: 'moment',
    port: 5432,
    user: 'root',
    password: 'root',
    migrations: {
        path: ormPath('migrations'),
    },
    cache: {
        pretty: true,
        options: {
            cacheDir: ormPath('.orm-cache'),
        },
    },
};
exports.default = options;
//# sourceMappingURL=mikro-orm.config.js.map