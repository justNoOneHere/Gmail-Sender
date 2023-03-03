const emailForm = document.getElementById('email-form');
const statusTable = document.createElement('table');
const statusTableBody = document.createElement('tbody');
const statusMessage = document.getElementById('status-message');

const fileInput = document.getElementById('file-upload');
const uploadButton = document.getElementById('upload-button');
const emailsTextarea = document.getElementById('emails');
    const editor = document.querySelector('.editor');
    const hiddenTextarea = document.querySelector('#message');
    const toolbarButtons = document.querySelectorAll('.toolbar-button');
    const toolbarSelect = document.querySelector('.toolbar-select');

    function execCommand(command, value = null) {
      document.execCommand(command, false, value);
      editor.focus();
    }

    toolbarButtons.forEach(button => {
      button.addEventListener('click', () => {
        execCommand(button.dataset.command);
      });
    });

    toolbarSelect.addEventListener('change', () => {
      execCommand(toolbarSelect.dataset.command, toolbarSelect.value);
});

editor.addEventListener('input', () => {
  hiddenTextarea.value = editor.innerHTML;
});

hiddenTextarea.addEventListener('input', () => {
  editor.innerHTML = hiddenTextarea.value;
});

editor.addEventListener('paste', (event) => {
  event.preventDefault();
  const text = event.clipboardData.getData('text/plain');
  document.execCommand('insertHTML', false, text);
});

editor.addEventListener('keydown', (event) => {
  if (event.keyCode === 9) {
    event.preventDefault();
    document.execCommand('insertHTML', false, '&#009');
  }
});


uploadButton.addEventListener('click', function() {
  const files = fileInput.files;
  for (let i = 0; i < files.length; i++) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const contents = e.target.result;
      const emails = contents.split('\n');
      for (let j = 0; j < emails.length; j++) {
        const email = emails[j].trim();
        if (email !== '') {
          emailsTextarea.value += email + '\n';
        }
      }
    };
    reader.readAsText(files[i]);
  }
});


emailForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;
  const attachment = document.getElementById('attachment').files[0];
	const emailsString = document.getElementById('emails').value;
	const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
	const uniqueEmails = emailsString.match(emailPattern);
	const emails = [...new Set(uniqueEmails)];
	
  let currentEmailIndex = 0;

  function sendEmail() {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'email-sender.php'); // replace with your server-side script URL
  
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          const statusTextArea = document.getElementById('status-message');
          statusTextArea.value += '$ > [+] ' + `${emails[currentEmailIndex]} - ${xhr.responseText}\n`;
        } else {
          const statusTextArea = document.getElementById('status-message');
          statusTextArea.value += '$ > [+] ' +`${emails[currentEmailIndex]} - Error sending email.\n`;
        }
  
        currentEmailIndex++;
  
        if (currentEmailIndex < emails.length) {
          sendEmail();
        }
      }
    };
	const statusMessageTextarea = document.getElementById('status-message');
  statusMessageTextarea.scrollTop = statusMessageTextarea.scrollHeight;

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('subject', subject);
    formData.append('message', message);
    formData.append('attachment', attachment);
    formData.append('current_email', emails[currentEmailIndex].trim());
  
    xhr.send(formData);
  }
  
  if (!email || !password || !subject || !message || !emails) {
    alert("Please fill in all fields.");
  } else {
    sendEmail();
  }
});
