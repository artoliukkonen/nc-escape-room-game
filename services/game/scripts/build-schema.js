const { loadFilesSync } = require("@graphql-tools/load-files");
const { mergeTypeDefs } = require("@graphql-tools/merge");
const { print } = require("graphql");
const fs = require("fs");

const basePath = `${__dirname}/..`;
const loadedFiles = loadFilesSync(`${basePath}/src/**/*.graphql`);
const typeDefs = mergeTypeDefs(loadedFiles, { all: true });
const printedTypeDefs = print(typeDefs);
fs.writeFileSync(`${basePath}/schema.graphql`, printedTypeDefs);
