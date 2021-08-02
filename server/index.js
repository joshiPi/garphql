const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const uri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.zopvz.mongodb.net/learning-graphql?retryWrites=true&w=majority`;
try {
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, () =>
    console.log('connected'),
  );
} catch (error) {
  console.log('could not connect');
}
mongoose.connection.once('open', () => {
  console.log('connected to database');
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  }),
);

app.listen(4000, () => console.log('listening on 4000'));
