export function createLetter(reciever, id) {
  return {
    from: 'niklazq9@gmail.com',
    to: `${reciever}`,
    subject: 'FileStorage Registration',
    html: `<a href="http://localhost:55555/proofEmail?id=${id}">Click Me!</a>`,
  }
}
