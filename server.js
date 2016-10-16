const grpc = require('grpc');

const booksProto = grpc.load('books.proto');

const books = [
  {
    id: 123,
    title: 'The Opposite of Loneliness',
    author: 'Marina Keegan',
  }
];

const server = new grpc.Server();

server.addProtoService(booksProto.books.BookService.service, {
  list: function(call, callback) {
    callback(null, books);
  }
});

server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
server.start();
