<?php
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $email = $_POST['email'];
  $password = $_POST['password'];
  $subject = $_POST['subject'];
  $message = $_POST['message'];
  $attachment = $_FILES['attachment'];
  $currentEmail = $_POST['current_email'];

  $mail = new PHPMailer(true);

  try {
    // Server settings
    $mail->SMTPDebug = 0;
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = $email;
    $mail->Password = $password;
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    // Recipients
    $mail->setFrom($email);
    $mail->addAddress($currentEmail);

    // Attachments
    if ($attachment['error'] === UPLOAD_ERR_OK) {
      $mail->addAttachment($attachment['tmp_name'], $attachment['name']);
    }

    // Content
    $mail->isHTML(false);
    $mail->Subject = $subject;
    $mail->Body = $message;

    $mail->send();
    
    echo 'Email sent successfully.';
  } catch (Exception $e) {
    echo 'Error sending email: ' . $mail->ErrorInfo;
  }
}
