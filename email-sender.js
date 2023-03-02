const emailForm = document.getElementById('email-form');
const statusTable = document.createElement('table');
const statusTableBody = document.createElement('tbody');
const statusMessage = document.getElementById('status-message');

emailForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;
  const attachment = document.getElementById('attachment').files[0];
	const emailsString = document.getElementById('emails').value;
	const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
	const emails = emailsString.match(emailPattern);

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
