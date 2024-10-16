const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
} = require("graphql");
const app = express();

const authors = [
  { id: 1, name: "Hadis Alemayehu" },
  { id: 2, name: "Abe Gubegna" },
  { id: 3, name: "Bealu Girma" },
];

const books = [
  { id: 1, name: "Fikir Eske Mekaber", authorID: 1 },
  { id: 2, name: "Love Unto Crypt ", authorID: 1 },
  { id: 3, name: "Harry Potter and the Giblet of Fire", authorID: 1 },
  { id: 4, name: "I Will Not Be Born", authorID: 2 },
  { id: 5, name: "The Savage Girl ", authorID: 2 },
  { id: 6, name: "His Mother's Only Child ", authorID: 2 },
  { id: 7, name: "The Fall of Rome", authorID: 2 },
  { id: 8, name: "Oromay", authorID: 3 },
  { id: 9, name: "The author", authorID: 3 },
  { id: 10, name: "beyond the horizon", authorID: 3 }
];

const BookType = new GraphQLObjectType({
  name: "Book",
  descripiton: "This respresent a book written by an author",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authoreID: { type: GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      resolve: (book) => {
        return authors.find((author) => author.id == book.authorID);
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  descripiton: "This respresent a author of the book",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    books: {
      type: new GraphQLList(BookType),
      resolve: (author) => {
        return books.filter((book) => book.authorID == author.id);
      },
    },
  }),
});

const RootQureType = new GraphQLObjectType({
  name: "Query",
  description: "Root Qurey",
  fields: () => ({
    book: {
      type: BookType,
      description: "A Sing Book",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => books.find((book) => book.id === args.id),
    },
    books: {
      type: GraphQLList(BookType),
      description: "List of All Books",
      resolve: () => books,
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: "List of All Authors",
      resolve: () => authors,
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQureType,
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);
app.listen(5000, () => console.log("Server is Running"));
