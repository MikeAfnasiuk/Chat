'use strict';
let nameCheck = getCookie();
let userLi;


window.onload = () => {
  //document.getElementById('u-name').innerHTML = getCookie();
  const block = document.getElementById('messages');

};
function getUserLi(value,callback) {

  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      userLi = JSON.parse(this.responseText);
      console.log('touched');
      callback(value);
    }
  };
  xhr.open('GET', '/index.js?uname=', true);
  xhr.setRequestHeader('cause', 'search');
  xhr.send();

}

function serchRes(value) {
  let res = '';
  if (value === '') {
    document.getElementById('search-res').innerHTML = '<p>No users found</p>';
    document.getElementById('users').style.display = 'block';
    document.getElementById('search-res').style.display = 'none';
  } else {

    for (let i = 0; i < userLi.length; i++) {
      if (userLi[i].indexOf(value) === 0) {
        res += '<div class="searchedItemContainer" ' +
                    'onclick="chat(\'' + userLi[i] + '\')">' + userLi[i] + '</div>\n';
      }
    }
    document.getElementById('search-res').innerHTML = res;
    document.getElementById('users').style.display = 'none';
    document.getElementById('search-res').style.display = 'block';
  }
}

function search(value) {
  if (!userLi){
    getUserLi(value, serchRes);
  } else serchRes(value);

}

let currentChat = '';

let displayFlag = false;

function getCookie() {
  const   matches = document.cookie.match(new RegExp(
    '(?:^|; )' + 'user'.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

const chat = (user2) => {
  userLi = '';
  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const data = JSON.parse(this.responseText);

      document.getElementById('users').innerHTML = data[1];
      document.getElementById('searchField').value = '';
      document.getElementById('search-res').innerHTML = '<p>No users found</p>';
      document.getElementById('users').style.display = 'block';
      document.getElementById('search-res').style.display = 'none';
      goToChat(data[0]);

      document.getElementById('users').innerHTML = data[0] + data[1];
    }
  };
  xhr.open('POST', '/index.js?uname='+user2, true);
  xhr.setRequestHeader('cause', 'chatCreate');
  xhr.send();

};

const goToChat = (chatId) => {

  const userWith = document.getElementById(chatId).innerHTML;

  //document.getElementById('chat-header').innerHTML = userWith.replace('<br>','');

  if (currentChat !== ''){
    document.getElementById(currentChat).style =
            document.getElementsByClassName('chatContainer').style;
  }
  //        document.getElementById(chatId).style.backgroundColor = '#ff5c00';
  document.getElementById(chatId).style.backgroundColor = '#656870';

  currentChat = chatId;

  if(!displayFlag){
    document.getElementById('messages').style.display = 'block';
    document.getElementById('right-footer').style.display = 'block';
    displayFlag = true;
  }
  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const data = JSON.parse(this.responseText);
      let res = '';
      for (let i = 0; i<data.length;i++){

        // res += '<div>' + data[i].userSent + ': ' + data[i].messText + '</div>\n';

        if (data[i].userSent == nameCheck) {
          res += '<div id="right-message">' + '<div class="right-container">' + data[i].messText + '</div>' + '<div class="clear"></div>' + '</div>';
        } else {
          res += '<div id="left-message">' + '<div class="left-container">' + data[i].messText + '</div>' + '<div class="clear"></div>' + '</div>';
        }
      }
      document.getElementById('messages').innerHTML = res;


    }
  };
  xhr.open('POST', '/index.js?chatId='+chatId, true);
  xhr.setRequestHeader('cause', 'chatOpen');
  xhr.send();
};

const singOut = () => {

  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      location.href = '/login';
    }
  };
  xhr.open('POST', '/logout', true);
  xhr.send();
};

const socket = io({transports: ['websocket']});

socket.on('broadcast', function (data) {
  render(data);
  //document.getElementById(data.chatId).getElementsByTagName('DIV')[5].innerHTML = data.message;
});

socket.on('clear1', function () {
  document.getElementById('messages').innerHTML = '<div></div>';
});

function sendMessage(nickname, message) {

  if (message === 'clear') {
    socket.emit('clear');

  }

  else if(nickname && message) {
    socket.emit('message', {nickname: nickname, message: message, chatId: currentChat});
  }

}

function render(data) {

  // let currentLast = document.getElementById(currentChat).innerHTML;
  // currentLast = currentLast.getElementById('lastMessage').innerHTML = data.message;
    if (data.chatId === currentChat) {
        if (data.nickname == nameCheck) {
            document.getElementById('messages').innerHTML += '<div id="right-message">' + '<div class="right-container">' + data.message + '</div>' + '<div class="clear"></div>' + '</div>';
        } else {
           // soundClick();
            document.getElementById('messages').innerHTML += '<div id="left-message">' + '<div class="left-container">' + data.message + '</div>' + '<div class="clear"></div>' + '</div>';
        };
        console.log(data.chatId);
        //document.getElementById(data.chatId).getElementsByTagName('DIV')[1].innerHTML = data.message;
    }
    document.getElementById(data.chatId).getElementsByTagName('DIV')[5].innerHTML = data.message;
};



// let chatLi = '';
// let i = 0;
// for (let key in lastMessages){
//   chatLi += '<div class="chatContainer" id="'+ key +
//
//     '" onclick="goToChat(\'' + key + '\')"><div id="chatUser">' +
//
//     chatUser[i] + '</div><div id="lastMessage">'+ lastMessages[key] +'</div></div>' ;
//   i++;
// }

