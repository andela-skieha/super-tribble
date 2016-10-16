const grpc = require('grpc');

const booksProto = grpc.load('books.proto');

const books = [
  {
    id: 123,
    title: 'The Opposite of Loneliness',
    author: 'Marina Keegan',
  }
];

let bookStream;

const server = new grpc.Server();

server.addProtoService(booksProto.books.BookService.service, {
  list: function(call, callback) {
    callback(null, books);
  },

  insert: function(call, callback) {
    const book = call.request;
    books.push(book);

    if (bookStream) {
      bookStream.write(book)
    }
    callback(null, {});
  },

  get: function(call, callback) {
    for (var i = 0; i < books.length; i++) {
      if (books[i].id == call.request.id) {
        return callback(null, books[i]);
      }
    }
    callback({
      code: grpc.status.NOT_FOUND,
      details: 'Not Found'
    });
  },

  delete: function(call, callback) {
    for (var i = 0; i < books.length; i++) {
      if (books[i].id == call.request.id) {
        books.splice(i, 1);
        return callback(null, {});
      }
    }
    callback({
      code: grpc.status.NOT_FOUND,
      details: 'Not Found'
    });
  },

  watch: function(stream) {
    bookStream = stream;
  }

});

server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
server.start();
