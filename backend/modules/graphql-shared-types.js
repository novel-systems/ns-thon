const { buildSchema } = require('graphql')
const { SharedGraphQLTypes } = require('@novel.systems/shared/schemas')

const SharedSchema = buildSchema(SharedGraphQLTypes)

module.exports = SharedSchema._typeMap
