const graphql = require('graphql');
// const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');
const Review = require('../models/reviews');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

// //dummy
// var books = [
//   { name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId: '1' },
//   { name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '2' },
//   { name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '3' },
//   { name: 'The Wide Earth', genre: 'Sci-Fi', id: '3', authorId: '3' },
//   { name: 'The First Empire', genre: 'Fantasy', id: '2', authorId: '2' },
// ];

// var authors = [
//   { name: 'author 1', age: '20', id: '1' },
//   { name: 'author 2', age: '22', id: '2' },
//   { name: 'author 2', age: '25', id: '3' },
// ];

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      //resolve for dummy
      // resolve(parent, args) {
      //   return _.find(authors, { id: parent.authorId });
      // },
      resolve(parent, args) {
        return Author.findById(parent.authorId);
      },
    },
    reviews: {
      type: new GraphQLList(BookReviewType),
      resolve(parent, args) {
        return Review.find({
          bookId: parent.id,
        });
      },
    },
  }),
});

const BookReviewType = new GraphQLObjectType({
  name: 'BookReview',
  fields: () => ({
    id: { type: GraphQLID },
    rating: { type: GraphQLInt },
    comment: { type: GraphQLString },
    bookId: { type: GraphQLID },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      //dummy
      // resolve(parent, args) {
      //   return _.filter(books, { authorId: parent.id });
      // },
      resolve(parent, args) {
        return Book.find({
          authorId: parent.id,
        });
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // code to get data from db / other source
        // return _.find(books, { id: args.id });
        return Book.findById(args.id);
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return _.find(authors, { id: args.id });
        return Author.findById(args.id);
      },
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        // return books;
        return Book.find({});
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        // return authors;
        return Author.find({});
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age,
        });
        return author.save();
      },
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId,
        });
        return book.save();
      },
    },
    addReview: {
      type: BookReviewType,
      args: {
        comment: { type: new GraphQLNonNull(GraphQLString) },
        rating: { type: new GraphQLNonNull(GraphQLInt) },
        bookId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let review = new Review({
          bookId: args.bookId,
          comment: args.comment,
          rating: args.rating,
        });
        return review.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
