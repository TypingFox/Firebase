//Document Made By: TypingFox
const numberList = document.querySelector('#phone-list');
const form = document.querySelector('#add-phone-form');
let error_el = document.querySelector('#error_msg');

// create element & render Entry
function renderEntry(doc) {
  let li = document.createElement('li');
  let name = document.createElement('span');
  let number = document.createElement('span');
  let cross = document.createElement('div');

  li.setAttribute('data-id', doc.id);
  name.textContent = doc.data().name;
  number.textContent = doc.data().number;
  cross.textContent = 'x';

  li.appendChild(name);
  li.appendChild(number);
  li.appendChild(cross);

  numberList.appendChild(li);

  // deleting data
  cross.addEventListener('click', e => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute('data-id');
    db.collection('Phonebook')
      .doc(id)
      .delete();
  });
}
// saving data
form.addEventListener('submit', e => {
  e.preventDefault();
  if (form.name.value != '') {
    if (form.number.value != '') {
    db.collection('Phonebook').add({
      name: form.name.value,
      number: form.number.value
    });
    form.name.value = '';
    form.number.value = '';
    document.getElementById('error_msg').innerHTML = '';
  } else {
    console.log('Error');
    document.getElementById('error_msg').innerHTML =
      "Don't forget the phonenumber!";
  }
} else {
  console.log('Error');
  document.getElementById('error_msg').innerHTML =
    'Please type in a name :)';
}
});

// real-time listener
db.collection('Phonebook')
  .orderBy('number')
  .onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
      console.log(change.doc.data());
      if (change.type == 'added') {
        renderEntry(change.doc);
      } else if (change.type == 'removed') {
        let li = numberList.querySelector('[data-id=' + change.doc.id + ']');
        numberList.removeChild(li);
      }
    });
  });