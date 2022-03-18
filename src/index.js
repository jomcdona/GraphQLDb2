//const { React } = require('react');
const { ApolloServer } = require('apollo-server');
const { ApolloClient, InMemoryCache } = require('@apollo/client')
const {RestLink} = require('apollo-link-rest');
const { RESTDataSource } = require('apollo-datasource-rest');
const fs = require('fs');
const path = require('path');
//const DB2Api  = require('./db2-api');
//const resolvers = require('./resolver');

class DB2Api extends RESTDataSource {
  constructor() {
    // Always call super()
    console.log("In constructor");
    super();
    // Sets the base URL for the REST API
    this.baseURL = 'https://tonye1-api-sample-database-tomcat.us-south.cf.appdomain.cloud/';
  }

  async getUserList() {
    // Send a GET request to the specified endpoint
    console.log("getuserList called");
    return this.get(`getdb2cloud`);
  }

}

const resolvers = {
  Query: {
    users: async (_, {}, { dataSources }) => {
      return dataSources.db2API.getUserList();
    },
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
  ),
  resolvers,
  dataSources: () =>  ({
      db2API: new DB2Api(),
  }),
});

server
  .listen()
  .then(({ url }) =>
    console.log(`Server is running on ${url}`)
  );
