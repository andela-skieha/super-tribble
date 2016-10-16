const grpc = require('grpc');

const booksProto = grpc.load('books.proto');

const client = new booksProto.books.BookService('127.0.0.1:50051', grpc.credentials.createInsecure());

function printResponse(error, response) {
  if (error) {
    console.log('Error: ', error);
  } else {
    console.log(response);
  }
}

function listBooks() {
  client.list({}, function(error, books) {
    printResponse(error, books);
  });
}

function insertBook(id, title, author) {
  const book = {
    id: parseInt(id),
    title: title,
    author: author,
  };
  client.insert(book, function(error, empty) {
    printResponse(error, book);
  });
}

function getBook(id) {
  client.get({ id: parseInt(id) }, function(error, book) {
    printResponse(error, book);
  });
}

function deleteBook(id) {
  client.delete({ id: parseInt(id) }, function(error, empty) {
    printResponse(error, empty);
  });
}

function watchBoooks() {
  const call = client.watch({});
  call.on('data', function(book) {
    console.log(book);
  });
}

const processName = process.argv.shift();
const scriptName = process.argv.shift();
const command = process.argv.shift();

if (command == 'list') {
  listBooks();
} else if (command == 'insert') {
  insertBook(process.argv[0], process.argv[1], process.argv[2]);
} else if (command == 'get') {
  getBook(process.argv[0]);
} else if (command == 'delete') {
  deleteBook(process.argv[0]);
} else if (command == 'watch') {
  watchBooks();
}
