import React from 'react';

function BookRow({ book }) {
  return (
    <tr>
      <td>{book.id}</td>
      <td>{book.title}</td>
      <td>{book.author}</td>
      <td>{book.publisher}</td>
      <td>{book.price}</td>
      <td>{book.genre}</td>
      <td>{book.userId}</td>
    </tr>
  );
}

export default BookRow;